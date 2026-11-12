import { Mock, MockedFunction } from "vitest";
import {
  mockUseReadOnlyUserStore,
  mockUseStore,
} from "utils/testing/setupTest";
import { useNavigate, useParams } from "react-router";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import { Page } from "./Page";
import { AlertTypes, ElementType, PageElement } from "@pasrr/shared";

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockImplementation(
  (selector?: (state: typeof mockUseStore) => unknown) => {
    if (selector) {
      return selector(mockUseStore);
    }
    return mockUseStore;
  }
);

// Mock the more complex elements, let them test themselves
vi.mock("./StatusTable", () => {
  return { StatusTableElement: () => <div>Status Table</div> };
});

const mockNavigate = vi.fn();
(useNavigate as Mock).mockReturnValue(mockNavigate);
(useParams as Mock).mockReturnValue({
  reportType: "exampleReport",
  state: "exampleState",
  reportId: "123",
  pageId: "examplePage",
});

const elements: PageElement[] = [
  {
    type: ElementType.Header,
    id: "mock_headerId",
    text: "My header",
  },
  {
    type: ElementType.SubHeader,
    id: "mock_subHeaderId",
    text: "My subheader",
  },
  {
    type: ElementType.Paragraph,
    id: "mock_paragraphId",
    text: "Paragraph",
  },
  {
    type: ElementType.Textbox,
    id: "mock_textboxId",
    label: "Textbox label",
    required: true,
  },
  {
    type: ElementType.TextAreaField,
    id: "mock_textAreaFieldId",
    label: "Text area label",
    required: true,
  },
  {
    type: ElementType.NumberField,
    id: "mock_numberFieldId",
    label: "Number label",
    required: true,
  },
  {
    type: ElementType.Date,
    id: "mock_dateId",
    label: "Date label",
    required: true,
    helperText: "This is a date field",
  },
  {
    type: ElementType.Dropdown,
    id: "mock_dropdownId",
    label: "Dropdown label",
    helperText: "This is a dropdown field",
    required: true,
    options: [{ label: "mock label", value: " mock value" }],
  },
  {
    type: ElementType.Accordion,
    id: "mock_accordionId",
    label: "Accordion text",
    value: "Other",
  },
  {
    type: ElementType.Radio,
    id: "mock_radioId",
    label: "Radio label",
    required: true,
    choices: [
      { label: "a", value: "1", checkedChildren: [] },
      { label: "b", value: "2" },
    ],
  },
  {
    type: ElementType.Checkbox,
    id: "mock_checkboxId",
    label: "Checkbox label",
    required: true,
    choices: [
      { label: "a", value: "1", checkedChildren: [] },
      { label: "b", value: "2" },
    ],
  },
  {
    type: ElementType.ButtonLink,
    to: "mock-page-id",
    label: "Button link",
    id: "mock_buttonLinkId",
  },
  {
    type: ElementType.StatusTable,
    id: "mock_statusTableId",
    to: "mock-page-id",
  },
  {
    type: ElementType.Divider,
    id: "mock_dividerId",
  },
  {
    type: ElementType.StatusAlert,
    id: "mock_statusAlertId",
    title: "mock alert title",
    text: "mock alert text",
    status: AlertTypes.ERROR,
  },
  {
    type: ElementType.SubmissionParagraph,
    id: "mock_submissionParagraphId",
  },
  {
    type: ElementType.AccordionGroup,
    id: "mock_accordionGroupId",
    accordions: [],
    required: false,
  },
  {
    type: ElementType.AttachmentArea,
    id: "mock_attachmentAreaId",
    label: "Attachment area label",
    required: true,
  },
  {
    type: ElementType.ListInput,
    fieldLabel: "",
    buttonText: "button",
    id: "mock_listInputId",
    label: "mock label",
    required: false,
  },
  {
    type: ElementType.RequestFeedbackButton,
    id: "mock_requestFeedbackButtonId",
  },
  {
    type: ElementType.ActionTable,
    id: "mock_actionTableId",
    label: "ActionTable label",
    heading: "ActionTable heading",
    modal: {
      title: "ActionTable modal title",
      elements: [],
    },
    required: true,
    rows: [],
  },
  {
    type: ElementType.FieldGroup,
    id: "mock_fieldGroupId",
    label: "FieldGroup label",
    required: true,
    elements: [],
  },
  {
    type: ElementType.SummationTable,
    id: "mock_summationTableId",
    caption: "SummationTable caption",
    required: true,
    rows: [],
  },
];

const textFieldElement: PageElement[] = [
  {
    type: ElementType.Textbox,
    id: "mock_textboxId",
    label: "Textbox label",
    required: true,
  },
  {
    type: ElementType.Radio,
    id: "mock_radioId",
    label: "Radio label",
    required: true,
    choices: [
      { label: "radio choice 1", value: "1", checkedChildren: [] },
      { label: "radio choice 2", value: "2" },
    ],
  },
];

const dateFieldElement: PageElement[] = [
  {
    type: ElementType.Date,
    id: "mock_dateId",
    label: "Date label",
    helperText: "This is a date field",
    required: true,
  },
];

describe("Page Component with state user", () => {
  test.each(elements)("Renders all element types: $type", (element) => {
    const { container } = render(
      <Page id="mock-page-id" elements={[element]} setElements={vi.fn()} />
    );
    expect(container).not.toBeEmptyDOMElement();
  });

  test("should render and navigate correctly for ButtonLink element", async () => {
    render(
      <Page
        id="mock-page-id"
        elements={[
          {
            type: ElementType.ButtonLink,
            id: "mock_buttonLinkId",
            to: "mock-page-id",
            label: "Button link",
          },
        ]}
        setElements={vi.fn()}
      />
    );

    // Button renders
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Navigation
    await userEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/report/exampleReport/exampleState/123/mock-page-id"
    );
  });

  test("should call setElements on input change", async () => {
    const updateSpy = vi.fn();

    render(
      <Page
        id="mock-page-id"
        elements={dateFieldElement}
        setElements={updateSpy}
      />
    );

    const dateField = screen.getByRole("textbox");
    await userEvent.type(dateField, "02/02/26");
    expect(updateSpy).toHaveBeenCalledWith(dateFieldElement);
  });

  test("should not render if it is passed missing types", () => {
    // Page Element prevents us from doing this with typescript, but the real world may have other plans
    const badObject = { type: "unused element name" };

    const { container } = render(
      <Page
        id="mock-page-id"
        elements={[badObject as unknown as PageElement]}
        setElements={vi.fn()}
      />
    );
    expect(container).not.toBeEmptyDOMElement();
  });

  test("state user cannot edit when element is only editable by admin", () => {
    const roleLimitedElements = [
      {
        ...textFieldElement[0],
        onlyCmsAdminCanEdit: true,
      },
    ];
    render(
      <Page
        id="mock-page-id"
        elements={roleLimitedElements}
        setElements={vi.fn()}
      />
    );
    const textField = screen.getByRole("textbox");
    expect(textField).toBeDisabled();
  });
});

describe("Page Component with read only user", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseReadOnlyUserStore);
  });
  test("text field and radio button should be disabled", () => {
    render(
      <Page
        id="mock-page-id"
        elements={textFieldElement}
        setElements={vi.fn()}
      />
    );
    const textField = screen.getByRole("textbox");
    const radioButton = screen.getByLabelText("radio choice 1");
    expect(textField).toBeDisabled();
    expect(radioButton).toBeDisabled();
  });
  test("date field should be disabled", () => {
    render(
      <Page
        id="mock-page-id"
        elements={dateFieldElement}
        setElements={vi.fn()}
      />
    );
    const dateField = screen.getByRole("textbox");
    expect(dateField).toBeDisabled();
  });
});
