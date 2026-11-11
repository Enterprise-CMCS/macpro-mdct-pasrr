import { Button, Stack, Text } from "@chakra-ui/react";
import {
  ActionTableTemplate,
  DropdownTemplate,
  ElementType,
  FieldGroupTemplate,
  FormPageTemplate,
  PageElement,
  ParentPageTemplate,
  RadioTemplate,
  SummationTableRowAnswerShape,
  SummationTableTemplate,
} from "@pasrr/shared";
import { sumById } from "components/fields/SummationTable";
import { ReportAutosaveContext } from "components/report/ReportAutosaveProvider";
import { useContext } from "react";
import { useStore } from "utils";
import {
  currentPageSelector,
  submittableMetricsSelector,
} from "utils/state/selectors";
import { isEmptyValue } from "utils/validation/inputValidation";

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
      case ElementType.Radio:
        return value;
      case ElementType.NumberField:
        return 1234;
      case ElementType.Date:
        return "02/02/2026";
      case ElementType.Textbox:
        const textMap: Record<string, string> = {
          email: "mock@email.com",
          phone: "555-555-5555",
          zipcode: "55555",
        };
        const field = Object.keys(textMap).find((f) =>
          id?.toLowerCase().includes(f)
        );
        return field ? textMap[field] : "mock text input";
      case ElementType.TextAreaField:
        return "mock text area field";
      default:
        console.error("Type ignored: " + type + ". Element id: " + id);
        return;
    }
  };

  const fillAnswer = (element: PageElement) => {
    if (!("required" in element) || !element.required) {
      return {};
    }

    const answer =
      "answer" in element &&
      element.answer !== "" &&
      element.answer !== undefined
        ? element.answer
        : undefined;
    let value = "";

    if (
      element.type === ElementType.Dropdown ||
      element.type === ElementType.Radio
    ) {
      const options =
        (element as DropdownTemplate).options ||
        (element as RadioTemplate).choices;
      value = options?.[0]?.value || options?.[1]?.value || "";
    }
    return {
      answer:
        answer ??
        getAnswerByType({ type: element.type, id: element.id, value }),
    };
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
      return {
        ...el,
        ...fillAnswer(el),
      };
    });

    const answer = elements.map((el) => ({
      id: el.id,
      value: el.answer,
    }));

    return { elements, answer };
  };

  const fillSummationTable = (element: SummationTableTemplate) => {
    const { answer, rows: headers = [] } = element;
    const rows = answer?.rows || [];
    const answerTotal = answer?.total || [];

    const getMockAnswer = (
      row: SummationTableRowAnswerShape,
      isTotal: boolean,
      sourceRows: SummationTableRowAnswerShape[]
    ) => {
      return headers.map((header) => {
        const answer = row.find((col) => col.id === header.id);
        const isNumberField = header.type === ElementType.NumberField;

        if (isTotal && isNumberField) {
          return {
            ...(answer || { id: header.id }),
            value: sumById(sourceRows, header.id),
            readonly: true,
          };
        }

        if (!answer) {
          return {
            id: header.id,
            value: getAnswerByType({ type: header.type, id: header.id }) || "",
            ...(isTotal ? { readonly: true } : {}),
          };
        }

        if (!isTotal && isEmptyValue(answer.value)) {
          return {
            ...answer,
            value: getAnswerByType({ type: header.type, id: header.id }) || "",
          };
        }

        return answer;
      });
    };

    const filledRows = rows.map((row) => getMockAnswer(row, false, rows));
    const filledTotal = answerTotal.map((row) =>
      getMockAnswer(row, true, filledRows)
    );

    return { rows: filledRows, total: filledTotal };
  };

  const fillPageElements = (elements: PageElement[]) => {
    return elements.map((element) => {
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

        case ElementType.SummationTable:
          return { ...element, answer: fillSummationTable(element) };

        default:
          return {
            ...element,
            ...fillAnswer(element),
          };
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
      {currentPage?.id && optionalPages?.includes(currentPage.id) ? (
        <Text>No actions available for this page.</Text>
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
