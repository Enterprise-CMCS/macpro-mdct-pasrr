import {
  FormPageTemplate,
  PageType,
  ElementType,
  AccordionTemplate,
  getResidentDispositionPresetRowsAndAnswer,
} from "@pasrr/shared";

const reportingCriteriaAccordion: AccordionTemplate = {
  type: ElementType.Accordion,
  id: "smi_specializedServices_reportingCriteriaAccordion",
  label: "Reporting criteria and regulations",
  value:
    "<p><strong>Reporting criteria</strong></p>" +
    "<p>Include all Level II resident reviews completed during the reporting period for individuals with SMI that meet the annual reporting criteria. This includes Level II resident reviews triggered by:</p>" +
    "<ul>" +
    "<li>A significant change in physical or mental condition.</li>" +
    "<li>Expiration of a PASRR 30-day exempted hospital discharge exemption.</li>" +
    "<li>Expiration of a PASRR advance group determination stay (such as respite care).</li>" +
    "<li>Expiration of an approved Medicaid section 1135 waiver for PASRR.</li>" +
    "</ul>" +
    "<p><strong>Statutory and regulatory citations</strong></p>" +
    "<p>Section 1919(e)(7)(C)(iv) of the Act requires the state to report the number and disposition (resident status) of the nursing facility residents under Section II annually. 42 CFR § 483.132(a) specifies the settings the PASRR evaluator must assess.</p>",
};

export const seriousMentalIllnessSpecializedServices: FormPageTemplate = {
  id: "serious-mental-illness-specialized-services",
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
    reportingCriteriaAccordion,
    {
      type: ElementType.SubHeader,
      id: "smi_specializedServicesRequiredSubheader",
      text: "Resident dispositions: Specialized services only:",
      noTopMargin: true,
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
      id: "smi_specializedServicesMultipleReviews",
      type: ElementType.TextAreaField,
      label:
        "Did any residents receive multiple reviews during a single stay, or have unique circumstances not covered above? If so, please explain.",
      helperText:
        "Do not include personally identifiable information (PII) or protected health information (PHI).",
      required: false,
    },
    {
      id: "smi_specializedServicesReceivedServices",
      type: ElementType.Radio,
      label:
        "During this reporting period, did all eligible residents receive specialized services or have them arranged?",
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
        },
      ],
    },
  ],
};
