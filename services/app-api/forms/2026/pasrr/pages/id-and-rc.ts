import {
  FormPageTemplate,
  PageType,
  ElementType,
  AccordionTemplate,
} from "@pasrr/shared";

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
    {
      type: ElementType.SubHeader,
      id: "rwdrnfcbdrss-subheader",
      text: "Residents who don’t require nursing facility care, but do require specialized services",
      helperText:
        "Report the number and disposition (resident status) of residents with ID/RC who:" +
        "<ul>" +
        "  <li>Was determined by a PASRR Level II resident review evaluation not to require the level of services provided by a nursing facility, but to require specialized services, <b>and</b></li>" +
        "  <li>Has not continuously resided in a nursing facility for at least 30 months before the date of the PASRR Level II resident review determination.</li>" +
        "</ul>",
    },
    // TABLE
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
    {
      type: ElementType.SubHeader,
      id: "rwdrnfcoss-subheader",
      text: "Residents who don’t require nursing facility care or specialized services",
      helperText:
        "Report the number and disposition (resident status) of residents with ID/RC who:" +
        "<ul>" +
        "  <li>Was determined by a PASRR Level II resident review evaluation not to require the level of services provided by a nursing facility or do not require specialized services, <b>and</b></li>" +
        "  <li>Has not continuously resided in a nursing facility for at least 30 months before the date of the PASRR Level II resident review determination. </li>" +
        "</ul>",
    },
    // TABLE
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
