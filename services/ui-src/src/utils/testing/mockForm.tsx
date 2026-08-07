import {
  ElementType,
  PageType,
  ReportStatus,
  ReportType,
  PasrrSubType,
  Report,
} from "@pasrr/shared";

export const mockAccordion = {
  buttonLabel: "Instructions",
  intro: [
    {
      type: "text",
      as: "span",
      content: "<b>Bold Instructions</b>",
    },
    {
      type: "text",
      as: "span",
      content: "More instructions",
    },
  ],
  list: [`List Item 1`, "List Item 2", `List Item 3`],
  text: "Additional Text",
};

export const mockReport: Report = {
  type: ReportType.PASRR,
  created: 1776449695077,
  subType: PasrrSubType.ANNUAL,
  subTypeKey: "A1",
  budgetPeriod: 1,
  name: "plan id",
  state: "NJ",
  id: "NJGeneral123",
  status: ReportStatus.NOT_STARTED,
  submissionCount: 0,
  lastEdited: 1776449695077,
  pages: [
    {
      id: "root",
      childPageIds: ["general-info", "mock-report-page"],
    },
    {
      id: "general-info",
      title: "General Information",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Textbox,
          id: "mock-textbox",
          label: "Contact title",
          required: true,
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
        {
          type: ElementType.Textbox,
          id: "another-textbox",
          required: true,
          label: "Another textbox",
        },
      ],
    },
    {
      id: "mock-report-page",
      title: "Mock Report Page",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "",
          text: "Mock Report Page",
        },
      ],
    },
  ],
};

export const mockReport2: Report = {
  type: ReportType.PASRR,
  created: 1776449695077,
  subType: PasrrSubType.ANNUAL,
  subTypeKey: "A1",
  budgetPeriod: 2,
  name: "plan mn id",
  state: "MN",
  id: "MNGeneral123",
  status: ReportStatus.IN_PROGRESS,
  submissionCount: 0,
  lastEdited: 1776449695077,
  pages: [
    {
      id: "root",
      childPageIds: ["general-info", "mock-report-page"],
    },
  ],
};
