import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const seriousMentalIllness: FormPageTemplate = {
  id: "serious-mental-illness",
  title: "Serious Mental Illness (SMI)",
  type: PageType.Standard,
  sidebar: true,
  elements: [
    {
      type: ElementType.Header,
      id: "smi-header",
      text: "Serious Mental Illness (SMI)",
    },
  ],
};
