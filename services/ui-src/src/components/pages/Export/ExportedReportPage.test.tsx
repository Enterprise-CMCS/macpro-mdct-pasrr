import { MockedFunction } from "vitest";
import { screen, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useStore } from "utils";
import { ExportedReportPage } from "./ExportedReportPage";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;

const report = {
  type: "PASRR",
  id: "mock-report-id",
  state: "PA",
  name: "mock-title",
  pages: [
    { childPageIds: ["1", "2"] },
    { title: "Section 1", id: "mock-page-id-1" },
    { title: "Section 2", id: "mock-page-id-2" },
    { title: "Review & Submit", id: "review-submit" },
  ],
  lastEdited: 1751987780396,
  lastEditedBy: "last edited",
  status: "In progress",
};

describe("ExportedReportPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStore.mockReturnValue({
      report: report,
    });
  });
  test("ExportReportPage is visible", () => {
    render(
      <MemoryRouter>
        <ExportedReportPage></ExportedReportPage>
      </MemoryRouter>
    );
    expect(
      screen.getByText("Pennsylvania PASRR for: mock-title")
    ).toBeInTheDocument();
  });

  test("Should not render filtered sections", () => {
    render(
      <MemoryRouter>
        <ExportedReportPage></ExportedReportPage>
      </MemoryRouter>
    );
    expect(screen.queryByText("Section 4")).not.toBeInTheDocument();
  });
});
