import { PasrrIntroductionCard } from "./PasrrIntroductionCard";
import { render, screen, within } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/setupTest";
import { PASRR_OVERVIEW_URL, externalLinkAltText } from "../../constants";

const component = (
  <RouterWrappedComponent>
    <PasrrIntroductionCard />
  </RouterWrappedComponent>
);

describe("<PasrrIntroductionCard />", () => {
  test("renders card content", () => {
    render(component);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "PASRR Report",
      })
    ).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "Enter PASRR report",
      })
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "User Guide and Help File",
      })
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: "When is the PASRR report due?",
      })
    ).toBeVisible();
  });

  test("PASRR overview link opens in a new tab with an external icon", () => {
    render(component);
    const overviewLink = screen.getByRole("link", {
      name: `Preadmission Screening and Resident Review (PASRR) ${externalLinkAltText}`,
    });

    expect(overviewLink).toHaveAttribute("href", PASRR_OVERVIEW_URL);
    expect(overviewLink).toHaveAttribute("target", "_blank");
    expect(
      within(overviewLink).getByRole("img", { name: externalLinkAltText })
    ).toBeVisible();
  });

  testA11yAct(component);
});
