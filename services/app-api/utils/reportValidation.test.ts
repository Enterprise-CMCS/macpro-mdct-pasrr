import { FormPageTemplate } from "@pasrr/shared";
import {
  uploadListPropSchema,
  validateReportPayload,
} from "./reportValidation";
import { validReport } from "./tests/mockReport";

describe("validateReportPayload", () => {
  test("keeps skipOptionalTag so General Information fields stay without the Required tag", async () => {
    const validated = await validateReportPayload(validReport);
    const generalInformation = validated.pages.find(
      (page) => page.id === "general-information"
    ) as FormPageTemplate;
    const inputs = generalInformation.elements.filter(
      (element) => "required" in element
    );

    expect(inputs.length).toBeGreaterThan(0);
    for (const input of inputs) {
      expect(input).toHaveProperty("skipOptionalTag", true);
    }
  });
});

describe("uploadListPropSchema", () => {
  test("accepts valid attachment with matching extensions", async () => {
    await expect(
      uploadListPropSchema.validate({
        name: "basic_image.png",
        size: 4318,
        fileId: "ABC123_basic_image.png",
      })
    ).resolves.toBeDefined();
  });

  test("rejects disallowed extension in name", async () => {
    await expect(
      uploadListPropSchema.validate({
        name: "basic_image.svg",
        size: 4318,
        fileId: "ABC123_malicious_image.svg",
      })
    ).rejects.toThrow("Unsupported file type");
  });

  test("rejects mismatched extensions between name and fileId", async () => {
    await expect(
      uploadListPropSchema.validate({
        name: "basic_image.png",
        size: 4318,
        fileId: "ABC123_basic_image.pdf",
      })
    ).rejects.toThrow("fileId extension must match name");
  });

  test("rejects disallowed extension in fileId", async () => {
    await expect(
      uploadListPropSchema.validate({
        name: "malware.exe",
        size: 100,
        fileId: "ABC123_malware.exe",
      })
    ).rejects.toThrow("Unsupported file type");
  });
});
