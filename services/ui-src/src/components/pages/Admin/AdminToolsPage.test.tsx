import { MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminToolsPage } from "components";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";
import {
  mockAdminUserStore,
  mockApproverUserStore,
} from "utils/testing/setupTest";

vi.mock("utils/state/useStore");
vi.mock("utils/api/requestMethods/report", () => ({
  getReportByType: vi.fn().mockResolvedValue([]),
  createReport: vi.fn(),
}));
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;

const adminToolsComponent = (
  <RouterWrappedComponent>
    <AdminToolsPage />
  </RouterWrappedComponent>
);

describe("<AdminToolsPage />", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockAdminUserStore);
    render(adminToolsComponent);
  });

  test("renders the Admin tools heading", () => {
    expect(screen.getByRole("heading", { name: "Admin tools" })).toBeVisible();
  });

  test("renders the banner editor description", () => {
    expect(
      screen.getByText(
        "Create and edit announcement banners to display on state report dashboards."
      )
    ).toBeVisible();
  });

  test("banner editor link navigates to /admin/banner-editor", async () => {
    await userEvent.click(screen.getByRole("link", { name: "Banner editor" }));
    expect(window.location.pathname).toBe("/admin/banner-editor");
  });

  test("opens and closes the create report modal", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "Create a report" })
    );
    expect(screen.getAllByText("Reporting year").length).toBeGreaterThan(0);
    expect(screen.getAllByText("State or territory").length).toBeGreaterThan(0);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("Reporting year")).not.toBeInTheDocument();
  });

  test("does not show notifications link for non-approver user", () => {
    expect(
      screen.queryByRole("link", { name: "Notifications" })
    ).not.toBeInTheDocument();
  });

  testA11yAct(adminToolsComponent);
});

describe("<AdminToolsPage /> for approver users", () => {
  test("shows notifications link for approver user", () => {
    mockedUseStore.mockReturnValue(mockApproverUserStore);
    render(adminToolsComponent);
    expect(screen.getByRole("link", { name: "Notifications" })).toBeVisible();
  });
});
