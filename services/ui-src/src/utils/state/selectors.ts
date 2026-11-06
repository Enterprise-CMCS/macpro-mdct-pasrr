import {
  BannerArea,
  FormPageTemplate,
  isCompleteStatus,
  PageStatus,
  ParentPageTemplate,
} from "@pasrr/shared";
import { BannerState, ReportState } from "types";
import { inferredReportStatus } from "./reportLogic/completeness";
import { compareDates, parseAsLocalDate } from "utils/other/time";

export const currentPageSelector = (state: ReportState) => {
  const { report, pageMap, currentPageId } = state;

  if (!report || !pageMap || !currentPageId) {
    return null;
  }

  const currentPage = report.pages[pageMap.get(currentPageId)!];
  return currentPage;
};

/**
 * @param section Check the elements in the page for a required key. If key exist and is true, return true.
 * @returns boolean
 */
export const checkIfStatusIsRequired = (section: FormPageTemplate) => {
  return section.elements.some(
    (element) => "required" in element && element.required
  );
};

export type SectionDetails = {
  section: FormPageTemplate;
  displayStatus: PageStatus | undefined;
  submittable: boolean;
};

/**
 * A parent page is shown as a group row with its child pages nested beneath it.
 * Any other page is shown as a single section row.
 */
export type ReviewRow =
  | { kind: "section"; id: string; section: SectionDetails | null }
  | {
      kind: "group";
      id: string;
      title: string;
      children: (SectionDetails | null)[];
    };

export const submittableMetricsSelector = (state: ReportState) => {
  const { report, pageMap } = state;
  if (!report || !pageMap) {
    return null;
  }

  const getPage = (id: string) => {
    const pageIdx = pageMap.get(id);
    return pageIdx ? report.pages[pageIdx] : undefined;
  };

  const toSectionDetails = (id: string): SectionDetails | null => {
    const pageIdx = pageMap.get(id);
    if (!pageIdx) return null;

    const section = report.pages[pageIdx] as FormPageTemplate;

    const displayStatus = inferredReportStatus(report, section.id);

    return {
      section: section,
      displayStatus: !checkIfStatusIsRequired(section)
        ? PageStatus.OPTIONAL
        : displayStatus,
      submittable: displayStatus === PageStatus.COMPLETE,
    };
  };

  const childPages = (report.pages[pageMap.get("root")!] as ParentPageTemplate)
    .childPageIds;
  // The last root page is the review page, which is not reported.
  const rows: ReviewRow[] = childPages.slice(0, -1).map((id) => {
    const page = getPage(id);
    if (page?.childPageIds) {
      return {
        kind: "group",
        id,
        title: page.title ?? "",
        children: page.childPageIds.map(toSectionDetails),
      };
    }
    return { kind: "section", id, section: toSectionDetails(id) };
  });

  const sections = rows.flatMap((row) =>
    row.kind === "group" ? row.children : [row.section]
  );

  const allPagesSubmittable = sections.every(
    (sectionInfo) => !!sectionInfo?.submittable
  );
  const submittable = !isCompleteStatus(report.status) && allPagesSubmittable;

  return { rows: rows, sections: sections, submittable: submittable };
};

export const activeBannerSelector = (area: BannerArea) => {
  return (state: BannerState) => {
    const now = new Date();
    const ONE_HOUR = 60 * 60 * 1000;
    if (now.valueOf() - state._lastFetchTime > ONE_HOUR) {
      // Kick off a fetch, but don't bother awaiting.
      // The useStore hook will update dependent components as needed.
      state.fetchBanners();
    }

    return state.allBanners.find(
      (banner) =>
        area === banner.area &&
        compareDates(parseAsLocalDate(banner.startDate), now) <= 0 &&
        compareDates(now, parseAsLocalDate(banner.endDate)) <= 0
    );
  };
};
