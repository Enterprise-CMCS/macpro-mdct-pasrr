import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const smiSpecializedServicesOnly: FormPageTemplate = {
  id: "smi_specializedServicesOnly",
  title: "Specialized services only",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "smi_specializedServicesOnlyHeader",
      text: "Specialized services only",
    },
  ],
};
