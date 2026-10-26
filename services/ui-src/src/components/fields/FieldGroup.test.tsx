import { FieldGroup } from "components";
import { MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUseStore } from "utils/testing/setupTest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import {
  ElementType,
  FieldGroupTemplate,
  getPostalAddressElements,
} from "@pasrr/shared";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockImplementation(
  (selector?: (state: typeof mockUseStore) => unknown) => {
    if (selector) {
      return selector(mockUseStore);
    }
    return mockUseStore;
  }
);

const id = "mock-field-group-id";

const mockedFieldGroupElement: FieldGroupTemplate = {
  id,
  type: ElementType.FieldGroup,
  label: "FieldGroup",
  required: true,
  elements: [
    {
      id: `${id}-textbox`,
      type: ElementType.Textbox,
      label: "Textbox",
      required: true,
    },
  ],
};

const updateSpy = vi.fn();

const FieldGroupWrapper = ({ template }: { template: FieldGroupTemplate }) => {
  return <FieldGroup element={template} updateElement={updateSpy} />;
};

describe("<FieldGroup />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("FieldGroup is visible", () => {
    render(<FieldGroupWrapper template={mockedFieldGroupElement} />);
    const textField = screen.getByRole("textbox");
    expect(textField).toBeVisible();
  });

  test("FieldGroup should send updates to the Form", async () => {
    render(<FieldGroupWrapper template={mockedFieldGroupElement} />);
    const textField = screen.getByRole("textbox");
    await userEvent.type(textField, "mock text");
    expect(updateSpy).toHaveBeenCalledWith({
      elements: [
        {
          ...mockedFieldGroupElement.elements[0],
          answer: "mock text",
        },
      ],
      answer: [{ id: "mock-field-group-id-textbox", value: "mock text" }],
    });
  });

  test("Postal address FieldGroup is visible", () => {
    const elements = getPostalAddressElements({ id });
    const mockedPostalAddressFieldGroupElement = {
      ...mockedFieldGroupElement,
      elements,
    };
    render(
      <FieldGroupWrapper template={mockedPostalAddressFieldGroupElement} />
    );
    elements
      .filter((t) => t.type === ElementType.Textbox)
      .forEach((t) => {
        const optionalLabel = t.skipOptionalTag ? "" : "(optional)";
        const textField = screen.getByRole("textbox", {
          name: `${t.label}${optionalLabel}`,
        });
        expect(textField).toBeVisible();
      });
    const button = screen.getByRole("button", {
      name: "- Select an option - State",
    });
    expect(button).toBeVisible();
  });

  testA11y(<FieldGroupWrapper template={mockedFieldGroupElement} />);
});
