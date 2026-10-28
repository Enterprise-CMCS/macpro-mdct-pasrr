import { isDatadogEnabled } from "./utils/datadog-env.ts";
import { isLocalStack } from "./local/util.ts";
import { getSecret } from "./utils/secrets-manager.ts";

export interface DeploymentConfigProperties {
  project: string;
  stage: string;
  isDev: boolean;
  oktaMetadataUrl: string;
  launchDarklyClient: string;
  launchDarklyServer: string;
  redirectSignout: string;
  cloudfrontCertificateArn?: string;
  cloudfrontDomainName?: string;
  secureCloudfrontDomainName?: string;
  vpnIpSetArn?: string;
  vpnIpv6SetArn?: string;
  userPoolDomainPrefix?: string;
  vpcName: string;
  kafkaAuthorizedSubnetIds: string;
  brokerString: string;
  datadogApiKey?: string;
  dkimPrivateKey?: string;
}

export const determineDeploymentConfig = async (stage: string) => {
  const project = process.env.PROJECT!;
  const isDev = isLocalStack || !["main", "val", "production"].includes(stage);
  const defaultSecret = await loadDefaultSecret(project, stage);
  const secretConfigOptions = {
    ...defaultSecret,
    ...(await loadStageSecret(project, stage)),
  };

  const config = {
    project,
    stage,
    isDev,
    ...secretConfigOptions,
  };
  if (config.cloudfrontDomainName) {
    config.secureCloudfrontDomainName = `https://${config.cloudfrontDomainName}/`;
  }

  if (!isLocalStack && stage !== "bootstrap") {
    validateConfig(config);
  }

  if (!config.isDev) {
    assertDkimPrivateKey(defaultSecret.dkimPrivateKey);
  }
  // The identity reads this from Secrets Manager at deploy time. Drop it so the
  // private key is not carried on the stack props.
  delete config.dkimPrivateKey;

  return config;
};

export const loadDefaultSecret = async (project: string, stage?: string) => {
  if (stage === "bootstrap") {
    return {};
  } else {
    return JSON.parse((await getSecret(`${project}-default`))!);
  }
};

const loadStageSecret = async (project: string, stage: string) => {
  const secretName = `${project}-${stage}`;
  try {
    return JSON.parse((await getSecret(secretName))!);
  } catch (error: any) {
    console.warn(
      `Optional stage secret "${secretName}" not found: ${error.message}`
    );
    return {};
  }
};

function validateConfig(
  config: Record<string, any>
): asserts config is DeploymentConfigProperties {
  const expectedKeys = [
    "project",
    "stage",
    "oktaMetadataUrl",
    "launchDarklyClient",
    "launchDarklyServer",
    "redirectSignout",
    "vpcName",
    "brokerString",
    "kafkaAuthorizedSubnetIds",
  ];

  const invalidKeys = expectedKeys.filter(
    (key) => !config[key] || typeof config[key] !== "string"
  );

  if (invalidKeys.length > 0) {
    throw new Error(
      `The following deployment config keys are missing or invalid: ${invalidKeys}`
    );
  }

  if (
    isDatadogEnabled(config.stage) &&
    (!config.datadogApiKey || typeof config.datadogApiKey !== "string") // pragma: allowlist secret
  ) {
    throw new Error(
      "datadogApiKey is missing or invalid in the project default secret; it is required for val and production stages"
    );
  }
}

function assertDkimPrivateKey(value: unknown): asserts value is string {
  const isOneLineKey =
    typeof value === "string" &&
    value.length > 0 &&
    !value.includes("BEGIN") && // pragma: allowlist secret
    !/\s/.test(value);
  if (!isOneLineKey) {
    throw new Error(
      'dkimPrivateKey is missing or invalid in the project default secret; store the one-line base64 private key (no PEM headers) under "dkimPrivateKey" before deploying main, val, or production'
    );
  }
}
