import { mockUseStore } from "utils/testing/setupTest";
import {
  activeBannerSelector,
  currentPageSelector,
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
    const stateWithParent = (secondChildAnswer: string) => ({
      ...mockUseStore,
      pageMap: new Map([
        ["root", 0],
        ["mock-parent-page-id", 1],
        ["mock-child-page-id", 2],
        ["mock-child-page-id-2", 3],
      ]),
      report: {
        ...mockUseStore.report!,
        pages: [
          {
            id: "root",
            childPageIds: ["mock-parent-page-id", "review-submit"],
          },
          {
            id: "mock-parent-page-id",
            elements: [],
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
    });

    const complete = submittableMetricsSelector(stateWithParent("test") as any);
    expect(complete?.sections.map((s) => s?.section.id)).toEqual([
      "mock-child-page-id",
      "mock-child-page-id-2",
    ]);
    expect(complete?.rows).toHaveLength(1);
    expect(complete?.rows[0]).toMatchObject({
      kind: "group",
      id: "mock-parent-page-id",
    });
    expect(
      complete?.rows[0].kind === "group" &&
        complete.rows[0].children.map((c) => c?.section.id)
    ).toEqual(["mock-child-page-id", "mock-child-page-id-2"]);
    expect(complete?.submittable).toEqual(true);

    const incomplete = submittableMetricsSelector(stateWithParent("") as any);
    expect(incomplete?.submittable).toEqual(false);
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
