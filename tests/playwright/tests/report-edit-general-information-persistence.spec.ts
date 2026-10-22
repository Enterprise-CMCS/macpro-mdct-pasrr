import { test } from "./fixtures/base";
import { ReportEditorPage } from "./pageObjects/report-editor.page";
import { TIMEOUT_AUTOSAVE } from "../utils/timeouts";
import { openReportSectionOrSkip } from "../utils/report-edit-arrange";
import {
  createUniqueGeneralInfoFields,
  editGeneralInformationFields,
  GENERAL_INFORMATION_SECTION,
  type GeneralInfoField,
  REVIEW_SUBMIT_SECTION,
} from "../utils/report-edit-shared-helpers";
import {
  verifyFieldValue,
  verifyCurrentSection,
} from "../utils/report-edit-assertions";

test.describe("Report Editing - General Information Persistence", () => {
  const fillFields = async (
    editor: ReportEditorPage,
    fields: GeneralInfoField[]
  ) => editGeneralInformationFields(editor, fields);

  const verifyFieldValues = async (
    editor: ReportEditorPage,
    fields: GeneralInfoField[]
  ) => {
    for (const field of fields) {
      await verifyFieldValue(editor, field.label, field.value, field.nth);
    }
  };

  test("should edit multiple General Information fields and verify persistence @regression", async ({
    statePage,
  }) => {
    // Arrange
    const editor = await openReportSectionOrSkip(
      statePage,
      "unsubmitted",
      GENERAL_INFORMATION_SECTION,
      (reason) => test.skip(true, reason)
    );
    if (!editor) {
      return;
    }

    const { reportType, state, reportId } = editor.getCurrentRouteParams();
    const testDataMultiple = createUniqueGeneralInfoFields();

    // Act
    await fillFields(editor, testDataMultiple);
    await editor.page.keyboard.press("Tab");
    await editor.waitForAutosaveWithSectionRefresh(
      GENERAL_INFORMATION_SECTION,
      {
        timeoutMs: TIMEOUT_AUTOSAVE,
      }
    );

    await editor.navigateToSectionAndBack(
      reportType,
      state,
      reportId,
      REVIEW_SUBMIT_SECTION,
      GENERAL_INFORMATION_SECTION
    );

    // Assert
    await verifyCurrentSection(editor, GENERAL_INFORMATION_SECTION);
    await verifyFieldValues(editor, testDataMultiple);
  });
});
