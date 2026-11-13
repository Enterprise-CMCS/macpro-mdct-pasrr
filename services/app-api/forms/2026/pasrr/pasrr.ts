import { ReportPages } from "@pasrr/shared";
// routes
import { generalInformation } from "./pages/general-information";
import { intellectualDisabilityAndRelatedConditions } from "./pages/intellectual-disability-and-related-conditions";
import { intellectualDisabilityAndRelatedConditionsSpecializedServices } from "./pages/intellectual-disability-and-related-conditions/intellectual-disability-and-related-conditions-specialized-services-only";
import { intellectualDisabilityAndRelatedConditionsNoNursingFacilityCareOrServices } from "./pages/intellectual-disability-and-related-conditions/intellectual-disability-and-related-conditions-no-nursing-facility-care-or-services";
import { seriousMentalIllness } from "./pages/serious-mental-illness";
import { seriousMentalIllnessSpecializedServices } from "./pages/serious-mental-illness/serious-mental-illness-specialized-services-only";
import { seriousMentalIllnessNoNursingFacilityCareOrServices } from "./pages/serious-mental-illness/serious-mental-illness-no-nursing-facility-care-or-services";
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
  intellectualDisabilityAndRelatedConditionsSpecializedServices,
  intellectualDisabilityAndRelatedConditionsNoNursingFacilityCareOrServices,
  seriousMentalIllness,
  seriousMentalIllnessSpecializedServices,
  seriousMentalIllnessNoNursingFacilityCareOrServices,
  reviewAndSubmit,
];
