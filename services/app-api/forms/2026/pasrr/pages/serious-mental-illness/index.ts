import {
  AccordionTemplate,
  ElementType,
  ParentPageTemplate,
} from "@pasrr/shared";

export const reportingCriteriaAccordion = (id: string) =>
  ({
    type: ElementType.Accordion,
    id,
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
  }) as AccordionTemplate;

export const seriousMentalIllness: ParentPageTemplate = {
  id: "serious-mental-illness",
  title: "Serious Mental Illness (SMI)",
  childPageIds: [
    "serious-mental-illness-specialized-services-only",
    "serious-mental-illness-no-nursing-facility-care-or-services",
  ],
};
