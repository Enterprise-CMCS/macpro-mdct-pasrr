import { MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "components";
import { testA11y } from "utils/testing/commonTests";
import {
  ElementType,
  MaskType,
  NumberFieldTemplate,
  TextboxTemplate,
} from "@pasrr/shared";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { useState } from "react";

vi.mock("utils/state/hooks/useElementIsHidden");
const mockedUseElementIsHidden = useElementIsHidden as MockedFunction<
  typeof useElementIsHidden
>;

const mockedTextboxElement: TextboxTemplate = {
  id: "mock-textbox-id",
  type: ElementType.Textbox,
  label: "test label",
  helperText: "helper text",
  required: true,
};

const mockedNumberField: NumberFieldTemplate = {
  id: "mock-textbox-id",
  type: ElementType.NumberField,
  label: "test label",
  helperText: "helper text",
  required: true,
};

const updateSpy = vi.fn();

const TextFieldWrapper = ({
  template,
}: {
  template: TextboxTemplate | NumberFieldTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement } as typeof element);
  };
  return <TextField element={element as any} updateElement={onChange} />;
};

describe("<TextField />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("TextField is visible", () => {
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.getByRole("textbox");
    expect(textField).toBeVisible();
  });

  test("TextField should send updates to the Form", async () => {
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "hello");

    expect(updateSpy).toHaveBeenCalledWith({ answer: "hello" });
  });

  test("TextField should parse numeric values depending on its type", async () => {
    render(<TextFieldWrapper template={mockedNumberField} />);
    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "24");

    expect(updateSpy).toHaveBeenCalledWith({ answer: 24 });
  });

  test("TextField should render error on load for invalid email", async () => {
    const mockedEmailField = {
      ...mockedTextboxElement,
      id: "mock-email-field",
      answer: "not-an-email",
    };
    render(<TextFieldWrapper template={mockedEmailField} />);
    expect(
      screen.getByText("Response must be a valid email address")
    ).toBeVisible();

    const textField = screen.getByRole("textbox");
    await userEvent.clear(textField);
    expect(screen.getByText("A response is required")).toBeVisible();

    await userEvent.type(textField, "test@email.com");
    expect(
      screen.queryByText("A response is required")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Response must be a valid email address")
    ).not.toBeInTheDocument();
  });

  test("TextField should render error on load for invalid phone", async () => {
    const mockedPhoneField = {
      ...mockedTextboxElement,
      id: "mock-phone-field",
      answer: "not-a-phone",
    };
    render(<TextFieldWrapper template={mockedPhoneField} />);
    expect(screen.getByText("Enter a valid phone number.")).toBeVisible();

    const textField = screen.getByRole("textbox");
    await userEvent.clear(textField);
    expect(screen.getByText("A response is required")).toBeVisible();

    await userEvent.type(textField, "555-555-5555");
    expect(
      screen.queryByText("A response is required")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Enter a valid phone number.")
    ).not.toBeInTheDocument();
  });

  test("TextField should render error on load for invalid zip code", async () => {
    const mockedZipCodeField = {
      ...mockedTextboxElement,
      id: "mock-zipcode-field",
      answer: "not-a-zipcode",
    };
    render(<TextFieldWrapper template={mockedZipCodeField} />);
    expect(screen.getByText("Enter a valid Zip code.")).toBeVisible();

    const textField = screen.getByRole("textbox");
    await userEvent.clear(textField);
    expect(screen.getByText("A response is required")).toBeVisible();

    await userEvent.type(textField, "55555");
    expect(
      screen.queryByText("A response is required")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Enter a valid Zip code.")
    ).not.toBeInTheDocument();
  });

  test("NumberField should render its initial value", () => {
    render(
      <TextFieldWrapper template={{ ...mockedNumberField, answer: 123 }} />
    );

    const textField = screen.getByRole("textbox");
    expect(textField).toHaveValue("123");
  });

  test("Masked NumberField should render its initial value with mask", () => {
    const maskedNumberField = {
      ...mockedNumberField,
      mask: MaskType.CommaSeparated,
    };
    render(
      <TextFieldWrapper template={{ ...maskedNumberField, answer: 1234 }} />
    );

    const textField = screen.getByRole("textbox");
    expect(textField).toHaveValue("1,234");
  });

  test("Masked NumberField applies its mask on blur", async () => {
    const maskedNumberField = {
      ...mockedNumberField,
      mask: MaskType.CommaSeparated,
    };
    render(<TextFieldWrapper template={maskedNumberField} />);

    const textField = screen.getByRole("textbox");
    await userEvent.type(textField, "1234");
    expect(textField).toHaveValue("1234");

    await userEvent.tab();
    expect(textField).toHaveValue("1,234");
  });

  test("NumberField should respond to rerender", () => {
    const props = {
      element: {
        ...mockedNumberField,
        answer: 123 as number | undefined,
      },
      updateElement: () => {},
    };

    const { rerender } = render(<TextField {...props} />);
    props.element.answer = undefined;
    rerender(<TextField {...props} />);

    const textField = screen.getByRole("textbox");
    expect(textField).toHaveValue("");
  });

  test("NumberField should render error for invalid number", async () => {
    render(<TextFieldWrapper template={mockedNumberField} />);
    const textField = screen.getByRole("textbox");
    await userEvent.clear(textField);
    await userEvent.type(textField, "test");
    expect(screen.getByText("Response must be a number")).toBeVisible();

    await userEvent.clear(textField);
    expect(screen.getByText("A response is required")).toBeVisible();

    await userEvent.type(textField, "12345");
    expect(
      screen.queryByText("A response is required")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Response must be a number")
    ).not.toBeInTheDocument();
  });

  test("Text field is hidden if its hide conditions' controlling element has a matching answer", async () => {
    mockedUseElementIsHidden.mockReturnValueOnce(true);
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.queryByLabelText("test label");
    expect(textField).not.toBeInTheDocument();
  });

  testA11y(<TextFieldWrapper template={mockedTextboxElement} />);
});
