import {
  AccordionTemplate,
  ElementType,
  FormPageTemplate,
  PageType,
} from "@pasrr/shared";

// accordions
const specializedServicesOnlyAccordion: AccordionTemplate = {
  type: ElementType.Accordion,
  id: "specialized-services-only-accordion",
  label: "Reporting criteria and regulations",
  value:
    "<p><b>Reporting criteria</b></p>" +
    "<p>Include all Level II resident reviews completed during the reporting period for individuals with ID/RC that meet the annual reporting criteria. This includes Level II resident reviews triggered by:</p>" +
    "<ul>" +
    "<li>A significant change in physical or mental condition.</li>" +
    "<li>Expiration of a PASRR 30-day exempted hospital discharge exemption.</li>" +
    "<li>Expiration of an PASRR advance group determination stay (such as respite care).</li>" +
    "<li>Expiration of an approved Medicaid section 1135 waiver for PASRR.</li>" +
    "</ul>" +
    "<p><b>Statuatory and regulatory citations</b></p>" +
    "<p>Section 1919(e)(7)(C)(iv) of the Act requires the state to report the number and disposition (resident status) of the nursing facility residents under Section II annually. 42 CFR § 483.132(a) specifies the settings the PASRR evaluator must assess.</p>",
};

export const specializedServicesOnly: FormPageTemplate = {
  id: "specialized-services-only",
  title:
    "Residents who don’t require nursing facility care, but do require specialized services",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    // TODO: eyebrow
    {
      type: ElementType.Header,
      id: "sso-header",
      text: "Residents who don’t require nursing facility care, but do require specialized services",
    },
    specializedServicesOnlyAccordion,
    // DISPOSITIONS TABLE
    {
      id: "sso-did-residents-receive-multiple-reviews",
      type: ElementType.TextAreaField,
      label:
        "Did any residents receive multiple reviews during a single stay, or have unique circumstances not covered above? If so, please explain.",
      helperText:
        "Do not include personally identifiable information (PII) or protected health information (PHI).",
      required: false,
    },
    {
      id: "sso-did-all-eligible-residents-receive-specialized-services",
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
              id: "sso-how-many-residents-did-not-receive-specialized-services",
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
