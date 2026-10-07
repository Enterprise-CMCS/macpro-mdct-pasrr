import { ReportIntroCardActions } from "./ReportIntroCardActions";
import { MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTest";
import { ReportType } from "@pasrr/shared";

const mockUseNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
}));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockStateUserStore);

const component = (reportType = ReportType.PASRR) => (
  <RouterWrappedComponent>
    <ReportIntroCardActions reportType={reportType} />
  </RouterWrappedComponent>
);

describe("<ReportIntroCardActions />", () => {
  describe("reportType: PASRR", () => {
    test("renders enter and download buttons", async () => {
      render(component(ReportType.PASRR));
      const enterButton = screen.getByRole("link", {
        name: "Enter PASRR report",
      });
      const styles = getComputedStyle(
        enterButton.parentElement as HTMLDivElement
      );
      expect(styles.justifyContent).toBe("space-between");
      await userEvent.click(enterButton);
      expect(mockUseNavigate).toHaveBeenCalledTimes(1);
      expect(mockUseNavigate).toHaveBeenCalledWith("/report/PASRR/MN");

      const downloadButton = screen.getByRole("button", {
        name: "User Guide and Help File",
      });
      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
      await userEvent.click(downloadButton);
      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith("TODO");
      alertSpy.mockRestore();
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

      const downloadButton = screen.queryByRole("button", {
        name: "User Guide and Help File",
      });
      expect(downloadButton).not.toBeInTheDocument();
    });
  });

  testA11yAct(component());
});
