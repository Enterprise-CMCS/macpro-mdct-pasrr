import {
  FormPageTemplate,
  PageType,
  ElementType,
  getResidentDispositionPresetRowsAndAnswer,
} from "@pasrr/shared";

export const noNursingFacilityCare: FormPageTemplate = {
  id: "idrc-no-nursing-facility-care",
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
      text: "No nursing facility care or services",
    },
    {
      type: ElementType.SubHeader,
      id: "idrc_specializedServicesNotRequiredSubheader",
      text: "Resident dispositions: No nursing facility care or services",
      helperText:
        "<p>Report Level II resident review data for individuals with an intellectual disability or related condition (ID/RC) by providing the number and disposition (resident status) of residents who:</p>" +
        "<ul>" +
        "<li>Were determined by a PASRR Level II resident review evaluation not to require the level of services provided by a nursing facility or do not require specialized services, <strong>and</strong></li>" +
        "<li>Have not continuously resided in a nursing facility for at least 30 months before the date of the PASRR Level II resident review determination.</li>" +
        "</ul>" +
        "<p>All data should reflect the number and disposition as of December 31 of the reporting year.</p>" +
        "<p>All fields are required unless marked optional.</p>",
    },
    {
      type: ElementType.SummationTable,
      id: "idrc_specializedServicesNotRequiredTable",
      caption: "Resident dispositions: No nursing facility care or services",
      required: true,
      rows: getResidentDispositionPresetRowsAndAnswer({
        id: "idrc_specializedServicesNotRequiredTable",
      }).rows,
      answer: getResidentDispositionPresetRowsAndAnswer({
        id: "idrc_specializedServicesNotRequiredTable",
      }).answer,
    },
  ],
};
