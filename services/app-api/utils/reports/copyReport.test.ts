import { ElementType, PageStatus, PageType, Report } from "@pasrr/shared";
import { mockAccordionPages, validReport } from "../tests/mockReport";
import { copyReport } from "./copyReport";

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

const mockOldReport: Report = {
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
      status: PageStatus.IN_PROGRESS,
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
      ],
    },
    ...mockAccordionPages,
  ],
};

// any type so it doesn't complain about accessing .answer on generic PageElement
const mockNewReport: any = structuredClone(mockOldReport);
mockNewReport.id = "mock-new-report";
mockNewReport.copyFromReportId = "mock-old-report";
delete mockNewReport.pages[1].elements[1].answer;
delete mockNewReport.pages[1].status;

describe("copyReport util", () => {
  test("copyReport copies data from old report into new one", async () => {
    mockGetReport.mockReturnValue(mockOldReport);
    mockQueryUpload.mockReturnValue({ Items: [] });
    // no answer in report before copy
    expect(mockNewReport.pages[1].elements[1].answer).toBeUndefined();

    await copyReport(mockNewReport);

    // textbox answer copies
    expect(mockNewReport.pages[1].elements[1].answer).toEqual("mock answer");

    // page status copies
    expect(mockNewReport.pages[1].status).toEqual(PageStatus.IN_PROGRESS);

    // Verify accordion group answers are copied correctly
    const newAccordions = mockNewReport.pages[2].elements[0].accordions;
    expect(newAccordions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Mock Accordion 1",
          elements: [
            expect.objectContaining({
              type: ElementType.Textbox,
              id: "mock-accordion-1-textbox",
              label: "Mock Accordion 1 Textbox",
              answer: "Mock Accordion 1 Answer",
            }),
            expect.objectContaining({
              id: "attachment-id",
              type: "attachmentArea",
            }),
          ],
        }),
      ])
    );

    // attachment-area uploads are re-keyed with new file ids
    const copiedAttachment = newAccordions[0].elements[1].answer[0];
    expect(copiedAttachment.fileId).not.toEqual("mock-id");
    expect(copiedAttachment.name).toEqual("mock-name");
  });
});
