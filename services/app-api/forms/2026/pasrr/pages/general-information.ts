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
      id: "general-information-header",
      text: "General Information",
    },
    {
      type: ElementType.SubHeader,
      id: "state-report-owner-subheader",
      text: "State report owner information",
      helperText:
        "Enter the name of the state Medicaid agency person who is responsible for the accuracy and submission of this form. CMS PASRR staff will contact the person listed here if there are questions regarding the report.",
    },
    {
      id: "contact-name",
      type: ElementType.Textbox,
      label: "Name",
      required: true,
      skipOptionalTag: true,
      helperText: "First and last name of the contact person.",
    },
    {
      id: "contact-email",
      type: ElementType.Textbox,
      label: "Contact email address",
      required: true,
      skipOptionalTag: true,
      helperText:
        "Enter an email address. Department or program-wide email addresses are allowed.",
    },
    {
      id: "contact-phone",
      type: ElementType.Textbox,
      label: "Phone number",
      required: true,
      skipOptionalTag: true,
      helperText: "Enter phone number as ###-###-####.",
    },
    {
      id: "mailing-address",
      type: ElementType.FieldGroup,
      label: "Mailing address",
      required: true,
      helperText:
        "Enter the main mailing address for your state Medicaid office.",
      elements: getPostalAddressElements({
        id: "mailing-address",
      }),
    },
    {
      type: ElementType.SubHeader,
      id: "alternate-contact-subheader",
      text: "Alternate state Medicaid agency contact",
      helperText:
        "Enter the contact information for a secondary contact in case the primary person is unavailable.",
    },
    {
      id: "alternate-contact-name",
      type: ElementType.Textbox,
      label: "Name",
      required: true,
      skipOptionalTag: true,
      helperText: "First and last name of the secondary contact person.",
    },
    {
      id: "alternate-contact-email",
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
      helperText:
        "Enter your state PASRR program records and tracking systems or other sources. For example, other sources may include fair hearings (appeals) or nursing facility data.",
    },
    {
      id: "gi_dataSources",
      type: ElementType.ListInput,
      label: "Data source",
      fieldLabel: "Data source",
      buttonText: "Add data source",
      required: true,
      skipOptionalTag: true,
    },
  ],
};
