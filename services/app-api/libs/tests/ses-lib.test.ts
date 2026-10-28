import { mockClient } from "aws-sdk-client-mock";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import sesLib from "../ses-lib";

// Squash console output during these tests
vi.spyOn(console, "debug").mockImplementation(() => {});

const sesMock = mockClient(SESClient);

const mockParams = {
  Source: "MDCT_NoReply@mdct.cms.gov",
  Destination: { ToAddresses: ["test@example.com"] },
  Message: {
    Subject: { Data: "Test Subject" },
    Body: { Text: { Data: "Test Body" } },
  },
};

describe("sendSesEmail", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    sesMock.reset();
  });

  test("should call client.send with a SendEmailCommand", async () => {
    vi.stubEnv("SES_CONFIGURATION_SET", "");
    sesMock.on(SendEmailCommand).resolves({});

    await sesLib.sendSesEmail(mockParams);

    expect(sesMock.calls()).toHaveLength(1);
    expect(sesMock.calls()[0].args[0].input).toMatchObject(mockParams);
  });

  test("should use the configured SES configuration set", async () => {
    vi.stubEnv("SES_CONFIGURATION_SET", "pasrr-val-email-configuration-set");
    sesMock.on(SendEmailCommand).resolves({});

    await sesLib.sendSesEmail(mockParams);

    expect(sesMock.calls()[0].args[0].input).toMatchObject({
      ...mockParams,
      ConfigurationSetName: "pasrr-val-email-configuration-set",
    });
  });
});
