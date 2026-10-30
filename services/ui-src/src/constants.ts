export const ErrorMessages = {
  endDateBeforeStartDate: "End date can't be before start date",
  mustBeADate: "Response must be a date in MMDDYYYY format",
  mustBeADateOptional:
    "If provided, response must be a date in MMDDYYYY format",
  mustBeANumber: "Response must be a valid number",
  requiredResponse: "A response is required",
  mustBeAnEmail: "Response must be a valid email address",
  denominatorZero: (
    numerator: string = "Numerator",
    denominator: string = "denominator"
  ) => `${numerator} must be 0 when the ${denominator} is 0`,
  mustBeUniqueReportName:
    "A report with this name already exists during this reporting period.",
  mustBeACurrency: "Response must be a valid currency amount",
  mustBeALink: "Response must be a valid url",
  mustBeAPhone: "Enter a valid phone number.",
  mustBeAZipCode: "Enter a valid Zip code.",
} as const;

export const PRODUCTION_HOST_DOMAIN = "mdctpasrr.cms.gov";

export const notAnsweredText = "Not answered";
export const autoPopulatedText = "Auto-populates from previous response";
export const autoCalculatesText = "Auto-calculates from previous response";

export const HELP_DESK_EMAIL_ADDRESS = "mdct_help@cms.hhs.gov" as const;

export const PASRR_OVERVIEW_URL =
  "https://www.medicaid.gov/medicaid/long-term-services-supports/institutional-long-term-care/preadmission-screening-and-resident-review";

export const VISITED_LINKS_STORAGE_KEY = "mdctpasrr_visited_links";

export const externalLinkAltText = "(Opens in a new tab)";

// TIMEOUT PARAMS
export const IDLE_WINDOW = 30 * 60 * 1000; // ms
export const PROMPT_AT = 29 * 60 * 1000; //ms

export const budgetPeriodFilterOptions = [
  { label: "All", value: "All" },
  { label: "Budget Period 1", value: 1 },
  { label: "Budget Period 2", value: 2 },
  { label: "Budget Period 3", value: 3 },
  { label: "Budget Period 4", value: 4 },
  { label: "Budget Period 5", value: 5 },
];
