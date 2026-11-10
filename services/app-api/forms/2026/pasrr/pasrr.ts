import { ReportPages } from "@pasrr/shared";
// routes
import { generalInformation } from "./pages/general-information";
import { intellectualDisabilityAndRelatedConditions } from "./pages/intellectual-disability-and-related-conditions";
import { specializedServicesOnly } from "./pages/intellectual-disability-and-related-conditions/specialized-services-only";
import { noNursingFacilityCare } from "./pages/intellectual-disability-and-related-conditions/no-nursing-facility-care";
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
  specializedServicesOnly,
  noNursingFacilityCare,
  seriousMentalIllness,
  seriousMentalIllnessSpecializedServices,
  seriousMentalIllnessNoNursingFacilityCare,
  reviewAndSubmit,
];
