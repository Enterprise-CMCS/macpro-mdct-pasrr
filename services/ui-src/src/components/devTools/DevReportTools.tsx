import { Button, Stack, Text } from "@chakra-ui/react";
import {
  ActionTableTemplate,
  DropdownTemplate,
  ElementType,
  FieldGroupTemplate,
  FormPageTemplate,
  PageElement,
  ParentPageTemplate,
} from "@pasrr/shared";
import { ReportAutosaveContext } from "components/report/ReportAutosaveProvider";
import { useContext } from "react";
import { useStore } from "utils";
import {
  currentPageSelector,
  submittableMetricsSelector,
} from "utils/state/selectors";

export const DevReportTools = () => {
  const { setAnswers, report, lastSavedTime } = useStore();
  const currentPage = useStore(currentPageSelector);
  const { autosave } = useContext(ReportAutosaveContext);
  const submittableMetrics = useStore(submittableMetricsSelector);

  const optionalPages = submittableMetrics?.sections
    .filter((section) => section?.displayStatus === "Optional")
    .map((page) => page?.section.id);

  const getAnswerByType = ({
    type,
    id,
    value,
  }: {
    type: string;
    id?: string;
    value?: string;
  }) => {
    switch (type) {
      case ElementType.Dropdown:
        return value;
      case ElementType.NumberField:
        return "1234";
      case ElementType.Date:
        return "02/02/2026";
      case ElementType.Textbox:
        if (id?.includes("email")) return "mock@email.com";
        if (id?.includes("phone")) return "555-555-5555";
        if (id?.includes("zipcode")) return "55555";
        return "mock text input";
      case ElementType.TextAreaField:
        return "mock text area field";
    }
    return console.error("Type ignored: " + type + ". Element id: " + id);
  };

  const fillActionTable = (element: ActionTableTemplate) => {
    const { answer, rows } = element;
    const getMockAnswer = (col: { id: string; value: string }) => {
      //we only want elements that aren't filled out
      if (!col.value || col.value === "") {
        const typeInfo = rows.find((row) => row.id === col.id);
        if (typeInfo && !typeInfo.disabled) {
          return {
            ...col,
            value: getAnswerByType({ type: typeInfo.type, id: typeInfo.id }),
          };
        }
      }
      return col;
    };

    return answer?.map((row) =>
      row.map((col) => getMockAnswer(col as { id: string; value: string }))
    );
  };

  const fillFieldGroup = (element: FieldGroupTemplate) => {
    const elements = element.elements.map((el) => {
      const options = (el as DropdownTemplate).options;
      const value = options?.[0]?.value || options?.[1]?.value || "";
      return {
        ...el,
        answer: getAnswerByType({ type: el.type, id: el.id, value }),
      };
    });

    const answer = elements.map((el) => ({
      id: el.id,
      value: el.answer,
    }));

    return { elements, answer };
  };

  const fillPageElements = (elements: PageElement[]) => {
    return elements.map((element) => {
      if (!("required" in element) || !element.required) {
        return element;
      }

      switch (element.type) {
        case ElementType.ActionTable:
          return { ...element, answer: fillActionTable(element) };

        case ElementType.FieldGroup:
          const fieldGroupFills = fillFieldGroup(element);
          return {
            ...element,
            elements: fieldGroupFills.elements,
            answer: fieldGroupFills.answer,
          };

        default: {
          const answer =
            "answer" in element &&
            element.answer !== "" &&
            element.answer !== undefined
              ? element.answer
              : undefined;
          const options = (element as DropdownTemplate).options;
          const value = options?.[0]?.value || options?.[1]?.value || "";

          return {
            ...element,
            answer:
              answer ??
              getAnswerByType({ type: element.type, id: element.id, value }),
          };
        }
      }
    });
  };

  const fillCurrentPageAndSave = (
    currentPage: ParentPageTemplate | FormPageTemplate,
    triggerSave: boolean = true
  ) => {
    if (!currentPage || !currentPage.elements) return;

    setAnswers(
      {
        ...currentPage,
        elements: fillPageElements(currentPage.elements),
      },
      currentPage.id
    );
    if (triggerSave) {
      autosave();
    }
  };

  const fillReport = () => {
    const requiredPages = report?.pages.filter(
      (page) => !optionalPages?.includes(page.id) && "elements" in page
    );

    if (requiredPages) {
      for (const page of requiredPages) {
        fillCurrentPageAndSave(page, false);
      }
      autosave();
    }
  };

  const renderById = (id: string) => {
    switch (id) {
      case "review-submit":
        return (
          <Stack sx={sx.container} gap="1.25rem">
            <Text>Quick fill all required pages in the report.</Text>
            <Text>
              <b>Last Saved:</b> {lastSavedTime}
            </Text>
            <Button
              variant="primary"
              onClick={() => fillReport()}
              padding={"10px"}
            >
              Fill Report
            </Button>
          </Stack>
        );
    }
    return (
      <>
        <Text>
          Clicking the Auto Fill button will fill only the required fields in{" "}
          {currentPage?.title} page and trigger autosave.
        </Text>
        <Button
          variant="primary"
          onClick={() => fillCurrentPageAndSave(currentPage!)}
        >
          Auto Fill Page
        </Button>
      </>
    );
  };

  return (
    <>
      <Text fontWeight="bold">{currentPage?.title} Tools</Text>
      {optionalPages?.includes(currentPage?.id) ? (
        <Text>No actions avaliable for this page.</Text>
      ) : (
        renderById(currentPage?.id ?? "")
      )}
    </>
  );
};

const sx = {
  container: {
    ".chakra-checkbox__control": {
      border: "1px solid black",
    },
    ".chakra-heading": {
      margin: "0",
    },
  },
};
