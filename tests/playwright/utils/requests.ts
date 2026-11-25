import { request } from "@playwright/test";
import * as aws4 from "aws4";
import * as crypto from "node:crypto";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type UserType = "ADMIN" | "STATE";

export interface RawApiResponse {
  status: number;
  statusText: string;
  rawText: string;
}

/** Reads the Cognito ID token that env.setup.ts saved for a logged-in user. */
function getIdToken(userType: UserType): string {
  const idToken = process.env[`${userType}_ID_TOKEN`];
  if (!idToken) {
    throw new Error(`No ID token was saved for the ${userType} user`);
  }
  return idToken;
}

/**
 * Signs headers using AWS SigV4, with the credentials env.setup.ts saved for
 * a logged-in user.
 */
function signHeaders(
  endpoint: string,
  method: HttpMethod,
  headers: Record<string, string>,
  body: string | undefined,
  userType: UserType
): Record<string, string> {
  const url = new URL(endpoint);

  const signedRequest = aws4.sign(
    {
      service: "execute-api",
      region: process.env.COGNITO_REGION || "us-east-1",
      method,
      host: url.host,
      path: url.pathname + url.search,
      headers: { ...headers, Host: url.host },
      body: body || "",
    },
    {
      accessKeyId: process.env[`${userType}_AWS_ACCESS_KEY_ID`],
      secretAccessKey: process.env[`${userType}_AWS_SECRET_ACCESS_KEY`],
      sessionToken: process.env[`${userType}_AWS_SESSION_TOKEN`],
    }
  );

  // Convert all header values to strings for Playwright compatibility
  const stringHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(signedRequest.headers || {})) {
    stringHeaders[key] = String(value);
  }
  return stringHeaders;
}

/**
 * Sends an API request with the given token, and returns the response
 * whatever its status.
 */
async function executeSignedRequest(
  method: HttpMethod,
  apiPath: string,
  token: string,
  body?: unknown,
  userType: UserType = "STATE"
): Promise<RawApiResponse> {
  const endpoint = process.env.API_URL + apiPath;
  const bodyString = body === undefined ? undefined : JSON.stringify(body);

  // The token is set before SigV4 signing, so x-api-key is a signed header
  let headers: Record<string, string> = { "x-api-key": token };
  if (bodyString !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  // LocalStack doesn't enforce IAM auth but the deployed API Gateway does
  const isLocalStack = new URL(endpoint).host.includes("localstack");
  if (!isLocalStack) {
    headers = signHeaders(endpoint, method, headers, bodyString, userType);
  }

  const apiContext = await request.newContext();
  try {
    const response = await apiContext.fetch(endpoint, {
      method,
      headers,
      data: bodyString,
    });
    return {
      status: response.status(),
      statusText: response.statusText(),
      rawText: await response.text(),
    };
  } finally {
    await apiContext.dispose();
  }
}

/**
 * Makes an API request with a real user's token, without throwing on an
 * error status.
 */
export async function authenticatedRawRequest(
  method: HttpMethod,
  apiPath: string,
  body?: unknown,
  userType: UserType = "STATE"
): Promise<RawApiResponse> {
  return executeSignedRequest(
    method,
    apiPath,
    getIdToken(userType),
    body,
    userType
  );
}

/** Makes an API request with a token of the caller's choosing. */
export async function requestWithCustomToken(
  method: HttpMethod,
  apiPath: string,
  customToken: string,
  body?: unknown
): Promise<RawApiResponse> {
  return executeSignedRequest(method, apiPath, customToken, body);
}

/** Builds a token that was not issued by Cognito, for negative tests. */
export function buildForgedJwt(
  state: string = "TX",
  role: string = "mdctpasrr-bor",
  userType: UserType = "STATE",
  expiration: number = 9999999999
): string {
  // Pulls the real issuer for the active test environment from the saved token
  const realToken = getIdToken(userType);
  const realPayload = JSON.parse(
    Buffer.from(realToken.split(".")[1], "base64url").toString("utf8")
  );

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    "cognito:username": "retest-forge-user",
    "custom:cms_roles": role,
    "custom:cms_state": state,
    email: "retest-user@example.com",
    iss: realPayload.iss,
    exp: expiration,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );
  const fakeSignature = crypto
    .createHash("sha256")
    .update("fake_secret")
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
}
