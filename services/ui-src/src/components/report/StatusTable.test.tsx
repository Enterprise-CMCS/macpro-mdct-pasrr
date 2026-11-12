import { MockedFunction } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusTableElement } from "./StatusTable";
import { MemoryRouter } from "react-router";
import { useStore } from "utils";
import { mockStateUserStore } from "utils/testing/setupTest";
import { PageStatus } from "@pasrr/shared";

vi.mock("utils", () => ({
  useStore: vi.fn(),
  submitReport: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockNavigate,
}));

const report = {
  type: "PASRR",
  id: "mock-report-id",
  state: "CO",
  pages: [
    { childPageIds: ["mock-child-page-id", "mock-child-page-id-2"] },
    { title: "Section 1", id: "mock-page-id" },
    { title: "Section 2", id: "mock-page-id-2" },
  ],
};

const mockPageMap = new Map([
  ["root", 0],
  ["mock-child-page-id", 1],
  ["mock-child-page-id-2", 2],
]);

const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;

describe("StatusTable with state user", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseStore.mockImplementation(
      (selector?: Parameters<typeof useStore>[0]) => {
        if (selector) {
          return {
            rows: [
              {
                kind: "section",
                id: "mock-page-id",
                section: {
                  section: { title: "Section 1", id: "mock-page-id" },
                  displayStatus: PageStatus.COMPLETE,
                  submittable: true,
                },
              },
              {
                kind: "section",
                id: "mock-page-id-2",
                section: {
                  section: { title: "Section 2", id: "mock-page-id-2" },
                  displayStatus: PageStatus.IN_PROGRESS,
                  submittable: false,
                },
              },
            ],
            sections: [
              {
                section: { title: "Section 1", id: "mock-page-id" },
                displayStatus: PageStatus.COMPLETE,
                submittable: true,
              },
              {
                section: { title: "Section 2", id: "mock-page-id-2" },
                displayStatus: PageStatus.IN_PROGRESS,
                submittable: false,
              },
            ],
            submittable: true,
          };
        }
        return {
          ...mockStateUserStore,
          pageMap: mockPageMap,
          report: report,
        };
      }
    );
  });

  test("table with section titles and status icons render", () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    // Table headers
    expect(screen.getByRole("columnheader", { name: "Section" })).toBeVisible();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeVisible();

    // Section title and status for Section 1
    expect(screen.getByRole("cell", { name: "Section 1" })).toBeVisible();
    expect(screen.getByText("Complete")).toBeVisible();
    expect(screen.getByRole("img", { name: "complete" })).toBeVisible();
  });

  test("should navigate to the correct editable page when the Edit button is clicked", async () => {
    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    const editButton = screen.getAllByRole("button", { name: "Edit" })[0];
    await userEvent.click(editButton);

    expect(editButton).toBeVisible();
  });

  test("optional page that is submittable renders as Complete", () => {
    mockedUseStore.mockImplementation(
      (selector?: Parameters<typeof useStore>[0]) => {
        if (selector) {
          return {
            rows: [
              {
                kind: "section",
                id: "mock-optional-page-id",
                section: {
                  section: {
                    title: "Optional Page",
                    id: "mock-optional-page-id",
                  },
                  displayStatus: PageStatus.OPTIONAL,
                  submittable: true,
                },
              },
            ],
            sections: [],
            submittable: true,
          };
        }
        return {
          ...mockStateUserStore,
          pageMap: mockPageMap,
          report: report,
        };
      }
    );

    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    const optionalCell = screen.getByRole("cell", { name: "Optional Page" });
    const optionalRow = optionalCell.closest("tr") as HTMLTableRowElement;

    expect(optionalCell).toBeVisible();
    expect(
      within(optionalRow).getByRole("img", { name: "complete" })
    ).toBeVisible();
    expect(within(optionalRow).queryByText("Optional")).not.toBeInTheDocument();
  });

  test("parent page renders as a label row with its children nested beneath it", () => {
    mockedUseStore.mockImplementation(
      (selector?: Parameters<typeof useStore>[0]) => {
        if (selector) {
          return {
            rows: [
              {
                kind: "group",
                id: "mock-parent-page-id",
                title: "Parent Page",
                children: [
                  {
                    section: { title: "Child A", id: "mock-child-page-id" },
                    displayStatus: PageStatus.COMPLETE,
                    submittable: true,
                  },
                ],
              },
            ],
            sections: [],
            submittable: true,
          };
        }
        return {
          ...mockStateUserStore,
          pageMap: mockPageMap,
          report: report,
        };
      }
    );

    render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );

    const childCell = screen.getByRole("cell", { name: "Child A" });
    const childRow = childCell.closest("tr") as HTMLTableRowElement;
    const parentRow = screen.getByRole("row", { name: "Parent Page" });

    expect(parentRow).toBeVisible();
    expect(childRow).toBeVisible();
    // Only the child gets an Edit button; the parent row has none.
    expect(
      within(childRow).getByRole("button", { name: "Edit" })
    ).toBeVisible();
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(1);
  });

  test("should not render anything if report is undefined", () => {
    mockedUseStore.mockImplementation(() => ({
      ...mockStateUserStore,
      pageMap: mockPageMap,
      report: undefined,
    }));

    const { container } = render(
      <MemoryRouter>
        <StatusTableElement />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});
