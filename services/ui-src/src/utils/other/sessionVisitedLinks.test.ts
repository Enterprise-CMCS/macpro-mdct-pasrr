import { VISITED_LINKS_STORAGE_KEY } from "../../constants";
import {
  clearSessionVisitedLinks,
  isSessionVisitedLink,
  markSessionVisitedLink,
} from "./sessionVisitedLinks";

const url = "https://example.com/pasrr";

describe("sessionVisitedLinks", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("reports no visited links when nothing is stored", () => {
    expect(isSessionVisitedLink(url)).toBe(false);
  });

  test("marks a link as visited and keeps previously visited links", () => {
    markSessionVisitedLink(url);
    markSessionVisitedLink("https://example.com/other");

    expect(isSessionVisitedLink(url)).toBe(true);
    expect(isSessionVisitedLink("https://example.com/other")).toBe(true);
    expect(
      JSON.parse(sessionStorage.getItem(VISITED_LINKS_STORAGE_KEY) as string),
    ).toEqual([url, "https://example.com/other"]);
  });

  test("clears all visited links", () => {
    markSessionVisitedLink(url);

    clearSessionVisitedLinks();

    expect(isSessionVisitedLink(url)).toBe(false);
    expect(sessionStorage.getItem(VISITED_LINKS_STORAGE_KEY)).toBeNull();
  });

  test("treats stored data that is not valid JSON as no visited links", () => {
    sessionStorage.setItem(VISITED_LINKS_STORAGE_KEY, "{not json");

    expect(isSessionVisitedLink(url)).toBe(false);

    markSessionVisitedLink(url);
    expect(
      JSON.parse(sessionStorage.getItem(VISITED_LINKS_STORAGE_KEY) as string),
    ).toEqual([url]);
  });

  test("treats stored data that is not an array as no visited links", () => {
    sessionStorage.setItem(
      VISITED_LINKS_STORAGE_KEY,
      JSON.stringify({ href: url }),
    );

    expect(isSessionVisitedLink(url)).toBe(false);
  });

  test("ignores non-string entries in stored data", () => {
    sessionStorage.setItem(
      VISITED_LINKS_STORAGE_KEY,
      JSON.stringify([url, 42, null, { href: "x" }]),
    );

    expect(isSessionVisitedLink(url)).toBe(true);
    expect(isSessionVisitedLink("42")).toBe(false);

    markSessionVisitedLink("https://example.com/other");
    expect(
      JSON.parse(sessionStorage.getItem(VISITED_LINKS_STORAGE_KEY) as string),
    ).toEqual([url, "https://example.com/other"]);
  });
});
