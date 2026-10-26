import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { testA11y } from "utils/testing/commonTests";
import {
  dropdownEmptyOption,
  DropdownTemplate,
  ElementType,
} from "@pasrr/shared";
import { DropdownField } from "./DropdownField";
import assert from "node:assert";
import { useState } from "react";

const mockedDropdownElement: DropdownTemplate = {
  id: "mock-dropdown-id",
  type: ElementType.Dropdown,
  label: "test-dropdown-field",
  helperText: "helper text",
  required: true,
  skipOptionalTag: true,
  options: [
    dropdownEmptyOption,
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
  ],
};
const updateSpy = vi.fn();

const DropdownWrapper = ({ template }: { template: DropdownTemplate }) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return (
    <>
      <DropdownField element={element} updateElement={onChange} />
      <button type="button">Other focusable element</button>
    </>
  );
};

describe("<DropdownField />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Test DropdownField basic functionality", () => {
    test("DropdownField is visible", () => {
      render(<DropdownWrapper template={mockedDropdownElement} />);
      const dropdown = screen.getAllByLabelText("test-dropdown-field")[0];
      expect(dropdown).toBeInTheDocument();
      assert.ok(dropdown instanceof HTMLSelectElement);
      expect(dropdown.options.length).toBe(4);
    });

    test("DropdownField should send updates to the Form", async () => {
      render(<DropdownWrapper template={mockedDropdownElement} />);
      const dropdown = screen.getAllByLabelText("test-dropdown-field")[0];

      await userEvent.selectOptions(dropdown, "2027");

      expect(updateSpy).toHaveBeenCalledWith({ answer: "2027" });
    });

    test("DropdownField should render error on change for required field", async () => {
      render(<DropdownWrapper template={mockedDropdownElement} />);
      const dropdown = screen.getAllByLabelText("test-dropdown-field")[0];
      await userEvent.selectOptions(dropdown, "2026");
      await userEvent.selectOptions(dropdown, "");
      expect(screen.getByText("A response is required")).toBeVisible();
    });

    test("DropdownField should render error on blur for required field", async () => {
      window.HTMLElement.prototype.scrollIntoView = vi.fn();
      render(<DropdownWrapper template={mockedDropdownElement} />);
      const dropdown = screen.getByRole("button", {
        name: "- Select an option - test-dropdown-field",
      });
      await userEvent.click(dropdown);
      await userEvent.tab();
      expect(screen.getByText("A response is required")).toBeVisible();
    });
  });

  testA11y(<DropdownWrapper template={mockedDropdownElement} />);
});
