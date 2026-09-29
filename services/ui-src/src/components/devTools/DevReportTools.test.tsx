import { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { DevReportTools } from "./DevReportTools";
import { mockUseStore } from "utils/testing/setupTest";
import { ElementType, PageStatus } from "@pasrr/shared";
import userEvent from "@testing-library/user-event";
import { useStore } from "utils";

const mockSetAnswer = vi.fn();

vi.mock("utils/api/requestMethods/fileMethods", async (importOriginal) => ({
  ...(await importOriginal()),
  getFileDownloadUrl: vi.fn(),
  deleteUploadedFile: vi.fn(),
  uploadFileToS3: vi.fn(),
  recordFileInDatabaseAndGetUploadUrl: vi
    .fn()
    .mockReturnValue({ presignedUploadUrl: "", fileId: "" }),
  getUploadedFiles: vi
    .fn()
    .mockReturnValue([
      { filename: "mock-name", fileSize: 100, fileId: "mock-id" },
    ]),
}));

const reportUseStore = {
  report: {
    id: "test-report",
    pages: [
      {
        id: "mock-optional",
        elements: [],
      },
      {
        id: "mock-page",
        title: "Mock Page",
        status: "In Progress",
        elements: [],
      },
    ],
  },
  setAnswers: mockSetAnswer,
};

const sections = [
  {
    section: { title: "Mock Page", id: "mock-page" },
    displayStatus: PageStatus.NOT_STARTED,
    submittable: true,
  },
  {
    section: { title: "Mock Optional", id: "mock-optional" },
    displayStatus: PageStatus.OPTIONAL,
    submittable: true,
  },
];

vi.mock("utils/state/useStore", () => ({
  useStore: vi
    .fn()
    .mockImplementation(
      (selector?: (state: typeof mockUseStore) => unknown) => {
        if (selector) {
          return {
            id: "mock-page",
            title: "Mock Page",
            elements: [
              {
                id: "mock-textbox",
                type: ElementType.Textbox,
                required: true,
              },
              {
                id: "mock-textarea",
                type: ElementType.TextAreaField,
                required: true,
              },
              {
                id: "mock-date",
                type: ElementType.Date,
                required: true,
              },
              {
                id: "mock-numberfield",
                type: ElementType.NumberField,
                required: true,
              },
              {
                id: "mock-number",
                type: ElementType.NumberField,
                required: true,
              },

              {
                id: "mock-action-table",
                type: ElementType.ActionTable,
                required: true,
                rows: [],
                answer: [[{ label: "", value: "" }]],
              },
            ],
            sections,
          };
        }
        return reportUseStore;
      }
    ),
}));
describe("Test DevReportTools component", () => {
  test("DevReportTools Renders", () => {
    render(<DevReportTools />);
    expect(screen.getByText("Mock Page Tools")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Auto Fill Page" })
    ).toBeInTheDocument();
  });
  test("Test autofill of page", async () => {
    render(<DevReportTools />);
    const autoBtn = screen.getByRole("button", { name: "Auto Fill Page" });
    await userEvent.click(autoBtn);
    expect(mockSetAnswer).toHaveBeenCalled();
  });
  test("Test autofill of Review & Submit", async () => {
    (useStore as unknown as Mock).mockImplementation((selector) => {
      if (selector) {
        return {
          submittable: true,
          id: "review-submit",
          title: "Review & Submit",
          elements: [],
          sections,
        };
      }
      return reportUseStore;
    });
    render(<DevReportTools />);
    await userEvent.click(screen.getByRole("button", { name: "Fill Report" }));
    expect(mockSetAnswer).toHaveBeenCalled();
  });
});
