import { PasrrSubTypeData, PasrrSubTypeMap } from "@pasrr/shared";
import { pasrrReportTemplate } from "../forms/2026/pasrr/pasrr";

// TODO: placeholder — expand with PASRR's real report sub-types and template
// builders once the PASRR report schema is defined.
export const PasrrSubTypeTemplateMap: PasrrSubTypeData = {
  A1: {
    ...PasrrSubTypeMap.A1,
    reportTemplateBuilder: pasrrReportTemplate,
  },
  A2: {
    ...PasrrSubTypeMap.A2,
    reportTemplateBuilder: pasrrReportTemplate,
  },
};

export const error = {
  UNAUTHORIZED: "User is not authorized to access this resource.",
  NO_KEY: "Must provide key for table.",
  MISSING_DATA: "Missing required data.",
  INVALID_DATA: "Provided data is not valid.",
  SERVER_ERROR: "An unspecified server error occurred.",
  CREATION_ERROR: "Could not be created due to a database error.",
  END_DATE_BEFORE_START_DATE: "End date can't be before start date",
};

export const reportTable = process.env.ReportsTable!;
