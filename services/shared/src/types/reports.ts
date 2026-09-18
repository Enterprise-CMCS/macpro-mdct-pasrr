// Shared types between frontend and backend
import { StateNames } from "../utils/constants";

export type StateAbbr = keyof typeof StateNames;

export const isStateAbbr = (abbr: string | undefined): abbr is StateAbbr => {
  return Object.keys(StateNames).includes(abbr as keyof typeof StateNames);
};

export enum ReportType {
  PASRR = "PASRR",
}

export enum PasrrSubType {
  ANNUAL = "ANNUAL",
  QUARTERLY = "QUARTERLY",
  FINAL = "FINAL",
}

export const isReportType = (
  reportType: string | undefined
): reportType is ReportType => {
  return Object.values(ReportType).includes(reportType as ReportType);
};

export interface CreateReportOptions {
  mockDate?: string;
}

export interface ZipRequestBody {
  type: ZipRequestTypes;
  report?: ZipRequestReportDetails; // REPORT type
}

export enum ZipRequestTypes {
  REPORT = "REPORT",
}

export interface ZipRequestReportDetails {
  state: StateAbbr;
  reportType: ReportType;
  id: string;
}

export interface ReportOptions {
  name: string;
  subType: PasrrSubType;
  subTypeKey: string;
  budgetPeriod: number;
  pages: ReportPages;
  copyFromReportId?: string;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
  ACCEPTED = "Accepted",
}

export const CompletedReportStatuses = [
  ReportStatus.SUBMITTED,
  ReportStatus.ACCEPTED,
];

export const isCompleteStatus = (status: ReportStatus | undefined) => {
  return status && CompletedReportStatuses.includes(status);
};

export enum AlertTypes {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

export enum PageStatus {
  OPTIONAL = "Optional",
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  ABANDONED = "Abandoned",
  COMPLETE = "Complete",
}

export enum CommentType {
  REPORT = "report",
  SUBMIT_FOR_REVIEW = "submit_for_review",
  ATTACHMENT = "attachment",
  ATTACHMENT_STATUS = "attachment_status",
}

export type Comment = {
  contextId: string;
  created: number;
  id: string;
  author: string;
  authorEmail: string;
  isInternal: boolean;
  type: CommentType;
  parentReportId?: string;
  comment?: string;
  statusChange?: AttachmentStatus | ReportStatus;
};

export interface Report extends ReportOptions {
  id: string;
  type: ReportType;
  state: StateAbbr;
  created: number;
  lastEdited?: number;
  lastEditedBy?: string;
  lastEditedByEmail?: string;
  submitted?: number;
  submissionDates?: { submitted: number }[];
  submittedBy?: string;
  submittedByEmail?: string;
  status: ReportStatus;
  submissionCount: number;
}

export type LiteReport = Omit<Report, "pages">;

export type ReportPage =
  | ParentPageTemplate
  | FormPageTemplate
  | ReviewSubmitTemplate;

export type ReportPages = ReportPage[];

export type ParentPageTemplate = {
  id: PageId;
  childPageIds: PageId[];
  title?: undefined;
  type?: undefined;
  elements?: undefined;
  sidebar?: undefined;
  hideNavButtons?: undefined;
};

export type FormPageTemplate = {
  id: PageId;
  title: string;
  type: PageType;
  status?: PageStatus;
  elements: PageElement[];
  sidebar?: boolean;
  hideNavButtons?: boolean;
  childPageIds?: PageId[];
};

export interface ReviewSubmitTemplate extends FormPageTemplate {
  submittedView: PageElement[];
}

export type PageId = string;

export type UploadListProp = {
  name: string;
  size: number;
  fileId: string;
};

export enum PageType {
  Standard = "standard",
  Modal = "modal",
  ReviewSubmit = "reviewSubmit",
}

export type AccordionGroupItem = {
  label: string;
  elements: PageElement[];
};

export enum ElementType {
  Header = "header",
  SubHeader = "subHeader",
  Textbox = "textbox",
  TextAreaField = "textAreaField",
  NumberField = "numberField",
  Date = "date",
  Dropdown = "dropdown",
  Accordion = "accordion",
  Paragraph = "paragraph",
  Radio = "radio",
  Checkbox = "checkbox",
  ButtonLink = "buttonLink",
  StatusTable = "statusTable",
  StatusAlert = "statusAlert",
  Divider = "divider",
  SubmissionParagraph = "submissionParagraph",
  ListInput = "listInput",
  AttachmentArea = "attachmentArea",
  AccordionGroup = "accordionGroup",
  ActionTable = "actionTable",
  SubmitForReview = "submitForReview",
}

export type PageElement =
  | HeaderTemplate
  | SubHeaderTemplate
  | TextboxTemplate
  | NumberFieldTemplate
  | TextAreaBoxTemplate
  | DateTemplate
  | DropdownTemplate
  | AccordionTemplate
  | ParagraphTemplate
  | RadioTemplate
  | CheckboxTemplate
  | ButtonLinkTemplate
  | StatusTableTemplate
  | StatusAlertTemplate
  | DividerTemplate
  | SubmissionParagraphTemplate
  | ListInputTemplate
  | AccordionGroupTemplate
  | AttachmentAreaTemplate
  | ActionTableTemplate
  | SubmitForReviewTemplate;

export type HideCondition = {
  controllerElementId: string;
  answer: string;
};

export type ChoiceTemplate = {
  label: string;
  value: string;
  checked?: boolean;
  checkedChildren?: PageElement[];
};

export type AccordionTemplate = {
  type: ElementType.Accordion;
  id: string;
  label: string;
  value: string;
};

export type ButtonLinkTemplate = {
  type: ElementType.ButtonLink;
  id: string;
  label: string;
  to: PageId;
  style?: string;
};

export type DividerTemplate = {
  type: ElementType.Divider;
  id: string;
};

export type StatusTableTemplate = {
  type: ElementType.StatusTable;
  id: string;
  to: PageId;
};

export type SubmissionParagraphTemplate = {
  type: ElementType.SubmissionParagraph;
  id: string;
};

export enum HeaderIcon {
  Check = "check",
}

interface DisplayElementTemplate {
  type: ElementType;
  id: string;
  text: string;
}

export interface HeaderTemplate extends DisplayElementTemplate {
  type: ElementType.Header;
  icon?: HeaderIcon;
}

export interface ParagraphTemplate extends DisplayElementTemplate {
  type: ElementType.Paragraph;
  title?: string;
  style?: string;
}

export interface StatusAlertTemplate extends DisplayElementTemplate {
  type: ElementType.StatusAlert;
  title: string;
  status: AlertTypes;
  for?: string;
}

export interface SubHeaderTemplate extends DisplayElementTemplate {
  type: ElementType.SubHeader;
  helperText?: string;
  hideCondition?: HideCondition;
}

interface InputElementTemplate {
  type: ElementType;
  id: string;
  label: string;
  helperText?: string;
  helperTextLink?: { link: string; label: string; text: string };
  required: boolean;
  quarterly?: boolean;
  disabled?: boolean;
  editByRole?: string[];
}

export interface CheckboxTemplate extends InputElementTemplate {
  type: ElementType.Checkbox;
  choices: ChoiceTemplate[];
  answer?: string[];
}

export interface DateTemplate extends InputElementTemplate {
  type: ElementType.Date;
  answer?: string;
}

export interface DropdownTemplate extends InputElementTemplate {
  type: ElementType.Dropdown;
  options: ChoiceTemplate[];
  answer?: string;
}

export interface ListInputTemplate extends InputElementTemplate {
  type: ElementType.ListInput;
  fieldLabel: string;
  buttonText: string;
  answer?: string[];
  validation?: string;
}

export interface NumberFieldTemplate extends InputElementTemplate {
  type: ElementType.NumberField;
  mask?: MaskType;
  answer?: number;
  hideCondition?: never;
}

export interface RadioTemplate extends InputElementTemplate {
  type: ElementType.Radio;
  choices: ChoiceTemplate[];
  answer?: string;
  hideCondition?: HideCondition;
  clickAction?: string;
}

export interface TextAreaBoxTemplate extends InputElementTemplate {
  type: ElementType.TextAreaField;
  answer?: string;
  hideCondition?: HideCondition;
  charLimit?: number;
}

export interface TextboxTemplate extends InputElementTemplate {
  type: ElementType.Textbox;
  answer?: string;
  hideCondition?: HideCondition;
}

export interface AttachmentAreaTemplate extends InputElementTemplate {
  type: ElementType.AttachmentArea;
  subLabel?: string;
  message?: string;
  answer?: UploadListProp[];
}

export interface AccordionGroupTemplate {
  type: ElementType.AccordionGroup;
  id: string;
  accordions: AccordionGroupItem[];
  required: boolean;
  answer?: boolean[];
}

export enum AttachmentStatus {
  PENDING_REVIEW = "Pending Review", // State driven
  NEEDS_REVISION = "Needs Revision", // CMS driven
  LOCKED_FOR_SCORING = "Locked for Scoring", // CMS driven
  INFORMATIONAL = "Informational",
  ARCHIVED = "Archived",
}

export const FileStatusOptions = Object.values(AttachmentStatus).map(
  (status) => {
    return { label: status, value: status };
  }
);

export enum MaskType {
  CommaSeparated = "CommaSeparated",
}

export interface ActionElement {
  id: string;
  type: ElementType;
  disabled?: boolean;
  mask?: MaskType;
  hintText?: string;
}

export interface ActionRowElement extends ActionElement {
  header: string;
}

export interface ActionModalElement extends ActionElement {
  label: string;
  editOnly?: boolean;
  children?: { label: string; value: string }[];
  required: boolean;
  mask?: MaskType;
}

export type ActionAnswerShape = { id: string; value: string | number }[];

export interface ActionTableTemplate {
  type: ElementType.ActionTable;
  id: string;
  label: string;
  hintText: string;
  modal: {
    title: string;
    hintText?: string;
    elements: ActionModalElement[];
  };
  rows: ActionRowElement[];
  answer?: ActionAnswerShape[];
  quarterly?: boolean;
  disabled?: boolean;
  required: boolean;
}

export interface SubmitForReviewTemplate {
  type: ElementType.SubmitForReview;
  id: string;
}

export interface PasrrSubTypeData {
  [key: string]: {
    name: string;
    dateRangeString: string;
    openDate: number;
    startDate: number;
    endDate: number;
    nextReportSubType: string;
    type: PasrrSubType;
    budgetPeriod: number;
    reportTemplateBuilder?: (state: string) => ReportPages;
  };
}

// included in this file to prevent cyclical declaration between constants and types
// TODO: placeholder reporting schedule — replace with PASRR's real report
// sub-types and calendar once the PASRR report schema is defined.
export const PasrrSubTypeMap: PasrrSubTypeData = {
  A1: {
    name: "Annual Report 1",
    dateRangeString: "1/1/2026-12/31/2026",
    openDate: 1767243600000, // 1/1/2026
    startDate: 1767243600000,
    endDate: 1798693200000, // 12/31/2026
    nextReportSubType: "A2",
    type: PasrrSubType.ANNUAL,
    budgetPeriod: 1,
  },
  A2: {
    name: "Annual Report 2",
    dateRangeString: "1/1/2027-12/31/2027",
    openDate: 1798779600000, // 1/1/2027
    startDate: 1798779600000,
    endDate: 1830229200000, // 12/31/2027
    nextReportSubType: "",
    type: PasrrSubType.ANNUAL,
    budgetPeriod: 2,
  },
};
