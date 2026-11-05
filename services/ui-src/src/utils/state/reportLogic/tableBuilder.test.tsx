import { ElementType, MaskType } from "@pasrr/shared";
import { buildElement, getErrorMessage } from "./tableBuilder";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { isWholePositiveNumber } from "utils/validation/inputValidation";

const mockOnChange = vi.fn();
vi.spyOn(console, "error").mockImplementation(vi.fn());

const elements = [
  {
    id: "mock-dropdown",
    type: ElementType.Dropdown,
    disabled: false,
    children: [{ label: "option 1", value: "opt1" }],
    label: "Mock Dropdown",
  },
  {
    id: "mock-textarea",
    type: ElementType.TextAreaField,
    disabled: false,
    label: "Mock TextAreaField",
  },
  {
    id: "mock-textbox",
    type: ElementType.Textbox,
    disabled: false,
    label: "Mock Textbox",
  },
  {
    id: "mock-date",
    type: ElementType.Date,
    disabled: false,
    label: "Mock Date",
  },
];

describe("Test tableBuilder functions", () => {
  describe("Test buildElement function", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      const component = elements.map((element) =>
        buildElement({
          element,
          defaultValue: "",
          id: element.id,
          key: `element-${element.id}`,
          onChange: mockOnChange,
          label: element.label,
        })
      );
      render(<>{component}</>);
    });
    test("Elements render", () => {
      elements.forEach((element) => {
        expect(screen.getAllByText(element.label)[0]).toBeVisible();
      });
    });
    test("Dropdown triggers onChange", async () => {
      const dropdown = screen.getAllByLabelText("Mock Dropdown")[0];
      await userEvent.selectOptions(dropdown, "option 1");
      expect(mockOnChange).toHaveBeenCalled();
    });
    test("Textbox triggers onChange", async () => {
      const textbox = screen.getByRole("textbox", {
        name: "Mock Textbox",
      });
      await userEvent.type(textbox, "mock");
      await userEvent.tab();
      expect(mockOnChange).toHaveBeenCalledTimes(4);
    });

    test("Masked textbox formats its value on blur", async () => {
      const StatefulMaskedTextbox = () => {
        const [value, setValue] = useState<string | number>("");
        return buildElement({
          element: {
            ...elements[2],
            mask: MaskType.CommaSeparated,
          },
          defaultValue: value,
          id: "mock-masked-textbox",
          key: "element-mock-masked-textbox",
          onChange: ([nextValue]) => setValue(nextValue),
          label: "Masked textbox",
        });
      };
      render(<StatefulMaskedTextbox />);

      const input = screen.getByRole("textbox", {
        name: "Masked textbox",
      });
      await userEvent.type(input, "1234");
      expect(input).toHaveValue("1234");

      await userEvent.tab();
      expect(input).toHaveValue("1,234");
    });

    test("TextAreaField triggers onChange", async () => {
      const textbox = screen.getByRole("textbox", {
        name: "Mock TextAreaField",
      });
      await userEvent.type(textbox, "mock");
      await userEvent.tab();
      expect(mockOnChange).toHaveBeenCalledTimes(5);
    });
    test("Date triggers onChange", async () => {
      const dateField = screen.getByRole("textbox", {
        name: "Mock Date",
      });
      await userEvent.type(dateField, "mock");
      await userEvent.tab();
      expect(mockOnChange).toHaveBeenCalledTimes(5);
    });
  });

  test("Test buildElement throws error no type is found", () => {
    const component = buildElement({
      element: { id: "mock-accordion", type: ElementType.AccordionGroup },
      defaultValue: "",
      id: "mock-accordion",
      key: "element-mock-accordion",
      onChange: mockOnChange,
      label: "Mock Accordion",
    });
    render(component);
    expect(screen.queryByText("Mock Accordion")).not.toBeInTheDocument();
  });

  describe("Test getErrorMessage function", () => {
    test("Test valid input", () => {
      expect(
        getErrorMessage({ type: ElementType.Textbox, value: ["mock value"] })
      ).toBe("");
    });

    test("Test Date error message", () => {
      expect(
        getErrorMessage({ type: ElementType.Date, value: ["not validate"] })
      ).toBe("Response must be a date in MMDDYYYY format");
    });

    test("Test Textbox & TextAreaField error message", () => {
      expect(getErrorMessage({ type: ElementType.Textbox, value: [""] })).toBe(
        "A response is required"
      );
      expect(
        getErrorMessage({ type: ElementType.TextAreaField, value: [""] })
      ).toBe("A response is required");
    });

    test.each([
      { input: "mock text", message: "Response must be a valid number" },
      { input: "0" },
      { input: "1" },
      { input: ".5" },
      { input: "-1" },
    ])("Test NumberField error message '$input'", ({ input, message = "" }) => {
      expect(
        getErrorMessage({
          type: ElementType.NumberField,
          value: [input],
        })
      ).toBe(message);
    });

    test.each([
      { input: "mock text", message: "Response must be a valid number" },
      { input: "0" },
      { input: "1" },
      { input: ".5", message: "Response must be a valid number" },
      { input: "-1", message: "Response must be a valid number" },
    ])(
      "Test NumberField whole positive number error message '$input'",
      ({ input, message = "" }) => {
        expect(
          getErrorMessage({
            type: ElementType.NumberField,
            validators: { [ElementType.NumberField]: isWholePositiveNumber },
            value: [input],
          })
        ).toBe(message);
      }
    );
  });
});
