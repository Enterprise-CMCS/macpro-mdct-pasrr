import { Flex, Button, Image, Heading, Stack, Text } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { JSX, useState } from "react";
import { useParams } from "react-router";
import {
  ActionTableTemplate,
  ActionRowElement,
  ActionAnswerShape,
  ElementType,
  FormPageTemplate,
  PageStatus,
} from "@pasrr/shared";
import { optionalTag, parseHtml, useStore } from "utils";
import {
  buildElement,
  getErrorMessage,
} from "utils/state/reportLogic/tableBuilder";
import addPrimary from "assets/icons/add/icon_add_blue.svg";
import addGray from "assets/icons/add/icon_add_gray.svg";
import { unmaskByType } from "utils/validation/inputValidation";
import { ResponsiveTable } from "components/tables/ResponsiveTable";

/** This function is meant to handle how the table rows disabled is set, this may expand to encompass more than the Status column */
const isRowDisabled = (rows: ActionRowElement[], answer: ActionAnswerShape) => {
  //check to see if status is a row in the table
  if (rows.some((row) => row.id === "status")) {
    const value = answer.find((field) => field.id === "status")?.value;
    if (value === "Abandoned") return true;
  }
  return false;
};

/** For generating better aria label in the metrics table */
const generateAriaLabel = (header: string, answer: ActionAnswerShape) => {
  const label = answer.find((row) => row.id === "metric")?.value ?? "";
  return `${label} ${header}`;
};

const buildEmptyErrorMessages = (answer: ActionAnswerShape) =>
  new Map<string, string>(answer.map((item) => [item.id, ""]));

const buildRows = (
  rows: ActionRowElement[],
  answer: ActionAnswerShape[],
  onChange: (
    value: string[],
    index: number,
    id: string,
    type: ElementType
  ) => void,
  formDisabled?: boolean,
  errorMessages: Array<Map<string, string>> = []
) => {
  const formattedRows: (JSX.Element | string | number)[][] = [];
  answer.forEach((answerRow, answerRowIndex) => {
    const rowElement: (JSX.Element | string | number)[] = [];
    const disabled = isRowDisabled(rows, answerRow) || formDisabled;
    rows.map((column) => {
      //autogenerate next # column
      if (column.id === "no") {
        rowElement.push(answerRowIndex + 1);
      } else {
        const element = answerRow.find((item) => item.id === column.id);
        const formattedCol = {
          ...column,
          disabled: disabled || column.disabled,
        };

        const value = buildElement(
          formattedCol,
          element?.value!,
          (value) =>
            onChange(value, answerRowIndex, column.id, formattedCol.type),
          generateAriaLabel(column.header, answerRow),
          errorMessages[answerRowIndex]?.get(column.id)
        );
        rowElement.push(value || "--");
      }
    });
    formattedRows.push(rowElement);
  });

  return formattedRows;
};

export const ActionTable = (props: PageElementProps<ActionTableTemplate>) => {
  const { disabled, element } = props;
  const { heading, helperText, label, rows, answer } = element;
  const { userIsAdmin: canAddOrChangeStatus } = useStore().user ?? {};
  const { report } = useStore();
  const { pageId } = useParams();
  const parentPage = report?.pages.find(
    (page) => page.id === pageId
  ) as FormPageTemplate;
  const actionsDisabled =
    disabled || element.disabled || parentPage?.status === PageStatus.ABANDONED;

  const [errorMessages, setErrorMessages] = useState<
    Array<Map<string, string>>
  >(answer?.map((row) => buildEmptyErrorMessages(row)) ?? []);

  const formatAnswers = (
    data: ActionAnswerShape,
    answerType: "modal" | "row"
  ) => {
    return data.map((item) => {
      let element;
      if (answerType === "row") {
        element = rows.find((element) => element.id === item.id);
      }
      if (element?.mask) {
        return {
          ...item,
          value: unmaskByType(element.mask, item.value),
        };
      }
      return item;
    });
  };

  const onChange = (
    value: string[],
    index: number,
    id: string,
    type: ElementType
  ) => {
    const newAnswer = [...(answer ?? [])];
    const newErrorMessages = [...errorMessages];
    const rowIndex = newAnswer[index].findIndex((answer) => answer.id === id);
    const errorMessage = getErrorMessage(type, false, value);
    newErrorMessages[index].set(id, errorMessage);
    setErrorMessages(newErrorMessages);
    const formattedValue = formatAnswers(
      [{ id: id, value: value[0] }],
      "row"
    )[0].value;

    newAnswer[index][rowIndex].value = formattedValue;
    props.updateElement({ answer: newAnswer });
  };

  const formattedRows = buildRows(
    rows,
    answer ?? [],
    onChange,
    actionsDisabled,
    errorMessages
  );

  const headers = rows.map((row) => ({ label: row.header }));
  if (canAddOrChangeStatus) headers.push({ label: "Actions" });

  return (
    <Flex gap="1.25rem" flexDirection="column" width="100%">
      <Heading as="h2" variant="subHeader">
        {optionalTag({ label: heading, required: element.required })}
      </Heading>
      {helperText && <Text color="gray_dark">{parseHtml(helperText)}</Text>}
      {canAddOrChangeStatus ? (
        <Button
          aria-label={`add ${label}`}
          variant="outline"
          alignSelf="flex-start"
          leftIcon={
            <Image src={actionsDisabled ? addGray : addPrimary} alt="Add" />
          }
          disabled={actionsDisabled}
        >
          Add {label}
        </Button>
      ) : null}
      {ResponsiveTable(headers, formattedRows, "metric")}
    </Flex>
  );
};

export const ActionTableExport = (element: ActionTableTemplate) => {
  const headers = element.rows.map((row) => ({ label: row.header }));
  const ids = element.rows.map((row) => row.id);

  const buildRow = (element: ActionAnswerShape, index: number) => {
    return ids.map((id) => {
      if (id === "no") return index + 1;
      const value = element.find((item) => id === item.id)?.value;
      return !value || value === "" ? "Not applicable" : value;
    });
  };

  const rows = element.answer?.map((row, index) => buildRow(row, index)) ?? [];

  return (
    <Stack width="720px" key={element.id}>
      <Heading as="h2" className="chakra-heading" fontWeight="bold">
        {element.label}
      </Heading>
      {ResponsiveTable(headers, rows, "pdf")}
    </Stack>
  );
};
