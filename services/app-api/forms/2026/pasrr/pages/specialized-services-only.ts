import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const specializedServicesOnly: FormPageTemplate = {
  id: "idrc_specializedServicesOnly",
  title: "Specialized services only",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "idrc_specializedServicesOnlyHeader",
      text: "Specialized services only",
    },
  ],
};
