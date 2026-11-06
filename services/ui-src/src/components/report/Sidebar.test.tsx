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
  ["id-1", 1],
  ["id-2", 2],
  ["child-1", 3],
]);

const report = {
  pages: [
    { childPageIds: ["id-1", "id-2"], id: "root" },
    { title: "Section 1", id: "id-1", childPageIds: ["child-1"] },
    { title: "Section 2", id: "id-2" },
    { title: "Child 1", id: "child-1" },
  ],
};

describe("Sidebar", () => {
  beforeEach(() => {
    (useStore as unknown as Mock).mockReturnValue({
      pageMap: mockPageMap,
      report,
      currentPageId: "id-1",
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
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
  });

  test("should attempt to navigate on Click", async () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    const link = screen.getByText("Section 2");
    await userEvent.click(link);
    const reportPath = "/report/exampleReport/exampleState/123/id-2";
    expect(mockUseNavigate).toHaveBeenCalledWith(reportPath);
  });

  test("should toggle, not navigate, when clicking a parent section", async () => {
    mockUseNavigate.mockClear();
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    const parent = screen.getByRole("button", { name: /Section 1/ });
    expect(parent).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();

    await userEvent.click(parent);

    expect(mockUseNavigate).not.toHaveBeenCalled();
    expect(parent).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });

  test("should expand a parent section without navigating when its arrow is clicked", async () => {
    mockUseNavigate.mockClear();
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();

    await userEvent.click(screen.getByAltText("Expand subitems"));

    expect(mockUseNavigate).not.toHaveBeenCalled();
    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });

  test("toggle button exposes its state via aria-expanded", () => {
    for (const sidebarOpen of [true, false]) {
      (useStore as unknown as Mock).mockReturnValue({
        pageMap: mockPageMap,
        report,
        currentPageId: "id-1",
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
    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();

    await userEvent.click(expandButton);

    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });
});
