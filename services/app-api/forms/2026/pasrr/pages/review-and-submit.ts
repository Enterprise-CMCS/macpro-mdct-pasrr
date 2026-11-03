import {
  ReviewSubmitTemplate,
  PageType,
  ElementType,
  AlertTypes,
  HeaderIcon,
} from "@pasrr/shared";

export const reviewAndSubmit: ReviewSubmitTemplate = {
  id: "review_submit",
  title: "Review & Submit",
  type: PageType.ReviewSubmit,
  sidebar: true,
  hideNavButtons: true,
  elements: [
    {
      type: ElementType.StatusAlert,
      id: "review_alert",
      status: AlertTypes.ERROR,
      title: "Your form is not ready for submission",
      text: "Some sections of the PASRR Report have errors or are missing required responses. Ensure all required fields are completed with valid responses before submitting.",
    },
    {
      type: ElementType.Header,
      id: "review_header",
      text: "Review & Submit",
    },
    {
      type: ElementType.SubHeader,
      id: "review_readyToSubmitHeader",
      text: "Ready to submit?",
      headingLevel: 5,
    },
    {
      type: ElementType.Paragraph,
      id: "review_text",
      text: "Double check that everything in your PASRR Report is accurate. You will be able to make edits after submitting if you contact the CMS PASRR team to unlock your report while it is in “Submitted” status.",
    },
    {
      type: ElementType.SubHeader,
      id: "review_complianceHeader",
      text: "Compliance review",
      headingLevel: 5,
    },
    {
      type: ElementType.Paragraph,
      id: "review_complianceHeaderText",
      text: "The CMS PASRR team will review your report, and may contact you and unlock your report for editing if there are corrections to be made.",
    },
    {
      type: ElementType.StatusTable,
      id: "review_status",
      to: "review-submit",
    },
  ],
  submittedView: [
    {
      type: ElementType.Header,
      id: "submitted_header",
      text: "Successfully Submitted",
      icon: HeaderIcon.Check,
    },
    {
      type: ElementType.SubmissionParagraph,
      id: "submitted_thankYou",
    },
    {
      type: ElementType.Divider,
      id: "divider",
    },
    {
      type: ElementType.Paragraph,
      id: "submitted_whatExplanation",
      title: "What happens now?",
      text:
        "<p>Your report has been submitted and is now locked from editing.</p></br></br>" +
        "<p>An automated confirmation email has been sent to you, your CMS Project Officer, and all points of contact listed on your General Information page. No further action is required on your part</p>",
    },
  ],
};
