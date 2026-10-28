import { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { DevReportTools } from "./DevReportTools";
import { mockUseStore } from "utils/testing/setupTest";
import { dropdownEmptyOption, ElementType, PageStatus } from "@pasrr/shared";
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
        status: PageStatus.IN_PROGRESS,
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

const getElements = (showAnswers?: boolean) => {
  const getAnswer = (id: string) => {
    if (!showAnswers) return {};

    const answers: { [key: string]: any } = {
      "mock-textbox-id": "mock text input",
      "mock-textarea-id": "mock text area field",
      "mock-number-field-id": "1234",
      "mock-date-id": "02/02/2026",
      "mock-dropdown-id": "2026",
      "mock-action-table-id": [
        [
          {
            id: "row-1",
            value: "mock text",
          },
          {
            id: "row-2",
            value: "1234",
          },
        ],
      ],
      "mock-field-group-id": [
        {
          id: "mock-field-group-id-email",
          value: "mock@email.com",
        },
        {
          id: "mock-field-group-id-phone",
          value: "555-555-5555",
        },
        {
          id: "mock-field-group-id-zipcode",
          value: "55555",
        },
      ],
      "mock-field-group-id-email": "mock@email.com",
      "mock-field-group-id-phone": "555-555-5555",
      "mock-field-group-id-zipcode": "55555",
    };

    return { answer: answers[id] };
  };

  return [
    {
      id: "mock-textbox-id",
      type: ElementType.Textbox,
      required: true,
      ...getAnswer("mock-textbox-id"),
    },
    {
      id: "mock-textarea-id",
      type: ElementType.TextAreaField,
      required: true,
      ...getAnswer("mock-textarea-id"),
    },
    {
      id: "mock-date-id",
      type: ElementType.Date,
      required: true,
      ...getAnswer("mock-date-id"),
    },
    {
      id: "mock-number-field-id",
      type: ElementType.NumberField,
      required: true,
      ...getAnswer("mock-number-field-id"),
    },
    {
      id: "mock-number-field-optional-id",
      type: ElementType.NumberField,
      required: false,
    },
    {
      id: "mock-action-table-id",
      type: ElementType.ActionTable,
      required: true,
      rows: [
        {
          header: "Textbox Field",
          id: "row-1",
          type: ElementType.Textbox,
        },
        {
          header: "NumberField",
          id: "row-2",
          type: ElementType.NumberField,
        },
        {
          header: "Disabled Field",
          id: "row-3",
          type: ElementType.Textbox,
          disabled: true,
        },
      ],
      answer: [
        [
          {
            id: "row-1",
            value: "mock text",
          },
          {
            id: "row-2",
            value: "",
          },
        ],
      ],
      ...getAnswer("mock-action-table-id"),
    },
    {
      id: "mock-dropdown-id",
      type: ElementType.Dropdown,
      required: true,
      options: [
        dropdownEmptyOption,
        { label: "2026", value: "2026" },
        { label: "2027", value: "2027" },
      ],
      ...getAnswer("mock-dropdown-id"),
    },
    {
      id: "mock-checkbox-id",
      type: ElementType.Checkbox,
      required: true,
      choices: [
        {
          label: "Choice 1",
          value: "A",
          checked: false,
        },
        {
          label: "Choice 2",
          value: "B",
          checked: false,
        },
        {
          label: "Choice 3",
          value: "C",
          checked: false,
        },
      ],
    },
    {
      id: "mock-field-group-id",
      type: ElementType.FieldGroup,
      required: true,
      elements: [
        {
          id: "mock-field-group-id-email",
          type: ElementType.Textbox,
          required: true,
          ...getAnswer("mock-field-group-id-email"),
        },
        {
          id: "mock-field-group-id-phone",
          type: ElementType.Textbox,
          required: true,
          ...getAnswer("mock-field-group-id-phone"),
        },
        {
          id: "mock-field-group-id-zipcode",
          type: ElementType.Textbox,
          required: true,
          ...getAnswer("mock-field-group-id-zipcode"),
        },
      ],
      ...getAnswer("mock-field-group-id"),
    },
  ];
};

vi.mock("utils/state/useStore", () => ({
  useStore: vi
    .fn()
    .mockImplementation(
      (selector?: (state: typeof mockUseStore) => unknown) => {
        if (selector) {
          return {
            id: "mock-page",
            title: "Mock Page",
            elements: getElements(false),
            sections,
          };
        }
        return reportUseStore;
      }
    ),
}));
describe("Test DevReportTools component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    expect(mockSetAnswer).toHaveBeenCalledWith(
      {
        id: "mock-page",
        title: "Mock Page",
        elements: getElements(true),
        sections,
      },
      "mock-page"
    );
  });

  test("Page with no inputs does not autofill", async () => {
    (useStore as unknown as Mock).mockImplementation((selector) => {
      if (selector) {
        return {
          id: "mock-page",
          title: "Mock Page",
          sections,
        };
      }
      return reportUseStore;
    });
    render(<DevReportTools />);
    await userEvent.click(
      screen.getByRole("button", { name: "Auto Fill Page" })
    );
    expect(mockSetAnswer).not.toHaveBeenCalled();
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
    expect(mockSetAnswer).toHaveBeenCalledWith(
      {
        id: "mock-page",
        title: "Mock Page",
        status: PageStatus.IN_PROGRESS,
        elements: [],
      },
      "mock-page"
    );
  });
});
