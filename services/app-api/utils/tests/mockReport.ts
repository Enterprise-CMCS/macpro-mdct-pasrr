import { pasrrReportTemplate } from "../../forms/2026/pasrr/pasrr";
import {
  Report,
  PageType,
  ElementType,
  ReportStatus,
  StateAbbr,
  PasrrSubType,
  ReportType,
  AccordionGroupItem,
  FormPageTemplate,
} from "@pasrr/shared";

const pages = pasrrReportTemplate("PA");

export const validReport: Report = {
  type: ReportType.PASRR,
  subType: PasrrSubType.ANNUAL,
  subTypeKey: "A1",
  budgetPeriod: 1,
  pages: pages,
  state: "NJ" as StateAbbr,
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "PASRR valid report",
  submissionCount: 0,
};

export const missingStateReport = {
  ...validReport,
  state: undefined,
};

export const incorrectStatusReport = {
  ...validReport,
  status: "wrong value", // Doesn't use ReportStatus enum
};

export const incorrectTypeReport = {
  ...validReport,
  type: "wrong type", // Doesn't use ReportType enum
};

export const invalidFormPageReport = {
  ...validReport,
  pages: [
    {
      id: "general-info",
      // missing title field
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          text: "General Information",
        },
        {
          type: ElementType.Textbox,
          required: true,
          label: "Contact title",
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
      ],
    },
  ],
};

export const invalidParentPageReport = {
  ...validReport,
  pages: [
    {
      // missing id field
      childPageIds: ["general-info", "review-submit"],
    },
  ],
};

export const invalidPageElementType = {
  ...validReport,
  pages: [
    {
      id: "general-info",
      title: "General Info",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: "badElementType", // Doesn't use ElementType enum
          text: "State of Program Information",
        },
      ],
    },
  ],
};

export const mockAccordionPages = [
  {
    id: "mock-accordion-page",
    title: "Mock Accordion Page",
    type: PageType.Standard,
    elements: [
      {
        type: ElementType.AccordionGroup,
        id: "mock-accordion-group",
        accordions: [
          {
            label: "Mock Accordion 1",
            elements: [
              {
                type: ElementType.Textbox,
                id: "mock-accordion-1-textbox",
                label: "Mock Accordion 1 Textbox",
                answer: "Mock Accordion 1 Answer",
              },
              {
                type: ElementType.AttachmentArea,
                id: "attachment-id",
                answer: [{ name: "mock-name", size: 100, fileId: "mock-id" }],
              },
            ],
          },
        ] as AccordionGroupItem[],
      },
    ],
  },
] as FormPageTemplate[];
