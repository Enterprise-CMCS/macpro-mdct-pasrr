import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const noNursingFacilityCare: FormPageTemplate = {
  id: "idrc_noNursingFacilityCare",
  title: "No Nursing Facility Care or Services",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "idrc_noNursingFacilityCareHeader",
      text: "No Nursing Facility Care or Services",
    },
  ],
};
