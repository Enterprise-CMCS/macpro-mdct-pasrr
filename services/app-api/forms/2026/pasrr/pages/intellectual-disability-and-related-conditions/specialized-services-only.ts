import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const specializedServicesOnly: FormPageTemplate = {
  id: "idrc-specialized-services-only",
  title: "Specialized services only",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "idrc-specialized-services-only-header",
      text: "Specialized services only",
    },
  ],
};
