import { render, screen } from "@testing-library/react";
import { ElementType, PageElement } from "@pasrr/shared";
import { ParagraphElement, SubHeaderElement } from "../report/Elements";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";

describe("Elements", () => {
  describe("<ParagraphElement />", () => {
    const mockedParagraphElement: PageElement = {
      id: "mock_paragraphId",
      type: ElementType.Paragraph,
      text: "Paragraph",
    };

    const ParagraphWrapper = ({ style }: { style?: string }) => (
      <ChakraProvider theme={theme}>
        <ParagraphElement
          element={{
            ...mockedParagraphElement,
            style,
          }}
        />
      </ChakraProvider>
    );

    test("renders default style", () => {
      render(<ParagraphWrapper style={undefined} />);
      const paragraph = screen.getByText("Paragraph");
      const container = paragraph.closest(".chakra-stack");
      expect(paragraph).toHaveStyle({
        fontSize: "var(--chakra-fontSizes-body_md)",
      });
      expect(paragraph).toHaveStyle({
        fontWeight: "var(--chakra-fontWeights-normal)",
      });
      expect(paragraph).toHaveStyle({ color: "var(--chakra-colors-base)" });
      expect(container).toHaveStyle({ marginBottom: 0 });
    });

    test("renders bold style", () => {
      render(<ParagraphWrapper style="bold" />);
      const paragraph = screen.getByText("Paragraph");
      expect(paragraph).toHaveStyle({
        fontWeight: "var(--chakra-fontWeights-bold)",
      });
    });

    test("renders hint style", () => {
      render(<ParagraphWrapper style="hint" />);
      const paragraph = screen.getByText("Paragraph");
      expect(paragraph).toHaveStyle({
        fontSize: "var(--chakra-fontSizes-body_sm)",
      });
      expect(paragraph).toHaveStyle({
        color: "var(--chakra-colors-gray_dark)",
      });
    });

    test("renders paragraph style", () => {
      render(<ParagraphWrapper style="paragraph" />);
      const paragraph = screen.getByText("Paragraph");
      expect(paragraph).toHaveStyle({
        color: "var(--chakra-colors-gray_dark)",
      });
    });

    test("renders eyebrow style", () => {
      render(<ParagraphWrapper style="eyebrow" />);
      const paragraph = screen.getByText("Paragraph");
      const container = paragraph.closest(".chakra-stack");
      expect(paragraph).toHaveStyle({
        fontWeight: "var(--chakra-fontWeights-bold)",
      });
      expect(paragraph).toHaveStyle({ color: "var(--chakra-colors-gray)" });
      expect(container).toHaveStyle({
        marginBottom: "calc(var(--chakra-space-spacer2) * -1)",
      });
    });
  });

  describe("<SubHeaderElement />", () => {
    const mockedSubheaderElement: PageElement = {
      id: "mock_subHeaderId",
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
