import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const noNursingFacilityCare: FormPageTemplate = {
  id: "no-nursing-facility-care",
  title: "No Nursing Facility Care or Services",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "no-nursing-facility-care-header",
      text: "No Nursing Facility Care or Services",
    },
  ],
};
