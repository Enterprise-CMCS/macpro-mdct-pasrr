import { ReportStatus } from "@pasrr/shared";
import { EMAIL_TRIGGERS } from "./email";

const FROM_ADDRESS = "MDCT_NoReply@cms.hhs.gov";

export const getEmailTemplate = (emailTrigger: EMAIL_TRIGGERS, data: any) => {
  switch (emailTrigger) {
    case EMAIL_TRIGGERS.REPORT_COMMENT:
      return getReportCommentTemplate(data);
    case EMAIL_TRIGGERS.REPORT_STATUS_CHANGE:
      return getReportStatusChangeTemplate(data);
    case EMAIL_TRIGGERS.REQUEST_FEEDBACK:
      return getRequestFeedbackTemplate(data);
  }
};

const getReportCommentTemplate = ({
  reportName,
  recipients,
}: {
  reportName: string;
  recipients: string[];
}) => ({
  Source: FROM_ADDRESS,
  Destination: {
    ToAddresses: recipients,
  },
  Message: {
    Subject: { Data: `PASRR: New comment on ${reportName}` },
    Body: {
      Text: {
        Data: `
This is an automated notification that a comment has been added to a report within the MDCT Preadmission Screening and Resident Review (PASRR) platform.

Update summary

    Report name: ${reportName}

    Activity: New report comment added

    Date of change: ${new Date().toDateString()}

    Please follow the steps below to navigate to the comment within the portal:

    1. Log in to the PASRR Portal: https://mdctpasrr.cms.gov
    2. Find ${reportName}
    3. Select Manage.

    If you believe this notification was sent in error, or if you have questions, please reach out to the PASRR support desk.

    Sincerely,

    The PASRR Team
`,
      },
    },
  },
});

const getReportStatusChangeTemplate = ({
  reportName,
  recipients,
  status,
}: {
  reportName: string;
  recipients: string[];
  status: ReportStatus;
}) => ({
  Source: FROM_ADDRESS,
  Destination: {
    ToAddresses: recipients,
  },
  Message: {
    Subject: { Data: `PASRR: Status update for ${reportName}` },
    Body: {
      Text: {
        Data: `Dear User,

This is an automated notification to inform you that there has been a change in the status of a report within the Preadmission Screening and Resident Review (PASRR) platform on MDCT.

Please find the details of the update below:

Update summary

    Report name: ${reportName}

    New status: ${status}

    Date of change: ${new Date().toDateString()}

If you believe this status change was made in error, or if you have questions regarding the requirements for this new status, please contact your system administrator or reach out to the PASRR support desk.
`,
      },
    },
  },
});

const getRequestFeedbackTemplate = ({
  reportName,
  recipients,
}: {
  reportName: string;
  recipients: string[];
}) => ({
  Source: FROM_ADDRESS,
  Destination: {
    ToAddresses: recipients,
  },
  Message: {
    Subject: { Data: `PASRR: ${reportName} sections ready for review` },
    Body: {
      Text: {
        Data: `Dear User,

This is an automated notification that sections of a report are ready for review within the MDCT Preadmission Screening and Resident Review (PASRR) platform. Please note that this is not a final submission; the State is still working on this report and remains in an In Progress status.

The State has included a report-level comment specifying which sections are ready for your review.

Update summary

    Report name: ${reportName}

    Activity: New report-level comment added

    Date of change: ${new Date().toDateString()}

Please follow the steps below to navigate to the comment within the portal:

    1. Log in to the PASRR Portal: https://mdctpasrr.cms.gov
    2. Find ${reportName}
    3. Select Comment/Status from the report dashboard to review the State's notes.

If you believe this notification was sent in error, or if you have questions, please reach out to the PASRR support desk.

    Sincerely,
`,
      },
    },
  },
});
