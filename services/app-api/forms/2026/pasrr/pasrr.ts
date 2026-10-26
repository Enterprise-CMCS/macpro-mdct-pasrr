import { ReportPages } from "@pasrr/shared";
// routes
import { generalInformation } from "./general-information";
import { reviewAndSubmit } from "./review-and-submit";

export const pasrrReportTemplate = (_state: string): ReportPages => [
  {
    id: "root",
    childPageIds: ["general-information", "review-submit"],
  },
  generalInformation,
  reviewAndSubmit,
];
