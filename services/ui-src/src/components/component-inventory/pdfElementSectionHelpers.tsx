import {
  ElementType,
  FormPageTemplate,
  getPostalAddressElements,
  PageType,
} from "@pasrr/shared";
import { mockDropdown, mockTextboxOptional } from "utils/testing/mockForm";

export const textboxSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Textbox,
      id: "mock_textboxId",
      label: "Textbox",
      helperText: "Information to help user fill out textbox",
      answer: "sample text",
      required: true,
    },
  ],
};

export const textAreaSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.TextAreaField,
      id: "mock_textAreaFieldId",
      label: "TextArea",
      helperText: "Information to help user fill out textbox",
      answer: "sample text",
      required: true,
    },
  ],
};

export const numberFieldSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Textbox,
      id: "mock_numberFieldId",
      label: "NumberField",
      helperText: "Information to help user fill out number field",
      answer: "5",
      required: true,
    },
  ],
};

export const dateFieldSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Date,
      id: "mock_dateId",
      label: "Reporting period start date",
      helperText:
        "What is the reporting period Start Date applicable to the results?",
      required: true,
    },
  ],
};

export const radioFieldSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Radio,
      id: "mock_radioId",
      label: "RadioField",
      choices: [
        { value: "radio option 1", label: "radio option 1" },
        { value: "radio option 2", label: "radio option 2" },
        { value: "radio option 3", label: "radio option 3" },
      ],
      answer: "radio option 1",
      required: true,
    },
  ],
};

export const listFieldSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.ListInput,
      id: "mock_listInputId",
      buttonText: "Add list input",
      required: true,
      fieldLabel: "input",
      label: "List Input",
      answer: ["list input 1"],
    },
  ],
};

export const attachmentAreaSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.AttachmentArea,
      id: "mock_attachmentId",
      label: "label",
      required: true,
      answer: [
        {
          name: "mock-file.txt",
          size: 100,
          fileId: "mock-id",
        },
      ],
    },
  ],
};

export const accordionGroupSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.AccordionGroup,
      id: "mock_accordionGroupId",
      accordions: [
        {
          label: "Accordion Group 1",
          elements: [
            {
              type: ElementType.Textbox,
              id: "mock_accordionId_textboxId",
              label: "Mock Textbox",
              required: false,
              answer: "answer",
            },
          ],
        },
      ],
      required: true,
    },
  ],
};

export const actionTableSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.ActionTable,
      id: "mock_actionTableId",
      label: "Action Table",
      heading: "Action Table",
      helperText: "hint text",
      modal: {
        title: "Modal",
        elements: [],
      },
      rows: [
        {
          header: "Text Field",
          id: "mock_actionTableId_paragraphId",
          type: ElementType.Paragraph,
        },
        {
          header: "Textbox Field",
          id: "mock_actionTableId_textboxId",
          type: ElementType.Textbox,
        },
        {
          header: "Date Field",
          id: "mock_actionTableId_dateFieldId",
          type: ElementType.Date,
        },
      ],
      answer: [
        [
          { id: "mock_actionTableId_paragraphId", value: "1" },
          { id: "mock_actionTableId_textboxId", value: "textbox 1" },
          { id: "mock_actionTableId_dateFieldId", value: "01/01/2021" },
        ],
        [
          { id: "mock_actionTableId_paragraphId", value: "2" },
          { id: "mock_actionTableId_textboxId", value: "textbox 2" },
          { id: "mock_actionTableId_dateFieldId", value: "02/02/2022" },
        ],
      ],
      required: true,
    },
  ],
};

export const fieldGroupSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.FieldGroup,
      id: "mock_fieldGroupId",
      label: "FieldGroup",
      helperText: "Information to help user fill field group",
      required: true,
      elements: [mockDropdown, mockTextboxOptional],
    },
  ],
};

export const postalAddressFieldGroupSection: FormPageTemplate = {
  id: "mock-page-id",
  title: "Component Inventory",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.FieldGroup,
      id: "mock_postalAddressFieldGroupId",
      label: "Postal address FieldGroup",
      helperText: "Information to help user fill out postal address fields",
      required: true,
      elements: getPostalAddressElements({
        id: "mock_postalAddressFieldGroupId",
      }),
    },
  ],
};
