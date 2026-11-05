import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const smiSpecializedServicesOnly: FormPageTemplate = {
  id: "smi-specialized-services-only",
  title: "Specialized services only",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "smi-specialized-services-only-header",
      text: "Specialized services only",
    },
  ],
};
