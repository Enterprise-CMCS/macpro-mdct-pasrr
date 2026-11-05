import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const smiNoNursingFacilityCare: FormPageTemplate = {
  id: "smi-no-nursing-facility-care",
  title: "No Nursing Facility Care or Services",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "smi-no-nursing-facility-care-header",
      text: "No Nursing Facility Care or Services",
    },
  ],
};
