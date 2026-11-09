import { ReportPages } from "@pasrr/shared";
// routes
import { generalInformation } from "./pages/general-information";
import { intellectualDisabilityAndRelatedConditions } from "./pages/intellectual-disability-and-related-conditions";
import { seriousMentalIllness } from "./pages/serious-mental-illness";
import { seriousMentalIllnessSpecializedServices } from "./pages/serious-mental-illness/serious-mental-illness-specialized-services";
import { seriousMentalIllnessNoNursingFacilityCare } from "./pages/serious-mental-illness/serious-mental-illness-no-nursing-facility-care";
import { reviewAndSubmit } from "./pages/review-and-submit";

export const pasrrReportTemplate = (_state: string): ReportPages => [
  {
    id: "root",
    childPageIds: [
      "general-information",
      "intellectual-disability-and-related-conditions",
      "serious-mental-illness",
      "review-submit",
    ],
  },
  generalInformation,
  intellectualDisabilityAndRelatedConditions,
  seriousMentalIllness,
  seriousMentalIllnessSpecializedServices,
  seriousMentalIllnessNoNursingFacilityCare,
  reviewAndSubmit,
];
