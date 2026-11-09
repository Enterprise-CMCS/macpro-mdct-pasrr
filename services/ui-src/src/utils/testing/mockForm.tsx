import {
  ElementType,
  PageType,
  ReportStatus,
  ReportType,
  PasrrSubType,
  Report,
  DropdownTemplate,
  TextboxTemplate,
  dropdownEmptyOption,
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

export const mockDropdown: DropdownTemplate = {
  type: ElementType.Dropdown,
  id: "mock_dropdownId",
  label: "Dropdown",
  required: true,
  options: [
    dropdownEmptyOption,
    { value: "dropdown option 1", label: "dropdown option 1" },
    { value: "dropdown option 2", label: "dropdown option 2" },
    { value: "dropdown option 3", label: "dropdown option 3" },
  ],
};

export const mockTextboxOptional: TextboxTemplate = {
  type: ElementType.Textbox,
  id: "mock_textboxOptionalId",
  label: "Textbox",
  required: false,
};

export const mockReport: Report = {
  type: ReportType.PASRR,
  created: 1776449695077,
  subType: PasrrSubType.ANNUAL,
  subTypeKey: "A1",
  budgetPeriod: 1,
  reportingYear: 2026,
  name: "plan id",
  state: "NJ",
  id: "mock-report-id",
  status: ReportStatus.NOT_STARTED,
  submissionCount: 0,
  lastEdited: 1776449695077,
  pages: [
    {
      id: "root",
      childPageIds: ["general-information", "mock-page-id"],
    },
    {
      id: "general-information",
      title: "General Information",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Textbox,
          id: "mock_textboxId",
          label: "Contact title",
          required: true,
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
        {
          type: ElementType.Textbox,
          id: "mock_textboxId2",
          required: true,
          label: "Another textbox",
        },
      ],
    },
    {
      id: "mock-page-id",
      title: "Mock Report Page",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "mock_headerId",
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
  reportingYear: 2026,
  name: "plan mn id",
  state: "MN",
  id: "mock-report-id-2",
  status: ReportStatus.IN_PROGRESS,
  submissionCount: 0,
  lastEdited: 1776449695077,
  pages: [
    {
      id: "root",
      childPageIds: ["general-information", "mock-page-id"],
    },
  ],
};
