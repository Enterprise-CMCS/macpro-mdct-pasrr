//Shared constants between frontend and backend

import {
  ActionRowElement,
  ElementType,
  FieldGroupElement,
  SummationTableAnswerShape,
} from "../types/reports";

// STATES

// NOTE: this is the thing we would need to remove to allow a ZZ IDM user to exist if it is requested
const isProdEnv =
  (typeof window !== "undefined" &&
    window.location.hostname === "mdctpasrr.cms.gov") ||
  (typeof process !== "undefined" && process.env.STAGE === "production");

export const StateNames = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  ...(!isProdEnv && { ZZ: "Test State ZZ" }),
};

export const dropdownEmptyLabel = "- Select an option -";
export const dropdownEmptyOption = { label: dropdownEmptyLabel, value: "" };

export const StateDropdownOptions = Object.entries(StateNames).map(
  ([key, value]) => ({
    label: value,
    value: key,
  })
);

//for fields that are required but only when it's an annual report and it needs to mutate to not required in optional.
//This also clears the answer when copied, assuming it's a string, see reports/copyReport.ts
// TODO: populate with PASRR element ids once the PASRR report schema is defined.
export const optionalInQuarterly: string[] = [];

export const acceptedFileTypes = [
  ".bmp",
  ".txt",
  ".csv",
  ".odt",
  ".ods",
  ".odp",
  ".msg",
  ".potx",
  ".pptx",
  ".ppt",
  ".rtf",
  ".tif",
  ".gif",
  ".jpeg",
  ".png",
  ".docm",
  ".docx",
  ".doc",
  ".pdf",
  ".jpg",
  ".xlsx",
  ".xltx",
  ".xls",
];

export const tabTitleMap = {
  "/": "Preadmission Screening and Resident Review",
  "/help": "How can we help you? - PASRR",
  "/profile": "My Account - PASRR",
  "/admin": "Banner Admin - PASRR",
  "/403": "Access Denied",
};

export const getExtension = (filename: string): string | undefined => {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === filename.length - 1) {
    return undefined;
  }
  return filename.slice(lastDot).toLowerCase();
};

export const isAllowedFileExtension = (ext: string): boolean => {
  return acceptedFileTypes.includes(ext.toLowerCase());
};

// Used with FieldGroup component
export const getPostalAddressElements = ({
  id,
  required = true,
  skipOptionalTag = true,
}: {
  id: string;
  required?: boolean;
  skipOptionalTag?: boolean;
}): FieldGroupElement[] => {
  return [
    {
      id: `${id}-street`,
      type: ElementType.Textbox,
      label: "Street address",
      required,
      skipOptionalTag,
    },
    {
      id: `${id}-street-line-2`,
      type: ElementType.Textbox,
      label: "Street address line 2",
      required: false,
      skipOptionalTag: false,
    },
    {
      id: `${id}-city`,
      type: ElementType.Textbox,
      label: "City",
      required,
      skipOptionalTag,
    },
    {
      id: `${id}-state`,
      type: ElementType.Dropdown,
      label: "State",
      options: [
        dropdownEmptyOption,
        ...Object.entries(StateNames).map(([value, label]) => ({
          label,
          value,
        })),
      ],
      required,
      skipOptionalTag,
    },
    {
      id: `${id}-zipcode`,
      type: ElementType.Textbox,
      label: "Postal code",
      required,
      skipOptionalTag,
    },
  ];
};

// Used with SummationTable component
export const getResidentDispositionPresetRowsAndAnswer = ({
  id,
}: {
  id: string;
}): { rows: ActionRowElement[]; answer: SummationTableAnswerShape } => {
  const dispositionColumnId = `${id}-disposition`;

  const rows = [
    {
      id: dispositionColumnId,
      header: "Disposition",
      type: ElementType.Textbox,
    },
    {
      id: `${id}-number-of-residents`,
      header: "# of residents",
      type: ElementType.NumberField,
    },
  ];

  const dispositions = [
    "Discharged to community",
    "Discharged to Medicaid home and community-based services waiver",
    "Discharged to an institution for mental diseases (IMD) or inpatient psychiatric facility",
    "Discharged to an intermediate care facility for individuals with intellectual disabilities or related conditions (ICF/IID)",
    "Discharged (setting unknown)",
    "Discharged after appeal",
    "Pending appeal",
    "Pending home or community placement",
    "Pending institutional (IMD, inpatient psychiatric facility, ICF/IID) placement",
    "Deceased",
    "Unknown",
  ];

  const answerRows = dispositions.map((value) => [
    {
      id: dispositionColumnId,
      value,
      preset: true,
      readonly: true,
    },
  ]);

  const totalRows = rows.map((row) => ({
    id: row.id,
    value: row.id === dispositionColumnId ? "Total" : "0",
    ...(row.id === dispositionColumnId ? { preset: true } : {}),
    readonly: true,
  }));
  const total = [totalRows];

  return {
    rows,
    answer: {
      rows: answerRows,
      total,
    },
  };
};
