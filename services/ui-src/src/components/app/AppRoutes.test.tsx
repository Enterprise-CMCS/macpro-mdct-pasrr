import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AppRoutes } from "./AppRoutes";
import { useStore } from "utils";
import {
  mockAdminUserStore,
  mockStateUserStore,
} from "utils/testing/setupTest";

vi.mock("utils/state/useStore");
const mockedUseStore = vi.mocked(useStore);

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({}),
}));

vi.mock("components", async (importOriginal) => ({
  ...(await importOriginal()),
  AdminToolsPage: () => <h1>Admin tools page</h1>,
  AdminPage: () => <h1>Banner editor page</h1>,
  ProfilePage: () => <h1>Profile page</h1>,
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );

describe("<AppRoutes /> admin routes", () => {
  describe.each([
    ["/admin", "Admin tools page"],
    ["/admin/banner-editor", "Banner editor page"],
  ])("%s", (path, pageHeading) => {
    test("renders the page for admin users", () => {
      mockedUseStore.mockReturnValue(mockAdminUserStore);
      renderAt(path);
      expect(screen.getByRole("heading", { name: pageHeading })).toBeVisible();
    });

    test("redirects non-admin users to the profile page", () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      renderAt(path);
      expect(
        screen.getByRole("heading", { name: "Profile page" })
      ).toBeVisible();
    });
  });
});
