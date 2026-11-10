import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const noNursingFacilityCare: FormPageTemplate = {
  id: "idrc-no-nursing-facility-care",
  title: "No Nursing Facility Care or Services",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "idrc_noNursingFacilityCare_header",
      text: "No Nursing Facility Care or Services",
    },
  ],
};
