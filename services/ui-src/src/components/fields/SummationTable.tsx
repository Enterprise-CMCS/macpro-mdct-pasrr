import { Flex, Stack, Text } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { JSX, useState } from "react";
import {
  SummationTableTemplate,
  ActionRowElement,
  ElementType,
  SummationTableCellAnswerShape,
  SummationTableRowAnswerShape,
  MaskType,
} from "@pasrr/shared";
import {
  buildElement,
  getErrorMessage,
} from "utils/state/reportLogic/tableBuilder";
import {
  isEmptyValue,
  isWholePositiveNumber,
  unmaskByType,
} from "utils/validation/inputValidation";
import { ResponsiveTable } from "components/tables/ResponsiveTable";
import { notAnsweredText } from "../../constants";

export const SummationTable = (
  props: PageElementProps<SummationTableTemplate>
) => {
  const { caption, rows, answer } = props.element;
  const buildEmptyErrorMessages = (answerRow: SummationTableRowAnswerShape) =>
    new Map<string, string>(answerRow.map((t) => [t.id, ""]));
  const [errorMessages, setErrorMessages] = useState<
    Array<Map<string, string>>
  >(answer?.rows?.map((t) => buildEmptyErrorMessages(t)) ?? []);

  const formatAnswer = (
    answerCell: SummationTableCellAnswerShape,
    rows: ActionRowElement[],
    type: ElementType
  ) => {
    const element = rows.find((t) => t.id === answerCell.id);
    let value = answerCell.value;

    if (element?.mask) {
      value = unmaskByType(element.mask, value);
    } else if (type === ElementType.NumberField && value) {
      const cleanedInput = value.toString().trim().replaceAll(",", "");
      value = isWholePositiveNumber(cleanedInput)
        ? Number(cleanedInput)
        : value;
    }

    return value;
  };

  const generateAriaLabel = (
    header: string,
    answerRow: SummationTableRowAnswerShape,
    firstCellId: string
  ) => {
    const labels = [header];
    const label = answerRow.find((row) => row.id === firstCellId)?.value ?? "";
    if (label) labels.unshift(label.toString());
    return labels.join(" ");
  };

  const buildRows = ({
    answer = [],
    disabled = false,
    errorMessages = [],
    onChange,
    readonly = false,
    rows,
  }: {
    answer?: SummationTableRowAnswerShape[];
    disabled?: boolean;
    errorMessages?: Array<Map<string, string>>;
    onChange?: ({
      answer,
      id,
      index,
      type,
      value,
    }: {
      answer: SummationTableRowAnswerShape[];
      id: string;
      index: number;
      type: ElementType;
      value: string[];
    }) => void;
    readonly?: boolean;
    rows: ActionRowElement[];
  }) => {
    const firstCellId = rows?.[0]?.id ?? "";
    const formattedBodyRows: (JSX.Element | string | number)[][] = answer.map(
      (answerRow, answerRowIndex) => {
        const rowElements: (JSX.Element | string | number)[] = rows.map(
          (column) => {
            const answerCell = answerRow.find((t) => t.id === column.id);
            const readonlyCell = Boolean(answerCell?.readonly) || readonly;
            const readonlyNumberMask =
              !column.mask &&
              readonly &&
              column.type === ElementType.NumberField;
            const formattedCell = {
              ...column,
              disabled,
              mask: readonlyNumberMask ? MaskType.CommaSeparated : column.mask,
            };
            const value = buildElement({
              defaultValue: answerCell?.value ?? "",
              element: formattedCell,
              errorMessage: errorMessages[answerRowIndex]?.get(column.id),
              id: column.id,
              key: `element-${column.id}-${answerRowIndex}`,
              label: generateAriaLabel(column.header, answerRow, firstCellId),
              onChange: (value) =>
                onChange?.({
                  answer,
                  id: column.id,
                  index: answerRowIndex,
                  type: formattedCell.type,
                  value,
                }),
              readonly: readonlyCell,
            });
            return value ?? "--";
          }
        );

        // TODO: SummationTable actions
        rowElements.push(<></>);
        return rowElements;
      }
    );

    return formattedBodyRows;
  };

  const updateTotalRows = ({
    rows,
    total,
    type,
    id,
  }: {
    id: string;
    rows: SummationTableRowAnswerShape[];
    total: SummationTableRowAnswerShape[];
    type: ElementType;
  }) => {
    if (type !== ElementType.NumberField) {
      return total;
    }

    const sumById = rows.reduce((sum, row) => {
      const cell = row.find((t) => t.id === id);
      return (
        sum + (isWholePositiveNumber(cell?.value) ? Number(cell?.value) : 0)
      );
    }, 0);

    const newSumRow = { id, value: sumById, readonly: true };
    const updatedTotalRows = total.length > 0 ? [...total] : [[newSumRow]];

    for (const row of updatedTotalRows) {
      const cellToUpdate = row.find((t) => t.id === id);
      if (cellToUpdate) {
        cellToUpdate.value = sumById;
      } else {
        row.push(newSumRow);
      }
    }

    return updatedTotalRows;
  };

  const onChangeHandler = ({
    id,
    index,
    type,
    value,
  }: {
    id: string;
    index: number;
    type: ElementType;
    value: string[];
  }) => {
    const answerRows = [...(answer?.rows ?? [])];
    const totalRows = [...(answer?.total ?? [])];
    const updatedCell = { id, value: value[0] };
    const formattedValue = formatAnswer(updatedCell, rows, type);
    const rowToUpdate = answerRows[index] ?? [];
    answerRows[index] = rowToUpdate;
    const cellToUpdate = rowToUpdate.find((t) => t.id === id);

    if (cellToUpdate) {
      cellToUpdate.value = formattedValue;
    } else {
      rowToUpdate.push({ id, value: formattedValue });
    }

    const updatedErrorMessages = [...errorMessages];
    const errorMessage = getErrorMessage({
      type,
      validators: { [ElementType.NumberField]: isWholePositiveNumber },
      value,
    });
    updatedErrorMessages[index].set(id, errorMessage);
    setErrorMessages(updatedErrorMessages);

    const updatedAnswer = {
      rows: answerRows,
      total: updateTotalRows({ id, rows: answerRows, total: totalRows, type }),
    };

    props.updateElement({ answer: updatedAnswer });
  };

  const formattedBodyRows = buildRows({
    answer: answer?.rows,
    disabled: props.disabled,
    errorMessages,
    onChange: onChangeHandler,
    rows,
  });

  const formattedFootRows = buildRows({
    answer: answer?.total,
    readonly: true,
    rows,
  });

  const headers = rows.map((t) => ({ label: t.header }));
  headers.push({ label: "Actions" });

  return (
    <Flex gap="1.25rem" flexDirection="column" width="100%">
      {ResponsiveTable({
        caption,
        footers: formattedFootRows,
        headers,
        rows: formattedBodyRows,
        variant: "summation",
      })}
    </Flex>
  );
};

export const SummationTableExport = (element: SummationTableTemplate) => {
  const headers = element.rows.map((row) => ({ label: row.header }));
  const buildRow = (answerRow: SummationTableRowAnswerShape) => {
    return element.rows.map((header) => {
      const cell = answerRow.find((cell) => cell.id === header.id);
      if (!cell || isEmptyValue(cell.value)) {
        return (
          <Text as="span" color="error_darker">
            {notAnsweredText}
          </Text>
        );
      }
      return cell.value.toString();
    });
  };

  const footers = element.answer?.total?.map(buildRow) || [];
  const rows = element.answer?.rows.map(buildRow) || [];

  return (
    <Stack key={element.id}>
      {ResponsiveTable({ footers, headers, rows, variant: "pdf" })}
    </Stack>
  );
};

export const sumById = (rows: SummationTableRowAnswerShape[], id: string) =>
  rows.reduce((sum, row) => {
    const cell = row.find((t) => t.id === id);
    return sum + (isWholePositiveNumber(cell?.value) ? Number(cell?.value) : 0);
  }, 0);
