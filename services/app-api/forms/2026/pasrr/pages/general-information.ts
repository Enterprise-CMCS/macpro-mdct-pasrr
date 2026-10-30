import {
  FormPageTemplate,
  PageType,
  ElementType,
  getPostalAddressElements,
} from "@pasrr/shared";

export const generalInformation: FormPageTemplate = {
  id: "general-information",
  title: "General Information",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "gi_header",
      text: "General Information",
    },
    {
      type: ElementType.SubHeader,
      id: "gi_stateReportOwnerSubheader",
      text: "State report owner information",
      helperText:
        "Enter the name of the state Medicaid agency person who is responsible for the accuracy and submission of this form. CMS PASRR staff will contact the person listed here if there are questions regarding the report.",
    },
    {
      id: "gi_contactName",
      type: ElementType.Textbox,
      label: "Name",
      required: true,
      skipOptionalTag: true,
      helperText: "First and last name of the contact person.",
    },
    {
      id: "gi_contactEmail",
      type: ElementType.Textbox,
      label: "Contact email address",
      required: true,
      skipOptionalTag: true,
      helperText:
        "Enter an email address. Department or program-wide email addresses are allowed.",
    },
    {
      id: "gi_contactPhone",
      type: ElementType.Textbox,
      label: "Phone number",
      required: true,
      skipOptionalTag: true,
      helperText: "Enter phone number as ###-###-####.",
    },
    {
      id: "gi_mailingAddress",
      type: ElementType.FieldGroup,
      label: "Mailing address",
      required: true,
      helperText:
        "Enter the main mailing address for your state Medicaid office.",
      elements: getPostalAddressElements({
        id: "gi_mailingAddress",
      }),
    },
    {
      type: ElementType.SubHeader,
      id: "gi_alternateContactSubheader",
      text: "Alternate state Medicaid agency contact",
      helperText:
        "Enter the contact information for a secondary contact in case the primary person is unavailable.",
    },
    {
      id: "gi_alternateContactName",
      type: ElementType.Textbox,
      label: "Name",
      required: true,
      skipOptionalTag: true,
      helperText: "First and last name of the secondary contact person.",
    },
    {
      id: "gi_alternateContactEmail",
      type: ElementType.Textbox,
      label: "Email address",
      required: true,
      skipOptionalTag: true,
      helperText:
        "Enter an email address. Department or program-wide email addresses are allowed.",
    },
    {
      type: ElementType.SubHeader,
      id: "gi_dataSourcesSubheader",
      text: "Data sources",
    },
  ],
};
