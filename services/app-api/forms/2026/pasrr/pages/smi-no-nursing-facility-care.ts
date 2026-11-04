import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const smiNoNursingFacilityCare: FormPageTemplate = {
  id: "smi_noNursingFacilityCare",
  title: "No Nursing Facility Care or Services",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "smi_noNursingFacilityCareHeader",
      text: "No Nursing Facility Care or Services",
    },
  ],
};
