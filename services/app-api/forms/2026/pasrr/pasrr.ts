import { ReportPages } from "@pasrr/shared";
// routes
import { generalInformation } from "./pages/general-information";
import { intellectualDisabilityAndRelatedConditions } from "./pages/id-and-rc";
import { reviewAndSubmit } from "./pages/review-and-submit";

export const pasrrReportTemplate = (_state: string): ReportPages => [
  {
    id: "root",
    childPageIds: [
      "general-information",
      "intellectual-disability-and-related-conditions",
      "review-submit",
    ],
  },
  generalInformation,
  intellectualDisabilityAndRelatedConditions,
  reviewAndSubmit,
];
