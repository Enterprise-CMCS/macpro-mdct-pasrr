import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const specializedServicesOnly: FormPageTemplate = {
  id: "specialized-services-only",
  title: "Specialized services only",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "specialized-services-only-header",
      text: "Specialized services only",
    },
  ],
};
