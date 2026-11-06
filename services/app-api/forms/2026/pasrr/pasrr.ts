import { ReportPages } from "@pasrr/shared";
// routes
import { generalInformation } from "./pages/general-information";
// import { intellectualDisabilityAndRelatedConditions } from "./pages/intellectual-disability-and-related-conditions/intellectual-disability-and-related-conditions";
import { specializedServicesOnly } from "./pages/intellectual-disability-and-related-conditions/specialized-services-only";
import { noNursingFacilityCareOrServices } from "./pages/intellectual-disability-and-related-conditions/no-nursing-facility-care-or-services";
import { seriousMentalIllness } from "./pages/serious-mental-illness";
import { reviewAndSubmit } from "./pages/review-and-submit";

export const pasrrReportTemplate = (_state: string): ReportPages => [
  {
    id: "root",
    childPageIds: [
      "general-information",
      // "intellectual-disability-and-related-conditions",
      "specialized-services-only",
      "no-nursing-facility-care-or-services",
      "serious-mental-illness",
      "review-submit",
    ],
  },
  generalInformation,
  // intellectualDisabilityAndRelatedConditions,
  specializedServicesOnly,
  noNursingFacilityCareOrServices,
  seriousMentalIllness,
  reviewAndSubmit,
];
