import { ReportType } from "@pasrr/shared";
import { ReportIntroCardActions } from "./ReportIntroCardActions";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (reportType = ReportType.PASRR) => (
  <RouterWrappedComponent>
    <ReportIntroCardActions reportType={reportType} />
  </RouterWrappedComponent>
);

describe("<ReportIntroCardActions />", () => {
  describe("reportType: PASRR", () => {
    test("renders enter and download buttons", () => {
      render(component(ReportType.PASRR));
      const enterButton = screen.getByRole("link", {
        name: "Enter PASRR report",
      });
      const styles = getComputedStyle(
        enterButton.parentElement as HTMLDivElement
      );
      expect(enterButton).toBeVisible();
      expect(styles.justifyContent).toBe("space-between");
      expect(
        screen.getByRole("button", {
          name: "User Guide and Help File",
        })
      ).toBeVisible();
    });
  });

  describe("reportType: unknown", () => {
    test("renders enter button only", () => {
      render(component("unknown" as ReportType));
      const enterButton = screen.getByRole("link", {
        name: "Enter report",
      });
      const styles = getComputedStyle(
        enterButton.parentElement as HTMLDivElement
      );
      expect(enterButton).toBeVisible();
      expect(styles.justifyContent).toBe("end");
      expect(
        screen.queryByRole("button", {
          name: "User Guide and Help File",
        })
      ).not.toBeInTheDocument();
    });
  });

  testA11yAct(component());
});
