import {
  DateField,
  DropdownField,
  ListInput,
  FieldGroup,
  RadioField,
  TextAreaField,
  TextField,
} from "components/fields";
import { Accordion, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import {
  AccordionItem,
  StatusTableElement,
  StatusAlert,
  CheckboxField,
  AttachmentArea,
  AccordionGroup,
  ActionTable,
} from "components";
import {
  ButtonLinkElement,
  DividerElement,
  HeaderElement,
  ParagraphElement,
  SubHeaderElement,
} from "components/report/Elements";
import {
  AlertTypes,
  ElementType,
  getPostalAddressElements,
  HeaderIcon,
  NumberFieldTemplate,
  PageElement,
} from "@pasrr/shared";
import { ReactNode } from "react";
import { ExportedReportWrapper } from "components/export/ExportedReportWrapper";
import {
  textboxSection,
  textAreaSection,
  numberFieldSection,
  radioFieldSection,
  listFieldSection,
  attachmentAreaSection,
  accordionGroupSection,
  actionTableSection,
  fieldGroupSection,
  postalAddressFieldGroupSection,
} from "./pdfElementSectionHelpers";
import { formatMonthDayYear } from "utils";
import { SubmissionParagraph } from "components/report/SubmissionParagraph";
import { RequestFeedbackButton } from "components/report/RequestFeedbackButton";
import { mockDropdown, mockTextboxOptional } from "utils/testing/mockForm";

const logNewElement = (el: Partial<PageElement>) => console.log("Updated:", el);

export const elementObject: {
  [key: string]: {
    description: string;
    variants: ReactNode[];
    pdfVariants: ReactNode[];
    id?: string;
  };
} = {
  [ElementType.Header]: {
    description: "Big text at the top of the page",
    id: "componentInventory_headerId",
    variants: [
      <HeaderElement
        element={{
          type: ElementType.Header,
          id: "mock_headerId",
          text: "HeaderElement",
        }}
      />,
      <HeaderElement
        element={{
          type: ElementType.Header,
          id: "mock_headerWithIconId",
          text: "HeaderElement with Icon",
          icon: HeaderIcon.Check,
        }}
      />,
    ],
    pdfVariants: [
      <HeaderElement
        element={{
          type: ElementType.Header,
          id: "mock_headerId",
          text: "HeaderElement",
        }}
      />,
    ],
  },
  [ElementType.SubHeader]: {
    description: "This is a subheader",
    id: "componentInventory_subHeaderId",
    variants: [
      <SubHeaderElement
        element={{
          type: ElementType.SubHeader,
          id: "mock_subHeaderId",
          text: "SubHeaderElement",
        }}
      />,
    ],
    pdfVariants: [
      <SubHeaderElement
        element={{
          type: ElementType.SubHeader,
          id: "mock_subHeaderId",
          text: "SubHeaderElement",
        }}
      />,
    ],
  },
  [ElementType.Textbox]: {
    description: "A field for entering text",
    id: "componentInventory_textboxId",
    variants: [
      <TextField
        updateElement={logNewElement}
        element={{
          type: ElementType.Textbox,
          id: "mock_textboxId",
          label: "Textbox",
          required: false,
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={textboxSection} />],
  },
  [ElementType.TextAreaField]: {
    description: "A field for entering text",
    id: "componentInventory_textAreaFieldId",
    variants: [
      <TextAreaField
        updateElement={logNewElement}
        element={{
          type: ElementType.TextAreaField,
          id: "mock_textAreaFieldId",
          label: "TextAreaField",
          required: true,
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={textAreaSection} />],
  },
  [ElementType.Paragraph]: {
    description: "A paragraph of text for content.",
    id: "componentInventory_paragraphId",
    variants: [
      <ParagraphElement
        element={{
          type: ElementType.Paragraph,
          id: "mock_paragraphId",
          text: "Useful for explanations or instructions.. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        }}
      />,
    ],
    pdfVariants: ["Paragraph currently not used in PDFs"],
  },
  [ElementType.Divider]: {
    description: "A horizontal line to separate content",
    id: "componentInventory_dividerId",
    variants: [
      <DividerElement
        element={{
          type: ElementType.Divider,
          id: "mock_dividerId",
        }}
      />,
    ],
    pdfVariants: ["Divider currently not used in PDFs"],
  },
  [ElementType.Accordion]: {
    description: "A collapsible section for content",
    id: "componentInventory_accordionId",
    variants: [
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="Accordion Item 1">
          I am the content of the first accordion item.
        </AccordionItem>
        <AccordionItem label="Accordion Item 2">
          I am the content of the second accordion item.
        </AccordionItem>
        <AccordionItem label="Accordion Item 3">
          I am the content of the third accordion item.
        </AccordionItem>
      </Accordion>,
    ],
    pdfVariants: ["Accordion currently not used in PDFs"],
  },
  [ElementType.Dropdown]: {
    description: "A dropdown field for selecting options",
    id: "componentInventory_dropdownId",
    variants: [
      <DropdownField
        updateElement={logNewElement}
        element={{
          type: ElementType.Dropdown,
          id: "mock_dropdownId",
          label: "Dropdown",
          required: true,
          options: [
            { value: "dropdown option 1", label: "dropdown option 1" },
            { value: "dropdown option 2", label: "dropdown option 2" },
            { value: "dropdown option 3", label: "dropdown option 3" },
          ],
        }}
      />,
    ],
    pdfVariants: ["Dropdown currently not used in PDFs"],
  },
  [ElementType.Radio]: {
    description: "A radio button field for selecting one option",
    id: "componentInventory_radioId",
    variants: [
      <RadioField
        updateElement={logNewElement}
        element={{
          type: ElementType.Radio,
          id: "mock_radioId",
          label: "Radio",
          required: true,
          choices: [
            { value: "radio option 1", label: "radio option 1" },
            { value: "radio option 2", label: "radio option 2" },
            { value: "radio option 3", label: "radio option 3" },
          ],
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={radioFieldSection} />],
  },
  [ElementType.Date]: {
    description: "A field for selecting a date",
    id: "componentInventory_dateId",
    variants: [
      <DateField
        updateElement={logNewElement}
        element={{
          type: ElementType.Date,
          id: "mock_dateId",
          label: "Date",
          helperText: "Date element is used to select a date.",
          required: true,
        }}
      />,
    ],
    pdfVariants: [
      <Table variant={"reportDetails"}>
        <Thead>
          <Tr>
            <Th>Reporting year</Th>
            <Th>Last edited</Th>
            <Th>Edited by</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{2025}</Td>
            <Td>{formatMonthDayYear(1757897305331)}</Td>
            <Td>{"test user"}</Td>
            <Td>{"In progress"}</Td>
          </Tr>
        </Tbody>
      </Table>,
    ],
  },
  [ElementType.NumberField]: {
    description: "A field for entering numbers",
    id: "componentInventory_numberFieldId",
    variants: [
      <TextField
        updateElement={logNewElement}
        element={
          {
            type: ElementType.NumberField,
            id: "mock_numberFieldId",
            label: "Enter a number",
            helperText: "Helper text is optional",
            required: false,
          } as NumberFieldTemplate
        }
      />,
      <TextField
        updateElement={logNewElement}
        element={
          {
            type: ElementType.NumberField,
            id: "mock_numberFieldId_required",
            label: "NumberField with required validation",
            helperText: "This field is required.",
            required: true,
          } as NumberFieldTemplate
        }
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={numberFieldSection} />],
  },
  [ElementType.ButtonLink]: {
    description: "A link styled as a button",
    id: "componentInventory_buttonLinkId",
    variants: [
      <ButtonLinkElement
        element={{
          type: ElementType.ButtonLink,
          id: "mock_buttonLinkId",
          to: "page-link",
          label: "Button Link Label",
        }}
      />,
    ],
    pdfVariants: ["ButtonLink currently not used in PDFs"],
  },
  [ElementType.StatusTable]: {
    description: "A table for displaying statuses",
    id: "componentInventory_statusTableId",
    variants: [<StatusTableElement />],
    pdfVariants: ["StatusTable currently not used in PDFs"],
  },
  [ElementType.StatusAlert]: {
    description: "Different Alert Types",
    id: "componentInventory_statusAlertId",
    variants: [
      <StatusAlert
        element={{
          type: ElementType.StatusAlert,
          id: "mock_statusAlertId",
          title: "Status Title",
          text: "AlertTypes.SUCCESS",
          status: AlertTypes.SUCCESS,
        }}
      />,
      <StatusAlert
        element={{
          type: ElementType.StatusAlert,
          id: "mock_statusAlertId_error",
          title: "Status Title",
          text: "AlertTypes.ERROR",
          status: AlertTypes.ERROR,
        }}
      />,
      <StatusAlert
        element={{
          type: ElementType.StatusAlert,
          id: "mock_statusAlertId_info",
          title: "Status Title",
          text: "AlertTypes.INFO",
          status: AlertTypes.INFO,
        }}
      />,
      <StatusAlert
        element={{
          type: ElementType.StatusAlert,
          id: "mock_statusAlertId_warning",
          title: "Status Title",
          text: "AlertTypes.WARNING",
          status: AlertTypes.WARNING,
        }}
      />,
    ],
    pdfVariants: ["StatusAlert currently not used in PDFs"],
  },
  [ElementType.SubmissionParagraph]: {
    description: "Submission Paragraph",
    id: "componentInventory_submissionParagraphId",
    variants: [<SubmissionParagraph />],
    pdfVariants: ["SubmissionParagraph currently not used in PDFs"],
  },
  [ElementType.Checkbox]: {
    description: "A checkbox field for selecting options",
    id: "componentInventory_checkboxId",
    variants: [
      <CheckboxField
        updateElement={logNewElement}
        element={{
          type: ElementType.Checkbox,
          id: "mock_checkboxId",
          label: "CheckboxField",
          required: true,
          choices: [
            { value: "checkbox option 1", label: "checkbox option 1" },
            { value: "checkbox option 2", label: "checkbox option 2" },
            { value: "checkbox option 3", label: "checkbox option 3" },
          ],
        }}
      />,
    ],
    pdfVariants: ["Checkbox currently not used in PDFs"],
  },
  [ElementType.ListInput]: {
    description: "A field for adding a series of inputs",
    id: "componentInventory_listInputId",
    variants: [
      <ListInput
        updateElement={logNewElement}
        element={{
          type: ElementType.ListInput,
          id: "mock_listInputId",
          buttonText: "Add list input",
          required: true,
          fieldLabel: "input",
          label: "List Input",
        }}
      ></ListInput>,
    ],
    pdfVariants: [<ExportedReportWrapper section={listFieldSection} />],
  },
  [ElementType.AttachmentArea]: {
    description: "An area for uploading files.",
    id: "componentInventory_attachmentAreaId",
    variants: [
      <AttachmentArea
        updateElement={logNewElement}
        element={{
          type: ElementType.AttachmentArea,
          id: "mock_attachmentAreaId",
          label: "label",
          required: true,
          answer: [
            {
              name: "mock-file.txt",
              size: 100,
              fileId: "mock-id",
            },
          ],
        }}
      ></AttachmentArea>,
    ],
    pdfVariants: [<ExportedReportWrapper section={attachmentAreaSection} />],
  },
  [ElementType.AccordionGroup]: {
    description:
      "Accordion groups that can have an array of fields inside the accordion",
    id: "componentInventory_accordionGroupId",
    variants: [
      <AccordionGroup
        element={{
          type: ElementType.AccordionGroup,
          id: "mock_accordionGroupId",
          accordions: [
            {
              label: "Accordion Group 1",
              elements: [
                {
                  type: ElementType.Textbox,
                  id: "mock_accordionId_textboxId",
                  label: "",
                  required: false,
                },
              ],
            },
            {
              label: "Accordion Group 2",
              elements: [
                {
                  type: ElementType.Textbox,
                  id: "mock_accordionId_textboxId",
                  label: "",
                  required: false,
                },
              ],
            },
          ],
          required: true,
        }}
        updateElement={logNewElement}
      ></AccordionGroup>,
    ],
    pdfVariants: [<ExportedReportWrapper section={accordionGroupSection} />],
  },
  [ElementType.ActionTable]: {
    description:
      "Generic table that has a the ability to add more columns if you're an admin user",
    id: "componentInventory_actionTableId",
    variants: [
      <ActionTable
        element={{
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
              id: "mock_actionTableId_dateId",
              type: ElementType.Date,
            },
          ],
          answer: [
            [
              { id: "mock_actionTableId_paragraphId", value: "1" },
              { id: "mock_actionTableId_textboxId", value: "textbox 1" },
              { id: "mock_actionTableId_dateId", value: "01/01/2021" },
            ],
            [
              { id: "mock_actionTableId_paragraphId", value: "2" },
              { id: "mock_actionTableId_textboxId", value: "textbox 2" },
              { id: "mock_actionTableId_dateId", value: "02/02/2022" },
            ],
          ],
          required: true,
        }}
        updateElement={logNewElement}
      ></ActionTable>,
    ],
    pdfVariants: [<ExportedReportWrapper section={actionTableSection} />],
  },
  [ElementType.RequestFeedbackButton]: {
    description: "A field that allows the user to send comments to the CMS PO.",
    id: "componentInventory_requestFeedbackButtonId",
    variants: [<RequestFeedbackButton></RequestFeedbackButton>],
    pdfVariants: ["Request Feedback button currently not used in PDFs"],
  },
  [ElementType.FieldGroup]: {
    description: "Group fields into a fieldset",
    id: "componentInventory_fieldGroupId",
    variants: [
      <FieldGroup
        element={{
          type: ElementType.FieldGroup,
          id: "mock_fieldGroupId",
          label: "FieldGroup",
          required: true,
          helperText: "Information to help user fill field group",
          elements: [mockDropdown, mockTextboxOptional],
        }}
        updateElement={logNewElement}
      />,
      <FieldGroup
        element={{
          type: ElementType.FieldGroup,
          id: "componentInventory_fieldGroupId",
          label: "Postal address FieldGroup",
          required: true,
          helperText: "Information to help user fill out postal address fields",
          elements: getPostalAddressElements({
            id: "mock_fieldGroupId",
          }),
        }}
        updateElement={logNewElement}
      />,
    ],
    pdfVariants: [
      <ExportedReportWrapper section={fieldGroupSection} />,
      <ExportedReportWrapper section={postalAddressFieldGroupSection} />,
    ],
  },
};
