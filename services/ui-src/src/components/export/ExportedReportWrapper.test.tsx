import { render, screen } from "@testing-library/react";
import { ExportedReportWrapper } from "./ExportedReportWrapper";
import {
  ElementType,
  FormPageTemplate,
  PageElement,
  PageType,
} from "@pasrr/shared";

const elements: PageElement[] = [
  {
    type: ElementType.Header,
    id: "mock_headerId",
    text: "General Information",
  },
  {
    type: ElementType.Textbox,
    id: "mock_textboxId",
    label: "Contact title",
    required: true,
    helperText:
      "Enter person's title or a position title for CMS to contact with questions about this request.",
  },
  {
    type: ElementType.Date,
    id: "mock_dateId",
    label: "Reporting period start date",
    required: true,
    helperText:
      "What is the reporting period Start Date applicable to the results?",
  },
  {
    type: ElementType.Textbox,
    id: "mock_textboxOptionalId",
    label: "Additional comments",
    answer: "",
    required: false,
    helperText: "Enter any additional comments",
  },
];

const section: FormPageTemplate = {
  id: "mock-page-id",
  title: "mock-title",
  type: PageType.Standard,
  elements: elements,
  sidebar: true,
};

describe("ExportedReportWrapper", () => {
  test("ExportedReportWrapper is visible", () => {
    render(<ExportedReportWrapper section={section} />);
    expect(screen.getByText("Contact title")).toBeInTheDocument();
  });

  test("should recursively expand checked children", () => {
    const elements: PageElement[] = [
      {
        type: ElementType.Radio,
        id: "mock_radioId",
        label: "Do you like bananas?",
        required: true,
        answer: "bananya",
        choices: [
          { label: "No", value: "bananah" },
          {
            label: "Yes, I love bananas",
            value: "bananya",
            checkedChildren: [
              {
                type: ElementType.Radio,
                id: "mock_radioId_childId",
                label: "Do you want some bananas?",
                required: true,
                answer: "yes",
                choices: [
                  { label: "I'm good thanks", value: "no" },
                  {
                    label: "Yeah, I'm starving",
                    value: "yes",
                    checkedChildren: [
                      {
                        type: ElementType.TextAreaField,
                        id: "mock_radioId_childId_choiceId",
                        label: "Describe your ideal banana",
                        required: true,
                        answer: "Oblong, yellow, not too soft",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    render(<ExportedReportWrapper section={{ ...section, elements }} />);

    // All answers should render together in the table
    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getByText("Yes, I love bananas")).toBeVisible();
    expect(screen.getByText("Yeah, I'm starving")).toBeVisible();
    expect(screen.getByText("Oblong, yellow, not too soft")).toBeVisible();

    // The choice IDs should not render anywhere
    expect(screen.queryByText("bananah")).not.toBeInTheDocument();
    expect(screen.queryByText("bananya")).not.toBeInTheDocument();
  });

  test("should split top-level ListInput answers into one row each", () => {
    const elements: PageElement[] = [
      {
        type: ElementType.ListInput,
        id: "gi_dataSources",
        label: "Data source",
        fieldLabel: "Data source",
        buttonText: "Add data source",
        required: true,
        answer: ["test 1", "test 2"],
      } as PageElement,
    ];

    render(<ExportedReportWrapper section={{ ...section, elements }} />);

    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getAllByRole("cell", { name: "Data source" })).toHaveLength(
      2
    );
    expect(screen.getByRole("cell", { name: "test 1" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "test 2" })).toBeVisible();
  });

  test("should show an unanswered data source list as Not answered", () => {
    const elements: PageElement[] = [
      {
        type: ElementType.ListInput,
        id: "gi_dataSources",
        label: "Data source",
        fieldLabel: "Data source",
        buttonText: "Add data source",
        required: true,
        answer: [],
      } as PageElement,
    ];

    render(<ExportedReportWrapper section={{ ...section, elements }} />);

    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByRole("cell", { name: "Data source" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "Not answered" })).toBeVisible();
  });

  test("should expand answers in AccordionGroup types", () => {
    const elements: PageElement[] = [
      {
        id: "mock_accordion_groupId",
        type: ElementType.AccordionGroup,
        accordions: [
          {
            label: "Accordion",
            elements: [
              {
                type: ElementType.ListInput,
                id: "mock_accordionId_listInputId",
                label: "Mock: Links",
                helperText: "mock helper text",
                fieldLabel: "Link",
                buttonText: "Add link",
                validation: "link",
                required: false,
                answer: ["http//:www.google.com", "http//:www.fake.com"],
              },
            ],
          },
        ],
        required: true,
      },
    ];

    render(<ExportedReportWrapper section={{ ...section, elements }} />);
    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getAllByRole("row")).toHaveLength(3);

    expect(screen.getAllByText("Mock: Links")).toHaveLength(2);
    expect(screen.getByText("http//:www.google.com")).toBeVisible();
    expect(screen.getByText("http//:www.fake.com")).toBeVisible();
  });
});
