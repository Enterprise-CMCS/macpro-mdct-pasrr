import {
  fieldGroupElementSchema,
  pageElementSchema,
  uploadListPropSchema,
  validateReportPayload,
} from "./reportValidation";
import {
  dropdownEmptyLabel,
  DropdownTemplate,
  ElementType,
  FormPageTemplate,
  TextboxTemplate,
} from "@pasrr/shared";
import { validReport } from "./tests/mockReport";

describe("reportValidation", () => {
  describe("validateReportPayload", () => {
    test("keeps skipOptionalTag so General Information fields stay without the Required tag", async () => {
      const validated = await validateReportPayload(validReport);
      const generalInformation = validated.pages.find(
        (page) => page.id === "general-information"
      ) as FormPageTemplate;
      const inputs = generalInformation.elements.filter(
        (element) =>
          "required" in element && element.type !== ElementType.FieldGroup
      );

      expect(inputs.length).toBeGreaterThan(0);
      for (const input of inputs) {
        expect(input).toHaveProperty("skipOptionalTag", true);
      }
    });
  });

  describe("pageElementSchema", () => {
    describe("ElementType.Dropdown", () => {
      const mockedDropdownElement: DropdownTemplate = {
        type: ElementType.Dropdown,
        id: "mock_dropdownId",
        label: "Dropdown",
        required: true,
        options: [
          {
            label: dropdownEmptyLabel,
            value: "",
          },
        ],
      };

      test("accepts empty value for dropdownEmptyLabel", async () => {
        await expect(
          pageElementSchema.validate(mockedDropdownElement)
        ).resolves.toBeDefined();
      });

      test("rejects empty value for other labels", async () => {
        await expect(
          pageElementSchema.validate({
            ...mockedDropdownElement,
            options: [
              ...mockedDropdownElement.options,
              {
                label: "Option",
                value: "",
              },
            ],
          })
        ).rejects.toThrow("options[1].value is a required field");
      });
    });

    describe("missing ElementType", () => {
      const mockedMissingType = {
        id: "mock_missingTypeId",
        label: "Missing",
        required: true,
      } as TextboxTemplate;

      test("throws error", async () => {
        expect(() =>
          pageElementSchema.validate({
            ...mockedMissingType,
            answer: "mock text",
          })
        ).toThrow("ElementType is missing");
      });
    });

    describe("invalid ElementType", () => {
      const mockedInvalidType = {
        type: "invalid",
        id: "mock_invalidTypeId",
        label: "Invalid",
        required: true,
      };

      test("throws error", async () => {
        expect(() =>
          pageElementSchema.validate({
            ...mockedInvalidType,
            answer: "mock text",
          })
        ).toThrow("ElementType is not valid");
      });
    });
  });
  describe("fieldGroupElementSchema", () => {
    describe("invalid ElementType", () => {
      const mockedInvalidType = {
        type: "invalid",
        id: "mock_invalidTypeId",
        label: "Invalid",
        required: true,
      };

      test("throws error", async () => {
        expect(() =>
          fieldGroupElementSchema.validate({
            ...mockedInvalidType,
            answer: "mock text",
          })
        ).toThrow("ElementType is not valid");
      });
    });
  });

  describe("uploadListPropSchema", () => {
    test("accepts valid attachment with matching extensions", async () => {
      await expect(
        uploadListPropSchema.validate({
          name: "mock-file-id.pdf",
          size: 4318,
          fileId: "mockKsuId_mock-file-id.pdf",
        })
      ).resolves.toBeDefined();
    });

    test("rejects disallowed extension in name", async () => {
      await expect(
        uploadListPropSchema.validate({
          name: "mock-file-id.svg",
          size: 4318,
          fileId: "mockKsuId_mock-file-id.svg",
        })
      ).rejects.toThrow("Unsupported file type");
    });

    test("rejects mismatched extensions between name and fileId", async () => {
      await expect(
        uploadListPropSchema.validate({
          name: "mock-file-id.png",
          size: 4318,
          fileId: "mockKsuId_mock-file-id.pdf",
        })
      ).rejects.toThrow("fileId extension must match name");
    });

    test("rejects disallowed extension in fileId", async () => {
      await expect(
        uploadListPropSchema.validate({
          name: "mock-file-id.exe",
          size: 100,
          fileId: "mockKsuId_mock-file-id.exe",
        })
      ).rejects.toThrow("Unsupported file type");
    });
  });
});
