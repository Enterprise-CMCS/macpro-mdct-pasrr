import {
  ElementType,
  FormPageTemplate,
  getResidentDispositionsPresetRowsAndAnswer,
  PageType,
} from "@pasrr/shared";
import { reportingCriteriaAccordion } from ".";

export const intellectualDisabilityAndRelatedConditionsNoNursingFacilityCareOrServices: FormPageTemplate =
  {
    id: "intellectual-disability-and-related-conditions-no-nursing-facility-care-or-services",
    title: "No nursing facility care or services",
    type: PageType.Standard,
    sidebar: true,
    elements: [
      {
        type: ElementType.Paragraph,
        id: "idrc_noNursingFacilityCare_eyebrow",
        style: "eyebrow",
        text: "Intellectual Disability and Related Conditions (ID/RC)",
      },
      {
        type: ElementType.Header,
        id: "idrc_noNursingFacilityCare_header",
        text: "Residents who don’t require nursing facility care or specialized services",
      },
      reportingCriteriaAccordion(
        "idrc_noNursingFacilityCare_reportingCriteriaAccordion"
      ),
      {
        type: ElementType.SubHeader,
        id: "idrc_noNursingFacilityCare_subheader",
        text: "Resident dispositions: No nursing facility care or services",
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
        id: "idrc_noNursingFacilityCare_table",
        caption: "Resident dispositions: No nursing facility care or services",
        required: true,
        ...getResidentDispositionsPresetRowsAndAnswer({
          id: "idrc_noNursingFacilityCare_table",
        }),
      },
      {
        id: "idrc_noNursingFacilityCare_multipleReviews",
        type: ElementType.TextAreaField,
        label:
          "Did any residents receive multiple reviews during a single stay, or have unique circumstances not covered above? If so, please explain.",
        helperText:
          "Do not include personally identifiable information (PII) or protected health information (PHI).",
        required: false,
        fullWidth: true,
      },
    ],
  };
