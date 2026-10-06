import { PasrrIntroductionCard } from "./PasrrIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

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

  testA11yAct(component);
});
