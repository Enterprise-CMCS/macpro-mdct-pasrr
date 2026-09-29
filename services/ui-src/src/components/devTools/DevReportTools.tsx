import { Button, Stack, Text } from "@chakra-ui/react";
import {
  ActionTableTemplate,
  ElementType,
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

  const getAnswerByType = (type: string, id?: string) => {
    switch (type) {
      case ElementType.NumberField:
        return "1234";
      case ElementType.Date:
        return "02/02/2026";
      case ElementType.Textbox:
        return id?.includes("email") ? "mock@email.com" : "mock text input";
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
          return { ...col, value: getAnswerByType(typeInfo.type, typeInfo.id) };
        }
      }
      return col;
    };

    return answer?.map((row) =>
      row.map((col) => getMockAnswer(col as { id: string; value: string }))
    );
  };

  const fillPageElements = (elements: PageElement[]) => {
    return elements?.map((element) => {
      if (!("required" in element) || !element.required) {
        return element;
      }
      if (element.type === "actionTable")
        return { ...element, answer: fillActionTable(element) };
      else
        return {
          ...element,
          answer: getAnswerByType(element.type, element.id),
        };
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
