import { mockUseStore } from "utils/testing/setupTest";
import {
  activeBannerSelector,
  currentPageSelector,
  GroupRow,
  submittableMetricsSelector,
} from "./selectors";
import {
  BannerAreas,
  BannerShape,
  ElementType,
  PageStatus,
  PageType,
} from "@pasrr/shared";
import { useStore } from "./useStore";
import { ReportState } from "types";

vi.mock("utils/auth/authLifecycle", () => ({
  updateTimeout: vi.fn(),
}));

describe("Selectors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getCurrentPage should return the current page object", async () => {
    const page = currentPageSelector(mockUseStore);

    expect(page?.id).toEqual(mockUseStore.currentPageId);
  });

  test("submittableMetricsSelector should return the readiness of the report", async () => {
    const result = submittableMetricsSelector(mockUseStore);
    expect(result?.sections[0]?.submittable).toEqual(true);
    expect(result?.sections[0]?.displayStatus).toEqual(PageStatus.COMPLETE);
    expect(result?.submittable).toEqual(true);
  });

  test("submittableMetricsSelector reports child pages of a parent page", async () => {
    const stateWithParent = (secondChildAnswer: string) =>
      ({
        pageMap: new Map([
          ["root", 0],
          ["mock-parent-page-id", 1],
          ["mock-child-page-id", 2],
          ["mock-child-page-id-2", 3],
        ]),
        report: {
          pages: [
            {
              id: "root",
              childPageIds: ["mock-parent-page-id", "review-submit"],
            },
            {
              id: "mock-parent-page-id",
              childPageIds: ["mock-child-page-id", "mock-child-page-id-2"],
            },
            {
              id: "mock-child-page-id",
              type: PageType.Standard,
              title: "child 1",
              elements: [
                {
                  id: "mock_childTextboxId",
                  label: "textbox",
                  type: ElementType.Textbox,
                  required: true,
                  answer: "test",
                },
              ],
            },
            {
              id: "mock-child-page-id-2",
              type: PageType.Standard,
              title: "child 2",
              elements: [
                {
                  id: "mock_child2TextboxId",
                  label: "textbox",
                  type: ElementType.Textbox,
                  required: true,
                  answer: secondChildAnswer,
                },
              ],
            },
          ],
        },
      }) as ReportState;

    const complete = submittableMetricsSelector(stateWithParent("test"));
    expect(complete?.sections.map((s) => s?.section.id)).toEqual([
      "mock-child-page-id",
      "mock-child-page-id-2",
    ]);
    expect(complete?.rows).toHaveLength(1);
    const groupRow = complete?.rows[0] as GroupRow;
    expect(groupRow).toMatchObject({
      id: "mock-parent-page-id",
    });
    expect(groupRow.children.map((c) => c?.section.id)).toEqual([
      "mock-child-page-id",
      "mock-child-page-id-2",
    ]);
    expect(complete?.submittable).toBe(true);

    const incomplete = submittableMetricsSelector(stateWithParent(""));
    expect(incomplete?.submittable).toBe(false);
  });

  describe("activeBannerSelector", () => {
    const daysAfterNow = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().slice(0, 10);
    };

    it("should return the active banner for the given area", () => {
      const past = {
        area: BannerAreas.Home,
        startDate: daysAfterNow(-5),
        endDate: daysAfterNow(-2),
      } as BannerShape;
      const present = {
        area: BannerAreas.Home,
        startDate: daysAfterNow(-2),
        endDate: daysAfterNow(5),
      } as BannerShape;
      const future = {
        area: BannerAreas.Home,
        startDate: daysAfterNow(5),
        endDate: daysAfterNow(12),
      } as BannerShape;
      const elsewhere = {
        area: BannerAreas.PASRR,
        startDate: daysAfterNow(-2),
        endDate: daysAfterNow(5),
      } as BannerShape;
      useStore.setState({ allBanners: [past, present, future, elsewhere] });

      const selector = activeBannerSelector(BannerAreas.Home);
      const banner = selector(useStore.getState());

      expect(banner).toBe(present);
    });

    it("should return undefined if there is no active banner for the given area", () => {
      const past = {
        area: BannerAreas.Home,
        startDate: daysAfterNow(-5),
        endDate: daysAfterNow(-2),
      } as BannerShape;
      const future = {
        area: BannerAreas.Home,
        startDate: daysAfterNow(5),
        endDate: daysAfterNow(12),
      } as BannerShape;
      const elsewhere = {
        area: BannerAreas.PASRR,
        startDate: daysAfterNow(-2),
        endDate: daysAfterNow(5),
      } as BannerShape;
      useStore.setState({ allBanners: [past, future, elsewhere] });

      const selector = activeBannerSelector(BannerAreas.Home);
      const banner = selector(useStore.getState());

      expect(banner).toBeUndefined();
    });

    it("should kick off a fetch if the data is old", () => {
      const mockFetch = vi.fn();
      useStore.setState({
        allBanners: [],
        _lastFetchTime: 0,
        fetchBanners: mockFetch,
      });

      const selector = activeBannerSelector(BannerAreas.Home);
      const _banners = selector(useStore.getState());

      expect(mockFetch).toHaveBeenCalled();
    });

    it("should NOT kick off a fetch if the data is new", () => {
      const mockFetch = vi.fn();
      useStore.setState({
        allBanners: [],
        _lastFetchTime: Date.now(),
        fetchBanners: mockFetch,
      });

      const selector = activeBannerSelector(BannerAreas.Home);
      const _banners = selector(useStore.getState());

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
