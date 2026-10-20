import { HomePage } from "./HomePage";
import { MockedFunction } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import { mockReport, mockReport2 } from "utils/testing/mockForm";
import {
  mockAdminUserStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTest";
import { BannerAreas, BannerShape } from "@pasrr/shared";

vi.mock("utils/auth/authLifecycle", () => ({
  updateTimeout: vi.fn(),
}));

const mockGetReport = vi.fn().mockResolvedValue([mockReport, mockReport2]);
vi.mock("../../utils/api/requestMethods/report", () => ({
  getReportByType: () => mockGetReport(),
  createReport: vi.fn(),
}));

vi.mock("../../utils/api/requestMethods/notificationRecipients", () => ({
  getAssignedStatesByEmail: vi.fn().mockResolvedValue([]),
}));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;

const component = (
  <RouterWrappedComponent>
    <HomePage />
  </RouterWrappedComponent>
);

describe("<HomePage />", () => {
  describe("state user", () => {
    test("renders state user dashboard", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      await act(async () => {
        render(component);
      });
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "PASRR Report",
        })
      ).toBeVisible();
      expect(
        screen.getByRole("link", {
          name: "Enter PASRR report",
        })
      ).toBeVisible();
      expect(
        screen.getByRole("button", {
          name: "User Guide and Help File",
        })
      ).toBeVisible();
      expect(
        screen.getByRole("button", {
          name: "When is the PASRR report due?",
        })
      ).toBeVisible();
    });

    test("renders banner", async () => {
      const mockBannerPasrr = {
        title: "PASRR Alert",
        area: BannerAreas.PASRR,
        description: "mock description",
        link: "https://example.com/pasrr-alert",
        startDate: "2026-03-01",
        endDate: "2026-03-05",
        key: "a8618482-5f61-4bfc-91ba-9f1d25609986", // #gitleaks:allow
      } as BannerShape;

      mockedUseStore.mockReturnValue(mockBannerPasrr);
      await act(async () => {
        render(component);
      });
      const banner = screen.getByRole("alert");
      expect(banner).toBeVisible();
      expect(banner).toHaveTextContent("PASRR Alert");
      expect(banner).toHaveTextContent("mock description");
      expect(banner).toHaveTextContent("https://example.com/pasrr-alert");
    });
  });

  describe("admin user", () => {
    test("renders admin user dashboard", async () => {
      mockedUseStore.mockReturnValue(mockAdminUserStore);
      await act(async () => {
        render(component);
      });
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "PASRR Admin Dashboard",
        })
      ).toBeVisible();
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "State Submissions",
        })
      ).toBeVisible();
      expect(
        screen.getByRole("button", {
          name: "Admin Instructions",
        })
      ).toBeVisible();
      expect(
        screen.getByRole("button", {
          name: "States select",
        })
      ).toBeVisible();
    });
  });

  testA11yAct(component);
});
