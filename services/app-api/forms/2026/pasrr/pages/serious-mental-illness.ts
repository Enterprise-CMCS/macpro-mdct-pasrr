import { FormPageTemplate, PageType, ElementType } from "@pasrr/shared";

export const seriousMentalIllness: FormPageTemplate = {
  id: "serious-mental-illness",
  title: "Serious Mental Illness (SMI)",
  type: PageType.Standard,
  sidebar: true,
  childPageIds: [
    "serious-mental-illness-specialized-services",
    "serious-mental-illness-no-nursing-facility-care-or-services",
  ],
  elements: [
    {
      type: ElementType.Header,
      id: "smi-header",
      text: "Serious Mental Illness (SMI)",
    },
  ],
};
