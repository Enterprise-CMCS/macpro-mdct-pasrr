import {
  fieldGroupElementSchema,
  pageElementSchema,
  uploadListPropSchema,
} from "./reportValidation";
import {
  dropdownEmptyLabel,
  DropdownTemplate,
  ElementType,
  TextboxTemplate,
} from "@pasrr/shared";

describe("reportValidation", () => {
  describe("pageElementSchema", () => {
    describe("ElementType.Dropdown", () => {
      const mockedDropdownElement: DropdownTemplate = {
        type: ElementType.Dropdown,
        id: "mock-dropdown-id",
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
        id: "mock-missing-type-id",
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
        id: "mock-invalid-type-id",
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
        id: "mock-invalid-type-id",
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
});
