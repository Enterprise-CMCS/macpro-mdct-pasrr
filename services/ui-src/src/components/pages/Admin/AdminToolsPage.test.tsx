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

  test("renders the Admin Tools heading", () => {
    expect(screen.getByRole("heading", { name: "Admin Tools" })).toBeVisible();
  });

  test("banner editor link navigates to /admin/banner-editor", async () => {
    await userEvent.click(screen.getByRole("link", { name: "Banner Editor" }));
    expect(window.location.pathname).toEqual("/admin/banner-editor");
  });

  test("does not show notifications link for non-approver user", () => {
    expect(
      screen.queryByRole("link", { name: "Notifications" }),
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
