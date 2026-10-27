import { VISITED_LINKS_STORAGE_KEY } from "../../constants";

const readVisitedLinks = (): string[] => {
  try {
    const parsed = JSON.parse(
      sessionStorage.getItem(VISITED_LINKS_STORAGE_KEY) ?? "[]"
    );
    return Array.isArray(parsed)
      ? parsed.filter((href): href is string => typeof href === "string")
      : [];
  } catch {
    return [];
  }
};

export const isSessionVisitedLink = (href: string) =>
  readVisitedLinks().includes(href);

export const markSessionVisitedLink = (href: string) => {
  const visited = new Set([...readVisitedLinks(), href]);
  sessionStorage.setItem(
    VISITED_LINKS_STORAGE_KEY,
    JSON.stringify([...visited])
  );
};

export const clearSessionVisitedLinks = () => {
  sessionStorage.removeItem(VISITED_LINKS_STORAGE_KEY);
};
