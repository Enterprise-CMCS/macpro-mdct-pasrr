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
  getUploadedFiles: vi.fn().mockReturnValue([
    {
      filename: "mock-file-id.pdf",
      fileSize: 100,
      fileId: "mockKsuId_mock-file-id.pdf",
    },
  ]),
}));

const reportUseStore = {
  report: {
    id: "mock-report-id",
    pages: [
      {
        id: "mock-optional-page-id",
        elements: [],
      },
      {
        id: "mock-page-id",
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
    section: { title: "Mock Page", id: "mock-page-id" },
    displayStatus: PageStatus.NOT_STARTED,
    submittable: true,
  },
  {
    section: { title: "Mock Optional", id: "mock-optional-page-id" },
    displayStatus: PageStatus.OPTIONAL,
    submittable: true,
  },
];

const getElements = (showAnswers?: boolean) => {
  const getAnswer = (id: string) => {
    if (!showAnswers) return {};

    const answers: { [key: string]: any } = {
      mock_textboxId: "mock text input",
      mock_textAreaFieldId: "mock text area field",
      mock_numberFieldId: 1234,
      mock_dateId: "02/02/2026",
      mock_dropdownId: "2026",
      mock_dropdownId_textboxId: "mock text input",
      mock_radioId: "A",
      mock_radioId_textboxId: "mock text input",
      mock_actionTableId: [
        [
          {
            id: "mock_actionTableId_textboxId",
            value: "mock text",
          },
          {
            id: "mock_actionTableId_numberFieldId",
            value: 1234,
          },
        ],
      ],
      mock_fieldGroupId: [
        {
          id: "mock_fieldGroupId_email",
          value: "mock@email.com",
        },
        {
          id: "mock_fieldGroupId_phone",
          value: "555-555-5555",
        },
        {
          id: "mock_fieldGroupId_zipCode",
          value: "55555",
        },
      ],
      mock_fieldGroupId_email: "mock@email.com",
      mock_fieldGroupId_phone: "555-555-5555",
      mock_fieldGroupId_zipCode: "55555",
      mock_summationTableId: {
        rows: [
          [
            {
              id: "mock_summationTableId_textboxId",
              value: "mock text input",
            },
            {
              id: "mock_summationTableId_numberFieldId",
              value: 1234,
            },
          ],
        ],
        total: [
          [
            {
              id: "mock_summationTableId_textboxId",
              value: "Total",
              preset: true,
              readonly: true,
            },
            {
              id: "mock_summationTableId_numberFieldId",
              value: 1234,
              readonly: true,
            },
          ],
        ],
      },
    };

    return { answer: answers[id] };
  };

  return [
    {
      id: "mock_textboxId",
      type: ElementType.Textbox,
      required: true,
      ...getAnswer("mock_textboxId"),
    },
    {
      id: "mock_textAreaFieldId",
      type: ElementType.TextAreaField,
      required: true,
      ...getAnswer("mock_textAreaFieldId"),
    },
    {
      id: "mock_dateId",
      type: ElementType.Date,
      required: true,
      ...getAnswer("mock_dateId"),
    },
    {
      id: "mock_numberFieldId",
      type: ElementType.NumberField,
      required: true,
      ...getAnswer("mock_numberFieldId"),
    },
    {
      id: "mock_number-field-optionalId",
      type: ElementType.NumberField,
      required: false,
    },
    {
      id: "mock_actionTableId",
      type: ElementType.ActionTable,
      required: true,
      rows: [
        {
          header: "Textbox Field",
          id: "mock_actionTableId_textboxId",
          type: ElementType.Textbox,
        },
        {
          header: "NumberField",
          id: "mock_actionTableId_numberFieldId",
          type: ElementType.NumberField,
        },
        {
          header: "Disabled Field",
          id: "mock_actionTableId_disabledFieldId",
          type: ElementType.Textbox,
          disabled: true,
        },
      ],
      answer: [
        [
          {
            id: "mock_actionTableId_textboxId",
            value: "mock text",
          },
          {
            id: "mock_actionTableId_numberFieldId",
            value: "",
          },
        ],
      ],
      ...getAnswer("mock_actionTableId"),
    },
    {
      id: "mock_dropdownId",
      type: ElementType.Dropdown,
      required: true,
      options: [
        dropdownEmptyOption,
        {
          label: "2026",
          value: "2026",
          checkedChildren: [
            {
              id: "mock_dropdownId_textboxId",
              type: ElementType.Textbox,
              label: "Textbox",
              required: true,
              ...getAnswer("mock_dropdownId_textboxId"),
            },
          ],
        },
        { label: "2027", value: "2027" },
      ],
      ...getAnswer("mock_dropdownId"),
    },
    {
      id: "mock_checkboxId",
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
      id: "mock_radioId",
      type: ElementType.Radio,
      required: true,
      choices: [
        {
          label: "Choice 1",
          value: "A",
          checked: false,
          checkedChildren: [
            {
              id: "mock_radioId_textboxId",
              type: ElementType.Textbox,
              label: "Textbox",
              required: true,
              ...getAnswer("mock_radioId_textboxId"),
            },
          ],
        },
        {
          label: "Choice 2",
          value: "B",
          checked: false,
        },
      ],
      ...getAnswer("mock_radioId"),
    },
    {
      id: "mock_fieldGroupId",
      type: ElementType.FieldGroup,
      required: true,
      elements: [
        {
          id: "mock_fieldGroupId_email",
          type: ElementType.Textbox,
          required: true,
          ...getAnswer("mock_fieldGroupId_email"),
        },
        {
          id: "mock_fieldGroupId_phone",
          type: ElementType.Textbox,
          required: true,
          ...getAnswer("mock_fieldGroupId_phone"),
        },
        {
          id: "mock_fieldGroupId_zipCode",
          type: ElementType.Textbox,
          required: true,
          ...getAnswer("mock_fieldGroupId_zipCode"),
        },
      ],
      ...getAnswer("mock_fieldGroupId"),
    },
    {
      id: "mock_summationTableId",
      type: ElementType.SummationTable,
      required: true,
      rows: [
        {
          id: "mock_summationTableId_textboxId",
          header: "Textbox",
          type: ElementType.Textbox,
        },
        {
          id: "mock_summationTableId_numberFieldId",
          header: "NumberField",
          type: ElementType.NumberField,
        },
      ],
      answer: {
        rows: [[{ id: "mock_summationTableId_textboxId", value: "" }]],
        total: [
          [
            {
              id: "mock_summationTableId_textboxId",
              value: "Total",
              preset: true,
              readonly: true,
            },
          ],
        ],
      },
      ...getAnswer("mock_summationTableId"),
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
            id: "mock-page-id",
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
        id: "mock-page-id",
        title: "Mock Page",
        elements: getElements(true),
        sections,
      },
      "mock-page-id"
    );
  });

  test("Page with no inputs does not autofill", async () => {
    (useStore as unknown as Mock).mockImplementation((selector) => {
      if (selector) {
        return {
          id: "mock-page-id",
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
        id: "mock-page-id",
        title: "Mock Page",
        status: PageStatus.IN_PROGRESS,
        elements: [],
      },
      "mock-page-id"
    );
  });
});
