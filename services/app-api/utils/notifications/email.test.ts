import { sendEmail } from "./email";
import sesLib from "../../libs/ses-lib";
import { validReport } from "../tests/mockReport";
import { User } from "../../types/types";
import { saveNotifications } from "./notifications";
import { queryRecipientsByState } from "../../storage/notificationRecipients";
import {
  CommentType,
  NotificationRecipientRecord,
  UserRoles,
} from "@pasrr/shared";
import { getReport } from "../../storage/reports";
import { getEmailTemplate } from "./emailTemplates";
import { Mock } from "vitest";
import { logger } from "../../libs/debug-lib";

vi.mock("../../libs/ses-lib", () => ({
  default: {
    sendSesEmail: vi.fn(),
  },
}));

vi.mock("./notifications");
const mockSaveNotifications = vi.mocked(saveNotifications);

vi.mock("../../storage/notificationRecipients");
const mockQueryRecipients = vi.mocked(queryRecipientsByState);
mockQueryRecipients.mockResolvedValue([
  {
    state: "NJ",
    email: "njrecipient@user.com",
  } as NotificationRecipientRecord,
]);

vi.mock("../../storage/reports");
const mockGetReport = vi.mocked(getReport);

vi.mock("./emailTemplates");
const mockGetEmailTemplate = vi.mocked(getEmailTemplate);
mockGetEmailTemplate.mockReturnValue({
  Source: "MOCK@CMS.GOV",
  Destination: {
    ToAddresses: ["test1@cms.gov", "test2@cms.gov"],
  },
  Message: {
    Subject: { Data: `Mock email` },
    Body: {
      Text: {
        Data: `This is a mock email`,
      },
    },
  },
});

vi.mock("../../libs/debug-lib");
const mockLogger = vi.mocked(logger);

const mockReportWithRecipients: any = structuredClone(validReport);
mockReportWithRecipients.pages[1].elements[2].answer = "email@test.com"; // aor email field

const mockAdminUser = {
  fullName: "Mock Admin",
  email: "mockadmin@user.com",
  role: UserRoles.ADMIN,
} as User;

const mockStateUser = {
  fullName: "Mock State User",
  email: "mockstate@user.com",
  role: UserRoles.STATE_USER,
} as User;

const mockReportComment = {
  contextId: validReport.id,
  created: Date.now(),
  id: "comment-id",
  author: "mock user",
  authorEmail: "mockuser@email.com",
  isInternal: false,
  type: CommentType.REPORT,
  comment: "New report comment",
};

describe("email utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendEmail", () => {
    test("should not issue a send email command when no email trigger identified", async () => {
      await sendEmail({ state: "PA", user: mockAdminUser });
      expect(sesLib.sendSesEmail).not.toHaveBeenCalled();
      expect(mockSaveNotifications).not.toHaveBeenCalled();
    });

    test("should not issue a send email command when no report found", async () => {
      mockGetReport.mockResolvedValue(undefined);
      await sendEmail({
        state: "PA",
        user: mockAdminUser,
        comment: mockReportComment,
      });
      expect(mockGetReport).toHaveBeenCalled();
      expect(sesLib.sendSesEmail).not.toHaveBeenCalled();
      expect(mockSaveNotifications).not.toHaveBeenCalled();
    });

    test("should not issue a send email command when no recipients found for admin user", async () => {
      mockGetReport.mockResolvedValue(validReport);
      await sendEmail({
        state: "PA",
        user: mockAdminUser,
        comment: mockReportComment,
      });
      expect(mockGetReport).toHaveBeenCalled();
      expect(sesLib.sendSesEmail).not.toHaveBeenCalled();
      expect(mockSaveNotifications).not.toHaveBeenCalled();
    });

    test("should not issue a send email command when no recipients found for state user", async () => {
      mockGetReport.mockResolvedValue(validReport);
      mockQueryRecipients.mockResolvedValueOnce([]);
      await sendEmail({
        state: "PA",
        user: mockStateUser,
        comment: mockReportComment,
      });
      expect(mockGetReport).toHaveBeenCalled();
      expect(mockQueryRecipients).toHaveBeenCalled();
      expect(sesLib.sendSesEmail).not.toHaveBeenCalled();
      expect(mockSaveNotifications).not.toHaveBeenCalled();
    });

    test("should send an email for report comment", async () => {
      mockGetReport.mockResolvedValue(validReport);
      mockQueryRecipients.mockResolvedValueOnce([
        { email: "cms.user@test.com" } as NotificationRecipientRecord,
      ]);
      await sendEmail({
        state: "PA",
        user: mockStateUser,
        comment: mockReportComment,
      });
      expect(mockGetReport).toHaveBeenCalled();
      expect(mockQueryRecipients).toHaveBeenCalled();
      expect(sesLib.sendSesEmail).toHaveBeenCalled();
      expect(mockSaveNotifications).toHaveBeenCalled();
    });

    test("should send an email for report status change", async () => {
      mockGetReport.mockResolvedValue(validReport);
      mockQueryRecipients.mockResolvedValueOnce([
        { email: "cms.user@test.com" } as NotificationRecipientRecord,
      ]);
      await sendEmail({
        state: "PA",
        user: mockStateUser,
        reportId: validReport.id,
      });
      expect(mockGetReport).toHaveBeenCalled();
      expect(mockQueryRecipients).toHaveBeenCalled();
      expect(sesLib.sendSesEmail).toHaveBeenCalled();
      expect(mockSaveNotifications).toHaveBeenCalled();
    });

    test("should send an email for request feedback", async () => {
      const mockRequestFeedbackComment = {
        ...mockReportComment,
        type: CommentType.REQUEST_FEEDBACK,
      };
      mockGetReport.mockResolvedValue(validReport);
      mockQueryRecipients.mockResolvedValueOnce([
        { email: "cms.user@test.com" } as NotificationRecipientRecord,
      ]);
      await sendEmail({
        state: "PA",
        user: mockStateUser,
        comment: mockRequestFeedbackComment,
      });
      expect(mockGetReport).toHaveBeenCalled();
      expect(mockQueryRecipients).toHaveBeenCalled();
      expect(sesLib.sendSesEmail).toHaveBeenCalled();
      expect(mockSaveNotifications).toHaveBeenCalled();
    });

    test("should log an error if email command fails", async () => {
      (sesLib.sendSesEmail as Mock).mockThrowOnce("Error!");
      mockGetReport.mockResolvedValue(validReport);
      mockQueryRecipients.mockResolvedValueOnce([
        { email: "cms.user@test.com" } as NotificationRecipientRecord,
      ]);
      await sendEmail({
        state: "PA",
        user: mockStateUser,
        reportId: validReport.id,
      });
      expect(mockGetReport).toHaveBeenCalled();
      expect(mockQueryRecipients).toHaveBeenCalled();
      expect(sesLib.sendSesEmail).toHaveBeenCalled();
      expect(mockSaveNotifications).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });
});
