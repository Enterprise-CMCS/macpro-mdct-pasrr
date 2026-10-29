import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExternalLink } from "./ExternalLink";
import {
  externalLinkAltText,
  VISITED_LINKS_STORAGE_KEY,
} from "../../constants";

describe("<ExternalLink />", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("renders", () => {
    render(<ExternalLink href="https://cms.gov/">This is a link</ExternalLink>);
    const link = screen.getByRole("link", {
      name: `This is a link ${externalLinkAltText}`,
    });
    expect(link).toHaveProperty("href", "https://cms.gov/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(
      within(link).getByRole("img", { name: externalLinkAltText }),
    ).toBeVisible();
  });

  test("marks the link visited for this browser session only", async () => {
    render(<ExternalLink href="https://cms.gov/">This is a link</ExternalLink>);
    const link = screen.getByRole("link", {
      name: `This is a link ${externalLinkAltText}`,
    });
    expect(link).not.toHaveClass("is-session-visited");

    link.addEventListener("click", (event) => event.preventDefault());
    await userEvent.click(link);

    expect(link).toHaveClass("is-session-visited");
    expect(sessionStorage.getItem(VISITED_LINKS_STORAGE_KEY)).toContain(
      "https://cms.gov/",
    );
  });
});
