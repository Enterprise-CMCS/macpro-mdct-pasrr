import { PasrrIntroductionCard } from "./PasrrIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <PasrrIntroductionCard />
  </RouterWrappedComponent>
);

describe("PasrrIntroductionCard", () => {
  test("should render", () => {
    render(component);
    expect(
      screen.getByText("When is the PASRR Report Due?", {
        exact: false,
      })
    ).toBeVisible();
  });

  testA11yAct(component);
});
