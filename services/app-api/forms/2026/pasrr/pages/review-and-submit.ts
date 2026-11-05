import {
  ReviewSubmitTemplate,
  PageType,
  ElementType,
  AlertTypes,
  HeaderIcon,
} from "@pasrr/shared";

export const reviewAndSubmit: ReviewSubmitTemplate = {
  id: "review-submit",
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
      text: "Some sections of the PASRR Report have errors or are missing required responses.",
    },
    {
      type: ElementType.Header,
      id: "review_header",
      text: "Review & Submit",
    },
    {
      type: ElementType.RequestFeedbackButton,
      id: "review_requestFeedback",
    },
    {
      type: ElementType.Paragraph,
      id: "review_text",
      title: "Ready to Submit?",
      text: "Double check that everything in your PASRR Report is accurate. To make edits to your report after submitting, contact your CMS PASRR Lead to unlock your report.",
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
