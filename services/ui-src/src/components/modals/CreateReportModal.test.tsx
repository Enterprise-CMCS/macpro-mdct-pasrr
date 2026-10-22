import { MockedFunction } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateReportModal } from "components";
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTest";
import { useStore } from "utils";
import { ReportType } from "@pasrr/shared";
import { testA11yAct } from "utils/testing/commonTests";

const mockCloseHandler = vi.fn();
const mockReportHandler = vi.fn();
const mockCreateReport = vi.fn();
const mockUpdateReport = vi.fn();
const mockGetReportsForState = vi.fn();

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  devDate: "2026-10-15",
});

vi.mock("utils/api/requestMethods/report", () => ({
  updateReport: () => mockUpdateReport(),
  createReport: () => mockCreateReport(),
  getReportsForState: () => mockGetReportsForState(),
}));

const addModalComponent = (
  <RouterWrappedComponent>
    <CreateReportModal
      activeState="AB"
      reportType={ReportType.PASRR}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      reportHandler={mockReportHandler}
    />
  </RouterWrappedComponent>
);

describe("Test general modal functionality", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(addModalComponent);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Modal top close button can be clicked", async () => {
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Modal bottom cancel button can be clicked", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test Add Report Modal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(addModalComponent);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Add Report Modal shows proper add contents", async () => {
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Create a PASRR Report" })
      ).toBeVisible()
    );
    expect(screen.getByRole("button", { name: "Create" })).toBeVisible();
  });

  test("Add Report Modal shows previous year hint and no dropdown", async () => {
    const previousYear = 2025;
    await waitFor(() =>
      expect(
        screen.getByText(
          `You’re creating the annual PASRR report for reporting year ${previousYear}. The reporting year covers all data collected from January 1 to December 31, ${previousYear}. This action cannot be undone.`
        )
      ).toBeVisible()
    );
  });

  testA11yAct(addModalComponent);
});

describe("Test dev tools date", () => {
  afterEach(() => {
    vi.clearAllMocks();
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      devDate: "2026-10-15",
    });
  });

  test("Hint uses previous year when dev date is an epoch-ms string", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      devDate: "1822276800000", // 9/30/2027, as set by dev tools
    });
    await act(async () => {
      await render(addModalComponent);
    });
    expect(
      screen.getByText(
        "You’re creating the annual PASRR report for reporting year 2026. The reporting year covers all data collected from January 1 to December 31, 2026. This action cannot be undone."
      )
    ).toBeVisible();
  });
});

describe("Test submit", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  test("Simulate submitting modal", async () => {
    await act(async () => {
      await render(addModalComponent);
    });
    const submitBtn = screen.getByRole("button", { name: "Create" });
    await userEvent.click(submitBtn);

    expect(mockReportHandler).toHaveBeenCalled();
    expect(mockCreateReport).toHaveBeenCalled();
  });
});

describe("Test CreateReportModal types", () => {
  test.each([{ type: ReportType.PASRR, text: "PASRR Report" }])(
    "$type report type renders a title",
    async ({ type, text }) => {
      render(
        <RouterWrappedComponent>
          <CreateReportModal
            activeState="AB"
            reportType={type}
            modalDisclosure={{
              isOpen: true,
              onClose: mockCloseHandler,
            }}
            reportHandler={mockReportHandler}
          />
        </RouterWrappedComponent>
      );
      await waitFor(() =>
        expect(
          screen.getByRole("heading", { name: `Create a ${text}` })
        ).toBeVisible()
      );
    }
  );
});
