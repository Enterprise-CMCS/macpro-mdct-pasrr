import {
  AlertTypes,
  ElementType,
  FormPageTemplate,
  getPostalAddressElements,
  HeaderIcon,
  PageType,
  ReportPages,
  ReviewSubmitTemplate,
} from "@pasrr/shared";

const generalInformation: FormPageTemplate = {
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
      id: "data-sources-subheader",
      text: "Data sources",
    },
  ],
};

const intellectualDisability: FormPageTemplate = {
  id: "id-rc",
  title: "Intellectual Disability and Related Conditions (ID/RC)",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "id-rc-header",
      text: "Intellectual Disability and Related Conditions (ID/RC)",
    },
  ],
};

const seriousMentalIllness: FormPageTemplate = {
  id: "smi",
  title: "Serious Mental Illness (SMI)",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "smi-header",
      text: "Serious Mental Illness (SMI)",
    },
  ],
};

const reviewAndSubmit: ReviewSubmitTemplate = {
  id: "review-submit",
  title: "Review & Submit",
  type: PageType.ReviewSubmit,
  sidebar: true,
  hideNavButtons: true,
  elements: [
    {
      type: ElementType.StatusAlert,
      id: "review-alert",
      status: AlertTypes.ERROR,
      title: "Your form is not ready for submission",
      text: "Some sections of the PASRR Report have errors or are missing required responses.",
    },
    {
      type: ElementType.Header,
      id: "review-header",
      text: "Review & Submit",
    },
    {
      type: ElementType.RequestFeedbackButton,
      id: "review-request-feedback",
    },
    {
      type: ElementType.Paragraph,
      id: "review-text",
      title: "Ready to Submit?",
      text: "Double check that everything in your PASRR Report is accurate. To make edits to your report after submitting, contact your CMS PASRR Lead to unlock your report.",
    },
    {
      type: ElementType.StatusTable,
      id: "review-status",
      to: "review-submit",
    },
  ],
  submittedView: [
    {
      type: ElementType.Header,
      id: "submitted-header",
      text: "Successfully Submitted",
      icon: HeaderIcon.Check,
    },
    {
      type: ElementType.SubmissionParagraph,
      id: "submitted-thank-you",
    },
    {
      type: ElementType.Divider,
      id: "divider",
    },
    {
      type: ElementType.Paragraph,
      id: "submitted-what-explanation",
      title: "What happens now?",
      text:
        "<p>Your report has been submitted and is now locked from editing.</p></br></br>" +
        "<p>An automated confirmation email has been sent to you, your CMS Project Officer, and all points of contact listed on your General Information page. No further action is required on your part</p>",
    },
  ],
};

export const pasrrReportTemplate = (_state: string): ReportPages => [
  {
    id: "root",
    childPageIds: ["general-information", "id-rc", "smi", "review-submit"],
  },
  generalInformation,
  intellectualDisability,
  seriousMentalIllness,
  reviewAndSubmit,
];
