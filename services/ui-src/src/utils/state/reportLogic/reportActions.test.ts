import {
  ElementType,
  PageStatus,
  PageType,
  Report,
  ReportStatus,
  ReportType,
  TextboxTemplate,
  FormPageTemplate,
  PasrrSubType,
} from "@pasrr/shared";
import { ReportState } from "types";
import {
  buildState,
  mergeAnswers,
  setPage,
  flattenPageIds,
  saveReport,
  deepEquals,
  deepMerge,
  setAnswerInElement,
} from "./reportActions";

vi.mock("../../api/requestMethods/report", () => ({
  putReport: vi.fn(),
}));
const testReport: Report = {
  type: ReportType.PASRR,
  name: "plan id",
  state: "NJ",
  id: "mock-report-id",
  status: ReportStatus.NOT_STARTED,
  created: 1776449695077,
  subType: PasrrSubType.ANNUAL,
  subTypeKey: "A1",
  budgetPeriod: 1,
  reportingYear: 2026,
  submissionCount: 0,
  pages: [
    {
      id: "root",
      childPageIds: ["general-information", "mock-page-id"],
    },
    {
      id: "general-information",
      title: "General Information",
      type: PageType.Standard,
      status: PageStatus.NOT_STARTED,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "mock_headerId",
          text: "General Information",
        },
        {
          type: ElementType.Textbox,
          id: "mock_textboxId",
          label: "Contact title",
          required: true,
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
      ],
    },
    {
      id: "mock-page-id",
      title: "Mock Report Page",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "mock_headerId",
          text: "Mock Report Page",
        },
        {
          type: ElementType.Textbox,
          id: "mock_textboxId",
          label: "Contact title",
          required: true,
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
          answer: "",
        },
      ],
    },
  ],
};

describe("reportActions", () => {
  describe("state/management/reportState: buildState", () => {
    test("initializes relevant parts of the state", () => {
      const result = buildState(testReport, false);
      expect(result.pageMap!.size).toEqual(3);
      expect(result.report).not.toBeUndefined();
      expect(result.rootPage).not.toBeUndefined();
      expect(result.parentPage?.parent).toEqual("root");
      expect(result.currentPageId).toEqual("general-information");
    });

    test("returns early when no report provided", () => {
      const result = buildState(undefined, false);
      expect(result.report).toBeUndefined();
    });
  });

  describe("state/management/reportState: setPage", () => {
    test("updates the page info", () => {
      const state = buildState(testReport, false) as ReportState;
      const result = setPage("mock-page-id", state);
      expect(result.currentPageId).toEqual("mock-page-id");
    });
  });

  describe("nested pages", () => {
    const nestedReport = {
      ...testReport,
      pages: [
        { id: "root", childPageIds: ["a", "b", "c", "d"] },
        { id: "a", title: "A", type: PageType.Standard, elements: [] },
        {
          id: "b",
          title: "B",
          type: PageType.Standard,
          elements: [],
          childPageIds: ["b-1", "b-2"],
        },
        { id: "b-1", title: "B1", type: PageType.Standard, elements: [] },
        { id: "b-2", title: "B2", type: PageType.Standard, elements: [] },
        { id: "c", title: "C", type: PageType.Standard, elements: [] },
        { id: "d", title: "D", childPageIds: ["d-1"] },
        { id: "d-1", title: "D1", type: PageType.Standard, elements: [] },
      ],
    } as Report;
    // "d" is a parent-only page, so navigation goes straight to its child
    const expectedOrder = ["a", "b", "b-1", "b-2", "c", "d-1"];

    test("flattenPageIds lists children right after their parent", () => {
      const pageMap = new Map(nestedReport.pages.map((pg, i) => [pg.id, i]));
      expect(
        flattenPageIds(nestedReport, pageMap, ["a", "b", "c", "d"])
      ).toEqual(expectedOrder);
    });

    test("buildState uses the flattened order for navigation", () => {
      const state = buildState(nestedReport, false) as ReportState;
      expect(state.parentPage?.childPageIds).toEqual(expectedOrder);
      expect(state.currentPageId).toEqual("a");
    });

    test("setPage on a child page points Continue at the next page in order", () => {
      const state = buildState(nestedReport, false) as ReportState;
      const { parentPage } = setPage("b-2", state);
      expect(parentPage?.index).toEqual(3);
      expect(parentPage?.childPageIds[parentPage.index + 1]).toEqual("c");
    });

    test("Continue from the last child of one section lands on the first child of the next parent-only section", () => {
      const state = buildState(nestedReport, false) as ReportState;
      const { parentPage } = setPage("c", state);
      expect(parentPage?.childPageIds[parentPage.index + 1]).toEqual("d-1");
    });

    test("setPage on a parent page continues into its first child", () => {
      const state = buildState(nestedReport, false) as ReportState;
      const { parentPage } = setPage("b", state);
      expect(parentPage?.childPageIds[parentPage.index + 1]).toEqual("b-1");
    });
  });

  describe("deepEquals", () => {
    test("Rejects values with different types", () => {
      const obj1 = { foo: "123" };
      const obj2 = { foo: 123 };
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Rejects arrays with different lengths", () => {
      const obj1 = [1, 2, 3];
      const obj2 = [1, 2];
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Rejects arrays with different contents", () => {
      const obj1 = ["a", "b", "c"];
      const obj2 = ["a", "b", "x"];
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Rejects objects with different shapes", () => {
      const obj1 = { foo: "bar" };
      const obj2 = { foo: "bar", baz: "quux" };
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Rejects an object and null", () => {
      // null is a special case because `typeof null === "object"`
      const obj1 = { foo: "bar" };
      const obj2 = null;
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Accepts NaN and NaN", () => {
      // NaN is a special case because `(NaN === NaN) === false`
      const obj1 = NaN;
      const obj2 = NaN;
      expect(deepEquals(obj1, obj2)).toBe(true);
    });

    test("Accepts normal values", () => {
      const obj1 = {
        bool: true,
        num: 123,
        obj: { foo: "bar" },
        str: "hello",
        nul: null,
        arr: [1, 2, 3],
      };
      const obj2 = deepMerge(obj1, {});
      expect(deepEquals(obj1, obj2)).toBe(true);
      expect(deepEquals(obj2, obj1)).toBe(true);
    });

    test("Accepts weird values", () => {
      /*
       * I call these values are "weird" because JSON.stringify mangles them.
       * That makes testing difficult, since we mock structuredClone with JSON,
       * and our answer-merging code relies on structuredClone.
       */
      const obj1 = {
        bigint: 456n,
        undef: undefined,
        nan: NaN,
        negz: -0,
        inf: Infinity,
        dat: new Date(2025, 8, 1),
      };
      const obj2 = {
        bigint: 456n,
        undef: undefined,
        nan: NaN,
        negz: -0,
        inf: Infinity,
        dat: new Date(2025, 8, 1),
      };
      expect(deepEquals(obj1, obj2)).toBe(true);
    });

    test("Rejects really weird values", () => {
      /*
       * For symbols and functions, identical definitions yield unequal objects.
       * That's really weird, you might say.
       * If we ever embed functions or symbols into report bodies,
       * we may have to write special-case code to handle these.
       */
      expect(deepEquals({ x: Symbol("💿") }, { x: Symbol("💿") })).toBe(false);
      expect(deepEquals({ x: () => {} }, { x: () => {} })).toBe(false);
    });
  });

  describe("state/management/reportState: mergeAnswers", () => {
    test("Adds answers to a question", () => {
      const state = buildState(testReport, false) as ReportState;

      const answers = { elements: [null, { answer: "ANSWERED" }] };
      const result = mergeAnswers(answers, state);

      const page = result?.report?.pages[1] as FormPageTemplate;
      const elements = page?.elements;
      const question = elements[1] as TextboxTemplate;
      expect(page.status).toEqual(PageStatus.IN_PROGRESS);
      expect(question.answer).toEqual("ANSWERED");
    });
  });

  describe("state/management/reportState: saveReport", () => {
    test("updates store on success", async () => {
      const state = buildState(testReport, false) as ReportState;
      const result = await saveReport(state);
      expect(result?.lastSavedTime).toBeTruthy();
    });
  });

  describe("state/management/reportState: SetAnswerInElement", () => {
    test("update setAnswer on success", () => {
      const mockGetAnswer = vi.fn();
      const mockSetAnswer = vi.fn();

      setAnswerInElement(
        testReport,
        "mock-page-id",
        "mock_textboxId",
        mockGetAnswer,
        mockSetAnswer
      );
      expect(mockGetAnswer).toHaveBeenCalled();
      expect(mockSetAnswer).toHaveBeenCalled();
    });
  });
});
