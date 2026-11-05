import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const seriousMentalIllness: FormPageTemplate = {
  id: "serious-mental-illness",
  title: "Serious Mental Illness (SMI)",
  type: PageType.Standard,
  sidebar: true,
  childPageIds: ["smi_specializedServicesOnly", "smi_noNursingFacilityCare"],
  elements: [
    {
      type: ElementType.Header,
      id: "smi_header",
      text: "Serious Mental Illness (SMI)",
    },
  ],
};
