import {
  AccordionGroupTemplate,
  AttachmentAreaTemplate,
  ElementType,
  FormPageTemplate,
  Report,
} from "@pasrr/shared";
import { validReport, mockAccordionPages } from "../tests/mockReport";
import {
  sortElementsForZip,
  getAttachmentAreaFiles,
  getAccordionFiles,
  formatS3ZipKey,
  addReportFilesToZip,
} from "./buildZip";
import JSZip from "jszip";
import s3Lib from "../../libs/s3-lib";

vi.mock("../../libs/s3-lib", () => ({
  default: {
    getObject: vi.fn().mockResolvedValue({
      Body: {
        transformToByteArray: vi.fn().mockReturnValue("bytes"),
      },
    }),
  },
}));

const mockReport: Report = {
  ...validReport,
  id: "mock-report",
  pages: [
    {
      id: "root",
      childPageIds: ["mock-page-1"],
    },
    {
      id: "mock-attachment-area-page",
      elements: [
        {
          type: ElementType.AttachmentArea,
          answer: [{ name: "mock-name" }],
        } as AttachmentAreaTemplate,
      ],
    } as FormPageTemplate,
    ...mockAccordionPages,
  ],
};

describe("buildZip util", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("formatS3ReportZipKey", () => {
    const zipId = formatS3ZipKey("report-123");
    expect(zipId).toEqual("zips/report-123.zip");
  });
  test("sortElementsForZip", () => {
    const sort = sortElementsForZip(mockReport);
    expect(sort).toStrictEqual({
      accordions: [
        {
          type: "accordionGroup",
          id: "mock-accordion-group",
          accordions: [
            {
              elements: [
                {
                  answer: "Mock Accordion 1 Answer",
                  id: "mock-accordion-1-textbox",
                  label: "Mock Accordion 1 Textbox",
                  type: "textbox",
                },
                {
                  id: "attachment-id",
                  type: "attachmentArea",
                  answer: [
                    {
                      fileId: "mock-id",
                      name: "mock-name",
                      size: 100,
                    },
                  ],
                },
              ],
              label: "Mock Accordion 1",
            },
          ],
        },
      ],
      area: [
        {
          type: ElementType.AttachmentArea,
          answer: [{ name: "mock-name" }],
        },
      ],
    });
  });
  test("getAccordionFiles", () => {
    const files = getAccordionFiles(
      mockAccordionPages[0].elements as AccordionGroupTemplate[]
    );
    expect(files).toStrictEqual([
      {
        fileId: "mock-id",
        name: "mock-name",
        size: 100,
      },
    ]);
  });
  test("getAttachmentAreaFiles", () => {
    const attachmentArea: AttachmentAreaTemplate = {
      type: ElementType.AttachmentArea,
      id: "success-attachments",
      label: "mock area",
      required: false,
      answer: [
        {
          name: "mock-file",
          size: 2000,
          fileId: "mock-id",
        },
      ],
    };

    const files = getAttachmentAreaFiles([attachmentArea]);
    expect(files).toStrictEqual([
      {
        name: "mock-file",
        size: 2000,
        fileId: "mock-id",
      },
    ]);
  });

  test("addReportFilesToZip", async () => {
    const mockZip = new JSZip();
    await addReportFilesToZip(mockReport, mockZip);
    expect(s3Lib.getObject).toHaveBeenCalled();
    expect(mockZip.files).toBeDefined();
  });
});
