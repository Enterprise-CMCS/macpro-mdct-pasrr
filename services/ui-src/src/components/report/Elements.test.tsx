import { render, screen } from "@testing-library/react";
import { ElementType, PageElement } from "@pasrr/shared";
import { SubHeaderElement } from "../report/Elements";

describe("Elements", () => {
  describe("<SubHeaderElement />", () => {
    const mockedSubheaderElement: PageElement = {
      id: "mock-subheader-id",
      type: ElementType.SubHeader,
      text: "SubHeader",
      helperText: "mock text",
    };

    test("renders h2 heading and helper text in p within stack wrapper", () => {
      render(<SubHeaderElement element={mockedSubheaderElement} />);
      const heading = screen.getByRole("heading", {
        name: "SubHeader",
        level: 2,
      });
      expect(heading).toBeVisible();
      expect(heading.parentElement).toHaveClass("chakra-stack");

      const helperText = screen.getByText("mock text");
      expect(helperText).toBeVisible();
      expect(helperText.tagName).toBe("P");
      expect(helperText).toHaveClass("chakra-text");
    });

    test("renders h3 heading and helper text in span with no wrapper", () => {
      const mockedSubheaderElementNoWrapper: PageElement = {
        ...mockedSubheaderElement,
        headingLevel: 3,
        noWrapper: true,
      };
      render(<SubHeaderElement element={mockedSubheaderElementNoWrapper} />);
      const heading = screen.getByRole("heading", {
        name: "SubHeader",
        level: 3,
      });
      expect(heading.parentElement).not.toHaveClass("chakra-stack");

      const helperText = screen.getByText("mock text");
      expect(helperText).toBeVisible();
      expect(helperText.tagName).toBe("SPAN");
      expect(helperText).toHaveClass("chakra-text");
    });

    test("renders HTML helper text in div within stack wrapper", () => {
      const mockedSubheaderElementDivHelper: PageElement = {
        ...mockedSubheaderElement,
        helperText: "<p>mock text</p>",
      };
      render(<SubHeaderElement element={mockedSubheaderElementDivHelper} />);
      const helperTextP = screen.getByText("mock text");
      expect(helperTextP).toBeVisible();
      expect(helperTextP.tagName).toBe("P");
      expect(helperTextP).not.toHaveClass("chakra-text");
      expect(helperTextP.parentElement?.tagName).toBe("DIV");
      expect(helperTextP.parentElement).toHaveClass("chakra-text");
    });

    test("renders HTML helper text in div with no wrapper", () => {
      const mockedSubheaderElementSpanHelper: PageElement = {
        ...mockedSubheaderElement,
        helperText: "<p>mock text</p>",
        noWrapper: true,
      };
      render(<SubHeaderElement element={mockedSubheaderElementSpanHelper} />);
      const helperTextP = screen.getByText("mock text");
      expect(helperTextP).toBeVisible();
      expect(helperTextP.tagName).toBe("P");
      expect(helperTextP).not.toHaveClass("chakra-text");
      expect(helperTextP.parentElement?.tagName).toBe("DIV");
      expect(helperTextP.parentElement).toHaveClass("chakra-text");
    });
  });
});
