import {
  AlertTypes,
  ElementType,
  FormPageTemplate,
  HeaderIcon,
  PageType,
  ReportPages,
  ReviewSubmitTemplate,
} from "@pasrr/shared";

// TODO: replace with the real PASRR report schema. This is a minimal
// placeholder template that keeps the application buildable and runnable
// end-to-end until PASRR's report pages are defined.

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
      id: "contact-name",
      type: ElementType.Textbox,
      label: "Contact name",
      required: true,
      helperText:
        "Enter the name for CMS to contact with questions about this report.",
    },
    {
      id: "contact-email",
      type: ElementType.Textbox,
      label: "Contact email",
      required: true,
      helperText: "Enter the email address for the contact.",
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
      type: ElementType.SubmitForReview,
      id: "review-submit-for-review",
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
    childPageIds: ["general-information", "review-submit"],
  },
  generalInformation,
  reviewAndSubmit,
];
