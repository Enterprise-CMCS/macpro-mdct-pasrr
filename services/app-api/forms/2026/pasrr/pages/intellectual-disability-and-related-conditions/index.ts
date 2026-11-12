import {
  AccordionTemplate,
  ElementType,
  ParentPageTemplate,
} from "@pasrr/shared";

// accordions
export const reportingCriteriaAccordion = (id: string) =>
  ({
    type: ElementType.Accordion,
    id,
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
  }) as AccordionTemplate;

export const intellectualDisabilityAndRelatedConditions: ParentPageTemplate = {
  id: "intellectual-disability-and-related-conditions",
  title: "Intellectual Disability and Related Conditions (ID/RC)",
  childPageIds: [
    "intellectual-disability-and-related-conditions-specialized-services-only",
    "intellectual-disability-and-related-conditions-no-nursing-facility-care-or-services",
  ],
};
