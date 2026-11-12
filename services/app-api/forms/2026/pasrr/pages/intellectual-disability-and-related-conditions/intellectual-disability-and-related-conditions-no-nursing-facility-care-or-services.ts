import {
  AccordionTemplate,
  ElementType,
  FormPageTemplate,
  getResidentDispositionPresetRowsAndAnswer,
  PageType,
} from "@pasrr/shared";

// accordions
const reportingCriteriaAccordion: AccordionTemplate = {
  type: ElementType.Accordion,
  id: "idrc_noNursingFacilityCare_reportingCriteriaAccordion",
  label: "Reporting criteria and regulations",
  value:
    "<p><strong>Reporting criteria</strong></p>" +
    "<p>Include all Level II resident reviews completed during the reporting period for individuals with ID/RC that meet the annual reporting criteria. This includes Level II resident reviews triggered by:</p>" +
    "<ul>" +
    "<li>A significant change in physical or mental condition.</li>" +
    "<li>Expiration of a PASRR 30-day exempted hospital discharge exemption.</li>" +
    "<li>Expiration of an PASRR advance group determination stay (such as respite care).</li>" +
    "<li>Expiration of an approved Medicaid section 1135 waiver for PASRR.</li>" +
    "</ul>" +
    "<p><strong>Statuatory and regulatory citations</b></strong>" +
    "<ul>" +
    "<li>Section 1919(e)(7)(C)(iv) of the Act requires the state to report the number and disposition (resident status) of the nursing facility residents under Section II annually. 42 CFR § 483.132(a) specifies the settings the PASRR evaluator must assess.</li>" +
    "</ul>",
};

export const intellectualDisabilityAndRelatedConditionsNoNursingFacilityCareOrServices: FormPageTemplate =
  {
    id: "intellectual-disability-and-related-conditions-no-nursing-facility-care-or-services",
    title: "No nursing facility care or services",
    type: PageType.Standard,
    sidebar: true,
    elements: [
      {
        type: ElementType.Paragraph,
        id: "idrc_noNursingFacilityCareEyebrow",
        style: "eyebrow",
        text: "Intellectual Disability and Related Conditions (ID/RC)",
      },
      {
        type: ElementType.Header,
        id: "idrc_noNursingFacilityCareHeader",
        text: "Residents who don’t require nursing facility care or specialized services",
      },
      reportingCriteriaAccordion,
      {
        type: ElementType.SubHeader,
        id: "idrc_noNursingFacilityCareSubheader",
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
        id: "idrc_noNursingFacilityCareTable",
        caption: "Resident dispositions: No nursing facility care or services",
        required: true,
        rows: getResidentDispositionPresetRowsAndAnswer({
          id: "idrc_noNursingFacilityCareTable",
        }).rows,
        answer: getResidentDispositionPresetRowsAndAnswer({
          id: "idrc_noNursingFacilityCareTable",
        }).answer,
      },
      {
        id: "idrc_noNursingFacilityCareMultipleReviews",
        type: ElementType.TextAreaField,
        label:
          "Did any residents receive multiple reviews during a single stay, or have unique circumstances not covered above? If so, please explain. (optional)",
        helperText:
          "Do not include personally identifiable information (PII) or protected health information (PHI).",
        required: false,
      },
    ],
  };
