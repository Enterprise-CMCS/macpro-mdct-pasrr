import {
  ElementType,
  PageElement,
  PageStatus,
  PageType,
  Report,
  ReportPage,
} from "@pasrr/shared";
import { mockAccordionPages, validReport } from "../tests/mockReport";
import { copyReport } from "./copyReport";

const mockGetReport = vi.fn();
const mockBatchUploads = vi.fn();
const mockQueryUpload = vi.fn();

vi.mock("../../storage/reports", () => ({
  getReport: () => mockGetReport(),
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
        {
          id: "mock-field-group-id",
          type: ElementType.FieldGroup,
          label: "FieldGroup",
          required: true,
          elements: [
            {
              id: "mock-field-group-id-textbox",
              type: ElementType.Textbox,
              label: "Textbox",
              required: true,
              answer: "mock text",
            },
          ],
          answer: [{ id: "mock-field-group-id-textbox", value: "mock text" }],
        },
        {
          id: "mock-accordion-group-id",
          type: ElementType.AccordionGroup,
          required: true,
          accordions: [
            {
              label: "Accordion",
              elements: [
                {
                  id: "mock-accordion-field-group-id",
                  type: ElementType.FieldGroup,
                  label: "FieldGroup",
                  required: true,
                  elements: [
                    {
                      id: "mock-accordion-field-group-id-textbox",
                      type: ElementType.Textbox,
                      label: "Textbox",
                      required: true,
                      answer: "mock accordion text",
                    },
                  ],
                  answer: [
                    {
                      id: "mock-accordion-field-group-id-textbox",
                      value: "mock accordion text",
                    },
                  ],
                },
              ],
            },
          ],
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

const testPage = mockNewReport.pages.find(
  (page: ReportPage) => page.id === "mock-page-1"
);
const testTextbox = testPage.elements.find(
  (element: PageElement) => element.id === "mock-input-element"
);
const testFieldGroup = testPage.elements.find(
  (element: PageElement) => element.id === "mock-field-group-id"
);
const testFieldGroupTextbox = testFieldGroup.elements.find(
  (element: PageElement) => element.id === "mock-field-group-id-textbox"
);
const testAccordionFieldGroup = testPage.elements.find(
  (element: PageElement) => element.id === "mock-accordion-group-id"
).accordions[0].elements[0];
const testAccordionFieldGroupTextbox = testAccordionFieldGroup.elements.find(
  (element: PageElement) =>
    element.id === "mock-accordion-field-group-id-textbox"
);
delete testTextbox.answer;
delete testFieldGroup.answer;
delete testFieldGroupTextbox.answer;
delete testAccordionFieldGroup.answer;
delete testAccordionFieldGroupTextbox.answer;
delete testPage.status;

describe("copyReport util", () => {
  test("copyReport copies data from old report into new one", async () => {
    mockGetReport.mockReturnValue(mockOldReport);
    mockQueryUpload.mockReturnValue({ Items: [] });

    // no answer in report before copy
    expect(testTextbox.answer).toBeUndefined();
    expect(testFieldGroup.answer).toBeUndefined();
    expect(testFieldGroupTextbox.answer).toBeUndefined();
    expect(testAccordionFieldGroup.answer).toBeUndefined();
    expect(testAccordionFieldGroupTextbox.answer).toBeUndefined();

    await copyReport(mockNewReport);

    // textbox answer copies
    expect(testTextbox.answer).toBe("mock answer");

    // field group answers copies
    expect(testFieldGroup.answer).toEqual([
      { id: "mock-field-group-id-textbox", value: "mock text" },
    ]);
    expect(testFieldGroupTextbox.answer).toBe("mock text");

    // accordion field group answers copies
    expect(testAccordionFieldGroup.answer).toEqual([
      {
        id: "mock-accordion-field-group-id-textbox",
        value: "mock accordion text",
      },
    ]);
    expect(testAccordionFieldGroupTextbox.answer).toBe("mock accordion text");

    // page status copies
    expect(testPage.status).toEqual(PageStatus.IN_PROGRESS);

    // Verify accordion group answers are copied correctly
    const testAccordionPage = mockNewReport.pages.find(
      (page: ReportPage) => page.id === "mock-accordion-page"
    );
    const newAccordions = testAccordionPage.elements[0].accordions;
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
              type: ElementType.AttachmentArea,
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
