import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

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
      type: ElementType.SubHeader,
      id: "mailing-address-subheader",
      text: "Mailing address",
      helperText:
        "Enter the primary mailing address for your state Medicaid office.",
    },
    {
      id: "contact-zipcode",
      type: ElementType.Textbox,
      label: "Postal code",
      required: true,
      skipOptionalTag: true,
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
      id: "data-sources-subheader",
      text: "Data sources",
    },
  ],
};
