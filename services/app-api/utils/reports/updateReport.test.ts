import { ElementType, PageType, Report, UserRoles } from "@pasrr/shared";
import { mockAccordionPages, validReport } from "../tests/mockReport";
import { updateReportAnswers } from "./updateReport";
import { User } from "../../types/types";

const mockGetReport = vi.fn();
const mockQueryComments = vi.fn();
const mockBatchComments = vi.fn();
const mockBatchUploads = vi.fn();
const mockQueryUpload = vi.fn();

vi.mock("../../storage/reports", () => ({
  getReport: () => mockGetReport(),
}));

vi.mock("../../storage/comments", () => ({
  queryComments: () => mockQueryComments(),
  batchPutComments: () => mockBatchComments(),
}));

vi.mock("../../storage/upload", () => ({
  queryUpload: () => mockQueryUpload(),
  batchPutUploads: () => mockBatchUploads(),
}));

const mockStateUser = {
  fullName: "Mock State User",
  email: "mockstate@user.com",
  role: UserRoles.STATE_USER,
} as User;

const mockReport: Report = {
  ...validReport,
  id: "mock-old-report",
  pages: [
    {
      id: "root",
      childPageIds: ["mock-page-1"],
    },
    {
      id: "mock-page-1",
      title: "Mock Page 1",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "mock-non-input-element",
          text: "Non-input element",
        },
        {
          id: "mock-input-element",
          type: ElementType.Textbox,
          label: "Input element",
          required: true,
          answer: "mock answer",
        },
        {
          id: "mock-dropdown-element",
          type: ElementType.Dropdown,
          options: [
            {
              label: "My single option",
              value: "single",
              checkedChildren: [
                {
                  id: "nested-dropdown-input-element",
                  type: ElementType.Textbox,
                  label: "Input element",
                  required: true,
                  answer: "nested mock answer",
                },
              ],
            },
          ],
          label: "Input element",
          required: true,
          answer: "mock answer",
        },
        {
          id: "mock-radio-element",
          type: ElementType.Radio,
          choices: [
            {
              label: "My single option",
              value: "single",
              checkedChildren: [
                {
                  id: "nested-radio-input-element",
                  type: ElementType.Textbox,
                  label: "Input element",
                  required: true,
                  answer: "nested mock answer",
                },
              ],
            },
          ],
          label: "Input element",
          required: true,
          answer: "mock answer",
        },
      ],
    },
    ...mockAccordionPages,
  ],
};

// any type so it doesn't complain about accessing .answer on generic PageElement
const mockReportRequest: any = structuredClone(mockReport);
mockReportRequest.id = "mock-new-report";
mockReportRequest.copyFromReportId = "mock-old-report";
mockReportRequest.pages[1].elements[1].answer = "New answer";
mockReportRequest.pages[1].elements[2].options[0].checkedChildren[0].answer =
  "New answer"; // dropdown child
mockReportRequest.pages[1].elements[3].choices[0].checkedChildren[0].answer =
  "New answer"; // radio child
mockReportRequest.pages[2].elements[0].accordions[0].elements[0].answer =
  "New answer 2";
mockReportRequest.pages[1].elements[1].label = "HIJACKED"; // This should be prevented

describe("updateReport util", () => {
  test("updateReportcopies only changed data in answer fields", async () => {
    mockGetReport.mockReturnValue(mockReport);
    // no answer in report before copy
    const result: any = await updateReportAnswers(
      mockReportRequest,
      mockStateUser
    );

    // textbox answer transfers
    expect(result.pages[1].elements[1].answer).toEqual("New answer");

    // nested checked choices transfer
    expect(
      mockReportRequest.pages[1].elements[2].options[0].checkedChildren[0]
        .answer
    ).toEqual("New answer");

    // Verify accordion group answers are copied correctly
    const newAccordions = result.pages[2].elements[0].accordions[0];
    expect(newAccordions.elements[0].answer).toEqual("New answer 2");

    // Verify no injecting into anything but answer
    expect(result.pages[1].elements[1].answer).not.toEqual("HIJACKED");
  });
});
