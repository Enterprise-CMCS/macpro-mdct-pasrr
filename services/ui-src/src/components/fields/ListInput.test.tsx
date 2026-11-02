import { render, screen } from "@testing-library/react";
import { ListInput } from "./ListInput";
import { ElementType, ListInputTemplate } from "@pasrr/shared";
import userEvent from "@testing-library/user-event";

const mockedListInputElement: ListInputTemplate = {
  type: ElementType.ListInput,
  id: "mock-id",
  label: "This is a mock list input",
  fieldLabel: "mock field",
  helperText: "mock helper text",
  buttonText: "mock button text",
  required: false,
};

const updateSpy = vi.fn();

const ListInputComponent = (
  <ListInput element={mockedListInputElement} updateElement={updateSpy} />
);

describe("<ListInput />", () => {
  describe("standard list input", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      render(ListInputComponent);
    });
    test("ListInput renders without a legend title", () => {
      expect(
        screen.queryByText("This is a mock list input")
      ).not.toBeInTheDocument();
      expect(screen.getByText("mock helper text")).toBeVisible();
      expect(
        screen.getByRole("button", { name: "mock button text" })
      ).toBeVisible();
    });
    test("ListInput shows one empty field by default without a remove button", () => {
      expect(
        screen.getAllByRole("textbox", { name: "mock field" })[0]
      ).toHaveValue("");
      expect(screen.getAllByRole("textbox")).toHaveLength(1);
      expect(
        screen.queryByRole("button", { name: "Remove mock field 1" })
      ).not.toBeInTheDocument();
    });
    test("ListInput allows adding fields", async () => {
      const addBtn = screen.getByRole("button", { name: "mock button text" });
      await userEvent.click(addBtn);

      expect(
        screen.getAllByRole("textbox", { name: "mock field" })[1]
      ).toBeVisible();
      expect(screen.getAllByRole("textbox")).toHaveLength(2);
      expect(
        screen.getByRole("button", { name: "Remove mock field 1" })
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Remove mock field 2" })
      ).toBeVisible();
    });

    test("ListInput does not autofocus on page load", () => {
      expect(document.activeElement).not.toBe(
        screen.getByRole("textbox", { name: "mock field" })
      );
    });

    test("ListInput focuses the newly added field", async () => {
      const addBtn = screen.getByRole("button", { name: "mock button text" });
      await userEvent.click(addBtn);

      expect(
        screen.getAllByRole("textbox", { name: "mock field" })[1]
      ).toHaveFocus();
    });

    test("ListInput allows removing fields until one remains", async () => {
      const addBtn = screen.getByRole("button", { name: "mock button text" });
      await userEvent.click(addBtn);
      await userEvent.type(
        screen.getAllByRole("textbox", { name: "mock field" })[1],
        "second"
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Remove mock field 1" })
      );
      expect(screen.getAllByRole("textbox")).toHaveLength(1);
      expect(
        screen.getAllByRole("textbox", { name: "mock field" })[0]
      ).toHaveValue("second");
      expect(
        screen.queryByRole("button", { name: "Remove mock field 1" })
      ).not.toBeInTheDocument();
    });

    test("ListInput shows error when user does not fillout the field", async () => {
      const addBtn = screen.getByRole("button", { name: "mock button text" });
      await userEvent.click(addBtn);
      const textbox = screen.getAllByRole("textbox", { name: "mock field" })[0];
      // trigger the error message through a focus
      await userEvent.click(textbox);
      // remove focus by adding another textbox
      await userEvent.click(addBtn);
      expect(screen.getAllByText("A response is required")).toHaveLength(2);
      //get all textboxes on the page and fill them out
      const textboxes = screen.getAllByRole("textbox");
      for (const textbox of textboxes) {
        await userEvent.type(textbox, "text");
      }
      expect(
        screen.queryByText("A response is required")
      ).not.toBeInTheDocument();
    });
  });
  describe("list input with saved answers", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      render(
        <ListInput
          element={{
            ...mockedListInputElement,
            answer: ["first source", "second source"],
          }}
          updateElement={updateSpy}
        />
      );
    });

    test("ListInput shows every saved answer with remove buttons", () => {
      expect(
        screen.getAllByRole("textbox", { name: "mock field" })[0]
      ).toHaveValue("first source");
      expect(
        screen.getAllByRole("textbox", { name: "mock field" })[1]
      ).toHaveValue("second source");
      expect(
        screen.getByRole("button", { name: "Remove mock field 1" })
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: "Remove mock field 2" })
      ).toBeVisible();
    });
  });
  describe("list input with custom validation", () => {
    const mockedListInputWithValidationElement = {
      ...mockedListInputElement,
      validation: "link",
    };
    beforeEach(() => {
      vi.clearAllMocks();
      render(
        <ListInput
          element={mockedListInputWithValidationElement}
          updateElement={updateSpy}
        />
      );
    });

    test("ListInput shows error when input does not pass validation", async () => {
      const addBtn = screen.getByRole("button", { name: "mock button text" });
      await userEvent.click(addBtn);
      const textbox = screen.getAllByRole("textbox", { name: "mock field" })[0];
      await userEvent.type(textbox, "test");
      expect(screen.getByText("Response must be a valid url")).toBeVisible();
      await userEvent.clear(textbox);
      await userEvent.type(textbox, "https://cms.gov");
      expect(
        screen.queryByText("Response must be a valid url")
      ).not.toBeInTheDocument();
    });
  });
});
