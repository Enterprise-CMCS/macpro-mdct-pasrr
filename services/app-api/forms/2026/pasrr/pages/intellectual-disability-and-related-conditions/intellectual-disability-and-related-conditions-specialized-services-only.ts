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
  id: "idrc_specializedServices_reportingCriteriaAccordion",
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

export const intellectualDisabilityAndRelatedConditionsSpecializedServicesOnly: FormPageTemplate =
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
      reportingCriteriaAccordion,
      {
        type: ElementType.SubHeader,
        id: "idrc_specializedServicesRequiredSubheader",
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
        id: "idrc_specializedServicesRequiredTable",
        caption: "Resident dispositions: Specialized services only",
        required: true,
        rows: getResidentDispositionPresetRowsAndAnswer({
          id: "idrc_specializedServicesRequiredTable",
        }).rows,
        answer: getResidentDispositionPresetRowsAndAnswer({
          id: "idrc_specializedServicesRequiredTable",
        }).answer,
      },
      {
        id: "idrc_specializedServicesMultipleReviews",
        type: ElementType.TextAreaField,
        label:
          "Did any residents receive multiple reviews during a single stay, or have unique circumstances not covered above? If so, please explain.",
        helperText:
          "Do not include personally identifiable information (PII) or protected health information (PHI).",
        required: false,
      },
      {
        id: "idrc_specializedServicesReceivedServices",
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
                id: "idrc_howManyResidentsDidNotReceiveSpecializedServices",
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
