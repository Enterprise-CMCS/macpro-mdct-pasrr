import {
  ElementType,
  FormPageTemplate,
  getResidentDispositionPresetRowsAndAnswer,
  PageType,
} from "@pasrr/shared";
import { reportingCriteriaAccordion } from ".";

export const intellectualDisabilityAndRelatedConditionsSpecializedServices: FormPageTemplate =
  {
    id: "intellectual-disability-and-related-conditions-specialized-services-only",
    title: "Specialized services only",
    type: PageType.Standard,
    sidebar: true,
    elements: [
      {
        type: ElementType.Paragraph,
        id: "idrc_specializedServices_eyebrow",
        style: "eyebrow",
        text: "Intellectual Disability and Related Conditions (ID/RC)",
      },
      {
        type: ElementType.Header,
        id: "idrc_specializedServices_header",
        text: "Residents who don’t require nursing facility care, but do require specialized services",
      },
      reportingCriteriaAccordion(
        "idrc_specializedServices_reportingCriteriaAccordion"
      ),
      {
        type: ElementType.SubHeader,
        id: "idrc_specializedServices_subheader",
        text: "Resident dispositions: Specialized services only",
        helperText:
          "<p>Report Level II resident review data for individuals with an intellectual disability or related condition (ID/RC) by providing the number and disposition (resident status) of residents who:</p>" +
          "<ul>" +
          "<li>Were determined by a PASRR Level II resident review evaluation not to require the level of services provided by a nursing facility, but to require specialized services, <strong>and</strong></li>" +
          "<li>Have not continuously resided in a nursing facility for at least 30 months before the date of the PASRR Level II resident review determination.</li>" +
          "</ul>" +
          "<p>All data should reflect the number and disposition as of December 31 of the reporting year.</p>" +
          "<p>All fields are required unless marked optional.</p>",
      },
      {
        type: ElementType.SummationTable,
        id: "idrc_specializedServices_table",
        caption: "Resident dispositions: Specialized services only",
        required: true,
        rows: getResidentDispositionPresetRowsAndAnswer({
          id: "idrc_specializedServices_table",
        }).rows,
        answer: getResidentDispositionPresetRowsAndAnswer({
          id: "idrc_specializedServices_table",
        }).answer,
      },
      {
        id: "idrc_specializedServices_multipleReviews",
        type: ElementType.TextAreaField,
        label:
          "Did any residents receive multiple reviews during a single stay, or have unique circumstances not covered above? If so, please explain.",
        helperText:
          "Do not include personally identifiable information (PII) or protected health information (PHI).",
        required: false,
      },
      {
        id: "idrc_specializedServices_receivedServices",
        type: ElementType.Radio,
        label:
          "During this reporting period, did all eligible residents receive specialized services or have them arranged by the state?",
        required: true,
        helperText:
          "Select “No” if any individual in the table above did not have specialized services arranged or provided by the state.",
        choices: [
          {
            label: "Yes",
            value: "Yes",
          },
          {
            label: "No",
            value: "No",
            checkedChildren: [
              {
                id: "idrc_specializedServices_howManyResidentsDidNotReceiveSpecializedServices",
                type: ElementType.Textbox,
                label:
                  "How many residents did not receive services, and why were services not arranged or provided by the state?",
                helperText:
                  "Do not include personally identifiable information (PII) or protected health information (PHI).",
                required: true,
                skipOptionalTag: true,
              },
            ],
          },
        ],
      },
    ],
  };
