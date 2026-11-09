import { pasrrReportTemplate } from "./pasrr";
import {
  AccordionGroupItem,
  ChoiceTemplate,
  FormPageTemplate,
  kebabCaseRegex,
  PageElement,
  ReportPages,
  ReviewSubmitTemplate,
  snakeCaseOrCamelCaseRegex,
} from "@pasrr/shared";

function extractIdsWithContext(data: ReportPages) {
  const pageIds = new Set();
  const elementArrays: PageElement[][] = [];

  if (!Array.isArray(data)) return { pageIds: [...pageIds], elementArrays };

  for (const page of data) {
    if (!page || typeof page !== "object") continue;

    if (page.id !== "root") {
      pageIds.add(page.id);
    }

    if (Array.isArray(page.childPageIds)) {
      for (const id of page.childPageIds) {
        if (typeof id === "string") pageIds.add(id);
      }
    }

    const processElements = (elements: PageElement[]) => {
      if (Array.isArray(elements) && elements.length > 0) {
        elementArrays.push(elements);
        elements.forEach((t) => walkNestedElements(t));
      }
    };

    processElements((page as FormPageTemplate).elements);
    processElements((page as ReviewSubmitTemplate).submittedView);
  }

  function walkNestedElements(node: any) {
    if (!node || typeof node !== "object") return;

    if (Array.isArray(node.elements)) {
      elementArrays.push(node.elements);
      node.elements.forEach(walkNestedElements);
    }
    if (Array.isArray(node.accordions)) {
      node.accordions.forEach((accordion: AccordionGroupItem) => {
        if (Array.isArray(accordion?.elements)) {
          elementArrays.push(accordion.elements);
          accordion.elements.forEach(walkNestedElements);
        }
      });
    }
    if (Array.isArray(node.choices)) {
      node.choices.forEach((choice: ChoiceTemplate) => {
        if (Array.isArray(choice?.checkedChildren)) {
          elementArrays.push(choice.checkedChildren);
          choice.checkedChildren.forEach(walkNestedElements);
        }
      });
    }
    if (Array.isArray(node.rows)) {
      elementArrays.push(node.rows);
      node.rows.forEach(walkNestedElements);
    }
    if (node.answer) {
      if (Array.isArray(node.answer)) {
        node.answer.forEach(walkNestedElements);
      } else {
        if (Array.isArray(node.answer.rows))
          node.answer.rows.forEach(walkNestedElements);
        if (Array.isArray(node.answer.total))
          node.answer.total.forEach(walkNestedElements);
      }
    }
  }

  return {
    pageIds: [...pageIds],
    elementArrays,
  };
}

describe("pasrr template", () => {
  const reportTemplate = pasrrReportTemplate("MN");
  const { pageIds, elementArrays } = extractIdsWithContext(reportTemplate);

  describe("page IDs", () => {
    const pageTestCases = pageIds.map((id) => [id]);

    test.each(pageTestCases)("'%s' is kebab-case", (pageId) => {
      expect(pageId).toMatch(kebabCaseRegex);
    });

    test("page IDs are unique", () => {
      const declaredPageIds = reportTemplate.map((page) => page.id);
      const uniquePageIds = new Set(declaredPageIds);
      expect(uniquePageIds.size).toBe(declaredPageIds.length);
    });

    test.each([
      { id: "mock" },
      { id: "kebab-case" },
      { id: "kebab-case-kebab-case" },
    ])("should accept the string '$id'", ({ id }) => {
      expect(id).toMatch(kebabCaseRegex);
    });

    test.each([
      { id: "camelCase" },
      { id: "snake_case" },
      { id: "PascalCase" },
      { id: "kebab-case-camelCase" },
      { id: "kebab-case-snake_case" },
      { id: "kebab-case-PascalCase" },
    ])("should reject the string '$id'", ({ id }) => {
      expect(id).not.toMatch(kebabCaseRegex);
    });
  });

  describe("elements IDs", () => {
    const individualElementTestCases = elementArrays.flatMap(
      (group, groupIndex) => group.map((t) => [t.id, group, groupIndex + 1])
    );

    test.each(individualElementTestCases)(
      "'%s' is snake_case and camelCase",
      (elementId) => {
        expect(elementId).toMatch(snakeCaseOrCamelCaseRegex);
      }
    );

    const siblingTestCases = elementArrays.map((group) => [
      `[${group.map((t) => t.id).join(", ")}]`,
      group,
    ]);

    test.each(siblingTestCases)(
      "sibling element IDs %s have a common prefix",
      (_, elements) => {
        if (Array.isArray(elements) === false || elements.length === 0) return;

        const prefixes = new Map();

        elements.forEach((t) => {
          const id = t.id;
          let firstPart = id.includes("_")
            ? id.split("_")[0]
            : (id.match(/^[a-z]+/) || [""])[0];

          if (!prefixes.has(firstPart)) {
            prefixes.set(firstPart, []);
          }
          prefixes.get(firstPart).push(id);
        });

        if (prefixes.size > 1) {
          const summary = [...prefixes.entries()]
            .map(
              ([prefix, ids]) =>
                `prefix "${prefix}" used by: [${ids.join(", ")}]`
            )
            .join("; ");
          throw new Error(`Sibling prefix mismatch found: ${summary}`);
        }
        expect(prefixes.size).toBe(1);
      }
    );

    test("element IDs are unique", () => {
      elementArrays.forEach((group) => {
        const ids = group.map((t) => t.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      });
    });

    test.each([
      { id: "mock" },
      { id: "snake_case" },
      { id: "snake_camelCase" },
      { id: "snake_camelCase_camelCase" },
      { id: "snake_camelCase_snake_case" },
    ])("should accept the string '$id'", ({ id }) => {
      expect(id).toMatch(snakeCaseOrCamelCaseRegex);
    });

    test.each([
      { id: "kebab-case" },
      { id: "camelCase" },
      { id: "PascalCase" },
      { id: "snake_case_kebab-case" },
      { id: "snake_case_PascalCase" },
    ])("should reject the string '$id'", ({ id }) => {
      expect(id).not.toMatch(snakeCaseOrCamelCaseRegex);
    });
  });
});
