import {
  FormPageTemplate,
  PageType,
  ElementType,
  getResidentDispositionsPresetRowsAndAnswer,
} from "@pasrr/shared";
import { reportingCriteriaAccordion } from ".";

export const seriousMentalIllnessSpecializedServices: FormPageTemplate = {
  id: "serious-mental-illness-specialized-services-only",
  title: "Specialized services only",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Paragraph,
      id: "smi_specializedServices_eyebrow",
      style: "eyebrow",
      text: "Serious Mental Illness (SMI)",
    },
    {
      type: ElementType.Header,
      id: "smi_specializedServices_header",
      text: "Residents who don’t require nursing facility care, but do require specialized services",
    },
    reportingCriteriaAccordion(
      "smi_specializedServices_reportingCriteriaAccordion"
    ),
    {
      type: ElementType.SubHeader,
      id: "smi_specializedServices_subheader",
      text: "Resident dispositions: Specialized services only",
      helperText:
        "<p>Report Level II resident review data for individuals with a serious mental illness (SMI) by providing the number and disposition (resident status) of residents who:</p>" +
        "<ul>" +
        "<li>Were determined by a PASRR Level II resident review evaluation not to require the level of services provided by a nursing facility, but to require specialized services, <strong>and</strong></li>" +
        "<li>Have not continuously resided in a nursing facility for at least 30 months before the date of the PASRR Level II resident review determination.</li>" +
        "</ul>" +
        "<p>All data should reflect the number and disposition as of December 31 of the reporting year.</p>" +
        "<p>All fields are required unless marked optional.</p>",
    },
    {
      type: ElementType.SummationTable,
      id: "smi_specializedServices_table",
      caption: "Resident dispositions: Specialized services only",
      required: true,
      rows: getResidentDispositionsPresetRowsAndAnswer({
        id: "smi_specializedServices_table",
      }).rows,
      answer: getResidentDispositionsPresetRowsAndAnswer({
        id: "smi_specializedServices_table",
      }).answer,
    },
    {
      id: "smi_specializedServices_multipleReviews",
      type: ElementType.TextAreaField,
      label:
        "Did any residents receive multiple reviews during a single stay, or have unique circumstances not covered above? If so, please explain.",
      helperText:
        "Do not include personally identifiable information (PII) or protected health information (PHI).",
      required: false,
      fullWidth: true,
    },
    {
      id: "smi_specializedServices_receivedServices",
      type: ElementType.Radio,
      label:
        "During this reporting period, did all eligible residents receive specialized services or have them arranged?",
      required: true,
      fullWidth: true,
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
              id: "smi_specializedServices_howManyResidentsDidNotReceiveServices",
              type: ElementType.TextAreaField,
              label:
                "How many residents did not receive services, and why were services not arranged or provided?",
              helperText:
                "Do not include protected health information (PHI) or personally identifiable information (PII).",
              required: true,
              skipOptionalTag: true,
            },
          ],
        },
      ],
    },
  ],
};
