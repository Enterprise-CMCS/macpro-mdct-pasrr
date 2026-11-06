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
  id: "mock-report-id",
  pages: [
    {
      id: "root",
      childPageIds: ["mock-page-id"],
    },
    {
      id: "mock-page-id",
      elements: [
        {
          type: ElementType.AttachmentArea,
          id: "mock_attachmentAreaId",
          answer: [{ name: "mock-file-id.pdf" }],
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
          type: ElementType.AccordionGroup,
          id: "mock_accordionFieldGroupId",
          accordions: [
            {
              elements: [
                {
                  answer: "Mock Accordion 1 Answer",
                  id: "mock_accordionId_textboxId",
                  label: "Mock Accordion 1 Textbox",
                  type: ElementType.Textbox,
                },
                {
                  id: "mock_accordionId_attachmentAreaId",
                  type: ElementType.AttachmentArea,
                  answer: [
                    {
                      fileId: "mockKsuId_mock-file-id.pdf",
                      name: "mock-file-id.pdf",
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
          id: "mock_attachmentAreaId",
          type: ElementType.AttachmentArea,
          answer: [{ name: "mock-file-id.pdf" }],
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
        fileId: "mockKsuId_mock-file-id.pdf",
        name: "mock-file-id.pdf",
        size: 100,
      },
    ]);
  });
  test("getAttachmentAreaFiles", () => {
    const attachmentArea: AttachmentAreaTemplate = {
      type: ElementType.AttachmentArea,
      id: "mock_attachmentAreaId",
      label: "mock area",
      required: false,
      answer: [
        {
          name: "mock-file",
          size: 2000,
          fileId: "mockKsuId_mock-file-id.pdf",
        },
      ],
    };

    const files = getAttachmentAreaFiles([attachmentArea]);
    expect(files).toStrictEqual([
      {
        name: "mock-file",
        size: 2000,
        fileId: "mockKsuId_mock-file-id.pdf",
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
