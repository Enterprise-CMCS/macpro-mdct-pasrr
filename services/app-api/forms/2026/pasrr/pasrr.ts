import { ReportPages } from "@pasrr/shared";
// routes
import { generalInformation } from "./pages/general-information";
import { intellectualDisabilityAndRelatedConditions } from "./pages/intellectual-disability-and-related-conditions";
import { seriousMentalIllness } from "./pages/serious-mental-illness";
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
  reviewAndSubmit,
];
