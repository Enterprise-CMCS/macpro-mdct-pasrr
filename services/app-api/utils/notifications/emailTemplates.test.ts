import { EMAIL_TRIGGERS } from "./email";
import { getEmailTemplate } from "./emailTemplates";

const genericData = {
  reportName: "State Annual Report 1",
  recipients: ["user1@test.com", "user2@test.com"],
  status: "Report status",
};

describe("emailTemplate util", () => {
  test("returns report comment template for report comment trigger", () => {
    const template = getEmailTemplate(
      EMAIL_TRIGGERS.REPORT_COMMENT,
      genericData
    );
    expect(template).toEqual(
      expect.objectContaining({
        Destination: {
          ToAddresses: genericData.recipients,
        },
        Message: expect.objectContaining({
          Subject: { Data: `PASRR: New comment on ${genericData.reportName}` },
        }),
      })
    );
  });

  test("returns report status template for report status trigger", () => {
    const template = getEmailTemplate(
      EMAIL_TRIGGERS.REPORT_STATUS_CHANGE,
      genericData
    );
    expect(template).toEqual(
      expect.objectContaining({
        Destination: {
          ToAddresses: genericData.recipients,
        },
        Message: expect.objectContaining({
          Subject: {
            Data: `PASRR: Status update for ${genericData.reportName}`,
          },
        }),
      })
    );
  });

  test("returns request feedback template for request feedback trigger", () => {
    const template = getEmailTemplate(
      EMAIL_TRIGGERS.REQUEST_FEEDBACK,
      genericData
    );
    expect(template).toEqual(
      expect.objectContaining({
        Destination: {
          ToAddresses: genericData.recipients,
        },
        Message: expect.objectContaining({
          Subject: {
            Data: `PASRR: ${genericData.reportName} sections ready for review`,
          },
        }),
      })
    );
  });
});
