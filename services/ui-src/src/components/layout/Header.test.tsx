import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  mockAdminUserStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTest";
import { Header } from "components";
import { useBreakpoint, useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

vi.mock("utils/state/useStore");
const mockedUseStore = vi.mocked(useStore);
mockedUseStore.mockReturnValue(mockStateUserStore);

vi.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: vi.fn(() => ({ isMobile: false })),
}));
const mockedUseBreakpoint = vi.mocked(useBreakpoint);

const mockLogout = vi.fn();

const headerComponent = (
  <RouterWrappedComponent>
    <Header handleLogout={mockLogout} />
  </RouterWrappedComponent>
);

describe("<Header />", () => {
  describe("Test Visibility of Header", () => {
    beforeEach(() => {
      render(headerComponent);
    });

    test("Logo, Help and Menu is visible on Header", () => {
      const header = screen.getByRole("navigation");
      expect(header).toBeVisible();
      // find img elements
      expect(screen.getByRole("img", { name: "PASRR logo" })).toBeVisible();
      expect(screen.getByRole("img", { name: "Help" })).toBeVisible();
      expect(screen.getByRole("img", { name: "Account" })).toBeVisible();
      expect(screen.getByAltText("Arrow down")).toBeVisible();
    });

    test("When My Account menu is clicked, it expands", async () => {
      // Find button
      const menuButton = screen.getByRole("button", {
        name: "my account",
        expanded: false,
      });
      expect(menuButton).toBeInTheDocument();
      // Click and expand
      await userEvent.click(menuButton);

      expect(
        screen.getByRole("button", { name: "my account", expanded: true })
      ).toBeInTheDocument();
    });

    test("Logs out user", async () => {
      // Find button
      const menuButton = screen.getByRole("button", { name: "my account" });
      await userEvent.click(menuButton);

      // Click and expand
      const logoutButton = screen.getByAltText("Logout");
      expect(logoutButton).toBeInTheDocument();
      await userEvent.click(logoutButton);

      // Mock logout
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("Admin link", () => {
    afterEach(() => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockedUseBreakpoint.mockReturnValue({ isMobile: false } as ReturnType<
        typeof useBreakpoint
      >);
    });

    test("is not rendered for non-admin users", () => {
      render(headerComponent);
      expect(
        screen.queryByRole("link", { name: "Admin" })
      ).not.toBeInTheDocument();
    });

    test("shows its text on desktop", () => {
      mockedUseStore.mockReturnValue(mockAdminUserStore);
      mockedUseBreakpoint.mockReturnValue({ isMobile: false } as ReturnType<
        typeof useBreakpoint
      >);
      render(headerComponent);

      const adminLink = screen.getByRole("link", { name: "Admin" });
      expect(adminLink).toHaveAttribute("href", "/admin");
      expect(adminLink).toHaveTextContent("Admin");
    });

    test("keeps an accessible name on mobile when its text is hidden", () => {
      mockedUseStore.mockReturnValue(mockAdminUserStore);
      mockedUseBreakpoint.mockReturnValue({ isMobile: true } as ReturnType<
        typeof useBreakpoint
      >);
      render(headerComponent);

      const adminLink = screen.getByRole("link", { name: "Admin" });
      expect(adminLink).toHaveAttribute("href", "/admin");
      expect(adminLink).not.toHaveTextContent("Admin");
    });
  });

  testA11y(headerComponent);
});
