import { Mock, MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUseStore } from "utils/testing/setupTest";
import { BrowserRouter as Router, useParams } from "react-router";
import { Sidebar } from "./Sidebar";
import { useStore } from "utils";

vi.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: vi.fn(() => ({
    isDesktop: true,
  })),
}));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockUseNavigate,
  useParams: vi.fn(),
}));

const setCurrentPageId = vi.fn();
const mockUseNavigate = vi.fn();

const mockPageMap = new Map([
  ["root", 0],
  ["mock-page-id", 1],
  ["mock-page-id-2", 2],
  ["mock-child-page-id", 3],
]);

const report = {
  pages: [
    { childPageIds: ["mock-page-id", "mock-page-id-2"], id: "root" },
    {
      title: "Section 1",
      id: "mock-page-id",
      childPageIds: ["mock-child-page-id"],
    },
    { title: "Section 2", id: "mock-page-id-2" },
    { title: "Child 1", id: "mock-child-page-id" },
  ],
};

describe("Sidebar", () => {
  beforeEach(() => {
    (useStore as unknown as Mock).mockReturnValue({
      pageMap: mockPageMap,
      report,
      currentPageId: "mock-page-id",
      setCurrentPageId,
    });
    (useParams as Mock).mockReturnValue({
      reportType: "exampleReport",
      state: "exampleState",
      reportId: "123",
    });
  });
  test("should not render if missing details from the store", () => {
    (useStore as unknown as Mock).mockReturnValueOnce({
      pageMap: undefined,
      report: undefined,
      currentPageId: undefined,
      setCurrentPageId,
    });

    const { container } = render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("should render section headers", () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(
      screen.getByRole("button", { name: "Section 1 Expand subitems" })
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Section 2" })).toBeVisible();
  });

  test("should attempt to navigate on Click", async () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    const link = screen.getByRole("link", { name: "Section 2" });
    await userEvent.click(link);
    const reportPath = "/report/exampleReport/exampleState/123/mock-page-id-2";
    expect(mockUseNavigate).toHaveBeenCalledWith(reportPath);
  });

  test("should toggle, not navigate, when clicking a parent section", async () => {
    mockUseNavigate.mockClear();
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    const parent = screen.getByRole("button", {
      name: "Section 1 Expand subitems",
    });
    expect(parent).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("link", { name: "Child 1" })
    ).not.toBeInTheDocument();

    await userEvent.click(parent);

    expect(mockUseNavigate).not.toHaveBeenCalled();
    expect(parent).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Child 1" })).toBeVisible();
  });

  test("should expand a parent section without navigating when its arrow is clicked", async () => {
    mockUseNavigate.mockClear();
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(
      screen.queryByRole("link", { name: "Child 1" })
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByAltText("Expand subitems"));

    expect(mockUseNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Child 1" })).toBeVisible();
  });

  test("toggle button exposes its state via aria-expanded", () => {
    for (const sidebarOpen of [true, false]) {
      (useStore as unknown as Mock).mockReturnValue({
        pageMap: mockPageMap,
        report,
        currentPageId: "mock-page-id",
        setCurrentPageId,
        setSidebar: vi.fn(),
        sidebarOpen,
      });
      const { unmount } = render(
        <Router>
          <Sidebar />
        </Router>
      );
      const button = screen.getByRole("button", { name: "Sidebar" });
      expect(button).toHaveAttribute("aria-expanded", String(sidebarOpen));
      unmount();
    }
  });

  test("should expand on Click", async () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );

    const expandButton = screen.getByAltText("Expand subitems");
    expect(
      screen.queryByRole("link", { name: "Child 1" })
    ).not.toBeInTheDocument();

    await userEvent.click(expandButton);

    expect(screen.getByRole("link", { name: "Child 1" })).toBeVisible();
  });

  describe("Subpage", () => {
    beforeEach(() => {
      (useStore as unknown as Mock).mockReturnValue({
        pageMap: mockPageMap,
        report,
        currentPageId: "mock-child-page-id",
        setCurrentPageId,
      });
    });

    test("auto-expands the parent and highlights the subpage", () => {
      render(
        <Router>
          <Sidebar />
        </Router>
      );
      expect(screen.getByAltText("Collapse subitems")).toBeVisible();
      expect(screen.getByRole("link", { name: "Child 1" })).toHaveClass(
        "selected"
      );
    });

    test("clicking the arrow collapses the parent, and again reopens it", async () => {
      render(
        <Router>
          <Sidebar />
        </Router>
      );
      await userEvent.click(screen.getByAltText("Collapse subitems"));
      expect(
        screen.queryByRole("link", { name: "Child 1" })
      ).not.toBeInTheDocument();

      await userEvent.click(screen.getByAltText("Expand subitems"));
      expect(screen.getByRole("link", { name: "Child 1" })).toBeVisible();
    });
  });
});
