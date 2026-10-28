import { Mock, MockedFunction } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { DashboardPage } from "components";
import { RouterWrappedComponent, mockUseStore } from "utils/testing/setupTest";
import { useStore } from "utils";
import { getReportsForState } from "utils/api/requestMethods/report";
import { Report } from "@pasrr/shared";
import { useParams } from "react-router";
import userEvent from "@testing-library/user-event";

window.HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock("utils/state/useStore", () => ({
  useStore: vi.fn().mockReturnValue({}),
}));
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => vi.fn(),
  useParams: vi.fn(() => ({
    reportType: "PASRR",
    state: "CO",
  })),
}));

const mockReportsInDatabase = [
  {
    id: "PASRRCO123",
    type: "PASRR",
    state: "CO",
    lastEdited: new Date("2026-10-24T08:31:54").valueOf(),
    lastEditedBy: "Mock User",
    status: "Not started",
    name: "Mock Report Name",
    budgetPeriod: 1,
    reportingYear: 2025,
    subTypeKey: "A1",
  } as Report,
  {
    id: "PASRRCO1234",
    type: "PASRR",
    state: "CO",
    lastEdited: new Date("2027-10-24T08:31:54").valueOf(),
    lastEditedBy: "Mock User",
    status: "Not started",
    name: "Mock Report 2027",
    budgetPeriod: 2,
    reportingYear: 2026,
    subTypeKey: "A2",
  } as Report,
];

vi.mock("utils/api/requestMethods/report");
const mockGetReportsForState = vi.mocked(getReportsForState);
mockGetReportsForState.mockResolvedValue(mockReportsInDatabase);

vi.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: vi.fn(() => ({
    isDesktop: true,
  })),
}));

const dashboardComponent = (
  <RouterWrappedComponent>
    <DashboardPage />
  </RouterWrappedComponent>
);

describe("DashboardPage with state user", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetReportsForState.mockResolvedValue(mockReportsInDatabase);
  });

  test("should render an empty state when there are no reports", async () => {
    (getReportsForState as Mock).mockResolvedValue([]);

    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    expect(
      screen.getByRole("heading", {
        name: "Colorado PASRR",
      })
    ).toBeVisible();
    expect(
      screen.getByText("once you start a report you can access it here", {
        exact: false,
      })
    ).toBeVisible();
  });

  test("should not call reloadReports if no reportType passed in", async () => {
    (useParams as Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    render(dashboardComponent);
    expect(getReportsForState).toHaveBeenCalledTimes(0);
  });

  test("should render report data", async () => {
    const { container } = render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
      expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    });

    const table = container.querySelector("table")!;
    const columns = [...table.querySelectorAll("tr th")].map(
      (th) => th.textContent!
    );
    const rows = [...table.querySelectorAll("tbody tr")].map((tr) => [
      ...tr.querySelectorAll("td"),
    ]);

    expect(columns.length).toBeGreaterThanOrEqual(4);
    expect(rows.length).toBe(2);

    const cellContent = (columnName: string) => {
      const columnIndex = columns.indexOf(columnName);
      if (columnIndex === -1) throw new Error(`Could not find '${columnName}'`);
      const cell = rows[0][columnIndex];
      return cell.textContent;
    };
    expect(cellContent("Submission name")).toBe("Mock Report Name");
    expect(cellContent("Last edited")).toBe("10/24/2026");
    expect(cellContent("Edited by")).toBe("Mock User");
  });

  test("should list reporting years from reports, newest first", async () => {
    render(dashboardComponent);
    await waitFor(() => {
      expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    });

    const dropdown = screen.getAllByLabelText("Filter by reporting year")[0];
    const options = [...dropdown.querySelectorAll("option[value]")].map(
      (option) => option.textContent
    );
    expect(options).toEqual(["All", "2026", "2025"]);
    expect(dropdown).toHaveValue("All");
    expect(
      screen.queryByLabelText("Filter by Budget Period")
    ).not.toBeInTheDocument();
  });

  test("should be able to filter reports by reporting year", async () => {
    const { container } = render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
      expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    });

    await userEvent.selectOptions(
      screen.getAllByLabelText("Filter by reporting year")[0],
      "2025"
    );

    const table = container.querySelector("table")!;
    const columns = [...table.querySelectorAll("tr th")].map(
      (th) => th.textContent!
    );
    const rows = [...table.querySelectorAll("tbody tr")].map((tr) => [
      ...tr.querySelectorAll("td"),
    ]);

    expect(columns.length).toBeGreaterThanOrEqual(4);
    expect(rows.length).toBe(1);

    const cellContent = (columnName: string) => {
      const columnIndex = columns.indexOf(columnName);
      if (columnIndex === -1) throw new Error(`Could not find '${columnName}'`);
      const cell = rows[0][columnIndex];
      return cell.textContent;
    };
    expect(cellContent("Submission name")).toBe("Mock Report Name");
    expect(cellContent("Last edited")).toBe("10/24/2026");
    expect(cellContent("Edited by")).toBe("Mock User");
    expect(screen.queryByText("Mock Report 2027")).not.toBeInTheDocument();
  });

  test("should reset the reporting year filter to All when cleared", async () => {
    render(dashboardComponent);
    await waitFor(() => {
      expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    });

    const dropdown = screen.getAllByLabelText("Filter by reporting year")[0];
    await userEvent.selectOptions(dropdown, "2026");
    expect(screen.queryByText("Mock Report Name")).not.toBeInTheDocument();
    expect(screen.getByText("Mock Report 2027")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Clear Filter" }));
    expect(dropdown).toHaveValue("All");
    expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    expect(screen.getByText("Mock Report 2027")).toBeInTheDocument();
  });

  test("should be able to open the modal to start new report", async () => {
    (getReportsForState as Mock).mockResolvedValue([]);
    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    const reportModalButton = screen.getByRole("button", {
      name: "Create PASRR Report",
    });
    expect(reportModalButton).toBeEnabled();
    await userEvent.click(reportModalButton);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Create a PASRR Report" })
      ).toBeVisible()
    );
  });

  test("should render the new intro copy", async () => {
    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    const paragraphs = screen.getAllByRole("paragraph");
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);

    expect(paragraphs[0]).toBeVisible();
    expect(paragraphs[0]).toHaveTextContent(
      "Select “Create PASRR Report” to create a new report. Then you can use the dashboard below to edit the report name, fill it out, and monitor its status."
    );
    expect(paragraphs[1]).toBeVisible();
    expect(paragraphs[1]).toHaveTextContent(
      "You can submit one report per year. You'll be able to create your next report at the start of the new year."
    );
  });

  test("should not reference the reporting expectations guide", async () => {
    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    expect(
      screen.queryByText(/PASRR_State Reporting Expectations_Guide/)
    ).not.toBeInTheDocument();
  });

  test("should render the accordion closed by default", async () => {
    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    const accordionButton = screen.getByRole("button", {
      name: "Understanding report statuses",
    });
    expect(accordionButton).toHaveAttribute("aria-expanded", "false");

    const panel = screen.getByRole("region", {
      name: "Understanding report statuses",
      hidden: true,
    });
    expect(panel).not.toBeVisible();
  });

  test("should show statuses, contact note, and email notifications when the accordion is opened", async () => {
    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    const accordionButton = screen.getByRole("button", {
      name: "Understanding report statuses",
    });
    const panel = screen.getByRole("region", {
      name: "Understanding report statuses",
      hidden: true,
    });
    await userEvent.click(accordionButton);
    expect(accordionButton).toHaveAttribute("aria-expanded", "true");

    await waitFor(() => {
      expect(panel).toBeVisible();
    });

    // five statuses
    [
      "Not started:",
      "In progress:",
      "Submitted:",
      "Completed:",
      "In revision:",
    ].forEach((text) => expect(panel).toHaveTextContent(text));
    expect(screen.queryByText("Accepted:")).not.toBeInTheDocument();

    // contact note with mailto link
    expect(screen.getByText(/to have them unlock it/)).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: "PASRR_Institutional_Coverage@cms.hhs.gov",
      })
    ).toHaveAttribute(
      "href",
      "mailto:PASRR_Institutional_Coverage@cms.hhs.gov"
    );

    // email notification section and milestones
    expect(
      screen.getByText(/automatically triggers email notifications/)
    ).toBeVisible();
    expect(screen.getByText("When You Submit a Report:")).toBeVisible();
    expect(
      screen.getByText("When a Report Status is “Unlocked for Revision”:")
    ).toBeVisible();
  });

  test("should not show the old Start PASRR Report button", async () => {
    (getReportsForState as Mock).mockResolvedValue([]);
    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    expect(
      screen.queryByRole("button", { name: "Start PASRR Report" })
    ).not.toBeInTheDocument();
  });
});
