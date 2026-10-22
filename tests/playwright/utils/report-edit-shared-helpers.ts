import { expect, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { ReportEditorPage } from "../tests/pageObjects/report-editor.page";

export type ReportEditLabel = string | RegExp;

export type GeneralInfoField = {
  label: ReportEditLabel;
  value: string;
  /** Zero-based index when multiple fields share the same label. */
  nth?: number;
};

export type GeneralInfoFillMode = "overwrite" | "fill-empty";

export const escapeRegExp = (str: string): string =>
  str.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

// Section ids match the placeholder PASRR report template
// (services/app-api/forms/2026/pasrr/pasrr.ts).
// TODO: update when the real PASRR report schema is defined.
export const GENERAL_INFORMATION_SECTION = "general-information";
export const REVIEW_SUBMIT_SECTION = "review-submit";

// "Name" labels both the report owner and alternate contact fields, so those
// fields are targeted by their order on the page.
export const NAME_LABEL = /^Name\s*(?:Required)?\s*$/i;
export const CONTACT_NAME_NTH = 0;
export const ALTERNATE_CONTACT_NAME_NTH = 1;
export const CONTACT_EMAIL_LABEL =
  /^Contact email address\s*(?:Required)?\s*$/i;
export const ALTERNATE_CONTACT_EMAIL_LABEL =
  /^Email address\s*(?:Required)?\s*$/i;

export const GENERAL_INFO_FIELDS: GeneralInfoField[] = [
  { label: NAME_LABEL, nth: CONTACT_NAME_NTH, value: "Test Contact" },
  { label: CONTACT_EMAIL_LABEL, value: "contact@test.gov" },
  {
    label: NAME_LABEL,
    nth: ALTERNATE_CONTACT_NAME_NTH,
    value: "Test Alternate",
  },
  { label: ALTERNATE_CONTACT_EMAIL_LABEL, value: "alternate@test.gov" },
];

const normalizeRunId = (id: string): string => {
  const cleaned = id.replaceAll(/[^a-f0-9]/gi, "").slice(0, 10);
  return cleaned.length > 0 ? cleaned : "";
};

const REPORT_TEST_RUN_ID = (() => {
  const envId =
    process.env.PW_TEST_RUN_ID ??
    process.env.GITHUB_RUN_ID ??
    process.env.CI_PIPELINE_ID;

  if (envId) {
    const normalized = normalizeRunId(envId);
    if (normalized.length > 0) {
      return normalized;
    }
  }

  return randomUUID().replaceAll("-", "").slice(0, 10);
})();

export const getReportTestRunId = (): string => REPORT_TEST_RUN_ID;

export const createArtifactId = (): string =>
  randomUUID().replaceAll("-", "").slice(0, 10);

export const createUniqueGeneralInfoFields = (
  runId: string = getReportTestRunId()
): GeneralInfoField[] => [
  { label: NAME_LABEL, nth: CONTACT_NAME_NTH, value: `Contact Name ${runId}` },
  { label: CONTACT_EMAIL_LABEL, value: `contact-${runId}@test.gov` },
  {
    label: NAME_LABEL,
    nth: ALTERNATE_CONTACT_NAME_NTH,
    value: `Alternate Name ${runId}`,
  },
  {
    label: ALTERNATE_CONTACT_EMAIL_LABEL,
    value: `alternate-${runId}@test.gov`,
  },
];

export const editGeneralInformationFields = async (
  editor: ReportEditorPage,
  fields: GeneralInfoField[],
  mode: GeneralInfoFillMode = "overwrite"
): Promise<void> => {
  for (const field of fields) {
    if (mode === "fill-empty") {
      const input = editor.getTextField(field.label, field.nth);
      const currentValue = await input.inputValue().catch(() => "");
      if (currentValue.trim().length > 0) {
        continue;
      }
    }

    await editor.fillTextField(field.label, field.value, field.nth);
  }
};

type UploadViaDialogOptions = {
  filePath: string;
  fileInputSelector?: string;
  expectedFileName?: string | RegExp;
  timeoutMs?: number;
};

export const uploadFileViaDialog = async (
  page: Page,
  options: UploadViaDialogOptions
): Promise<void> => {
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible({ timeout: options.timeoutMs });

  await dialog
    .locator(options.fileInputSelector ?? "input[type='file']")
    .setInputFiles(options.filePath);

  if (options.expectedFileName) {
    await expect(dialog.getByText(options.expectedFileName)).toBeVisible({
      timeout: options.timeoutMs,
    });
  }

  const doneButton = dialog.getByRole("button", { name: /^Done$/i });
  await expect(doneButton).toBeVisible({ timeout: options.timeoutMs });
  await doneButton.click();
  await expect(dialog).toBeHidden({ timeout: options.timeoutMs });
};
