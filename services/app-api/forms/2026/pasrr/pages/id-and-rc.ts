import {
  FormPageTemplate,
  PageType,
  ElementType,
  AccordionTemplate,
} from "@pasrr/shared";

// accordions
const residentReviewsAccordion: AccordionTemplate = {
  type: ElementType.Accordion,
  id: "resident-reviews-accordion",
  label: "Which resident reviews should I include?",
  value:
    "Include all Level II resident reviews completed during the reporting period for individuals with ID/RC that meet the annual reporting criteria. This includes Level II resident reviews triggered by:" +
    "<ul>" +
    "  <li>A significant change in physical or mental condition</li>" +
    "  <li>Expiration of a PASRR 30-day exempted hospital discharge exemption</li>" +
    "  <li>Expiration of an PASRR advance group determination stay (such as respite care)</li>" +
    "  <li>Expiration of an approved Medicaid section 1135 waiver for PASRR</li>" +
    "</ul>",
};

export const intellectualDisabilityAndRelatedConditions: FormPageTemplate = {
  id: "intellectual-disability-and-related-conditions",
  title: "Intellectual Disability and Related Conditions (ID/RC)",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "idrc-header",
      text: "Intellectual Disability and Related Conditions (ID/RC)",
      helperText:
        "Section 1919(e)(7)(C)(iv) of the Act requires the state to report the number and disposition (resident status) of the nursing facility residents under Section II annually. 42 CFR §483.132(a) specifies the settings the PASRR evaluator must assess. Report Level II resident review data for individuals with an intellectual disability or related condition (ID/RC). All data should reflect the number and disposition as of December 31 of the reporting year.",
    },
    residentReviewsAccordion,
    // TODO: dispositions table
    {
      id: "qFCBEF0Elrjv9qTptN7igzZa",
      type: ElementType.TextAreaField,
      label:
        "Did any residents receive multiple reviews during a single stay, or have unique circumstances not covered above? If so, please explain. Do not include personally identifiable information (PII) or protected health information (PHI).",
      required: false,
      helperText: "Placeholder",
    },
    {
      id: "t2XYm6zxRV8yGR3ue8PwiM8g",
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
              id: "luRDPU38GzZxxOq7LqycQRpo",
              type: ElementType.TextAreaField,
              label:
                "How many residents did not receive services, and why were services not arranged or provided by the state?",
              helperText:
                "Do not include personally identifiable information (PII) or protected health information (PHI).",
              required: true,
            },
          ],
        },
      ],
    },
    // TODO: dispositions table
    {
      id: "qkz8lof1dGiflEWb9W4CkIFV",
      type: ElementType.TextAreaField,
      label:
        "Did any residents receive multiple reviews during a single stay, or have unique circumstances not covered above? If so, please explain. Do not include personally identifiable information (PII) or protected health information (PHI).",
      helperText: "Placeholder",
      required: false,
    },
  ],
};
