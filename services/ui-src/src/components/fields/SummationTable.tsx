import { Flex } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { JSX, useState } from "react";
import {
  SummationTableTemplate,
  ActionRowElement,
  ElementType,
  SummationTableCellAnswerShape,
  SummationTableRowAnswerShape,
} from "@pasrr/shared";
import {
  buildElement,
  getErrorMessage,
} from "utils/state/reportLogic/tableBuilder";
import { parseNumber, unmaskByType } from "utils/validation/inputValidation";
import { ResponsiveTable } from "components/tables/ResponsiveTable";

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
      value = parseNumber(value.toString()) ?? value;
    }

    return {
      ...answerCell,
      value,
    };
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
    rows: ActionRowElement[];
  }) => {
    const firstCellId = rows?.[0]?.id ?? "";
    const formattedBodyRows: (JSX.Element | string | number)[][] = answer.map(
      (answerRow, answerRowIndex) => {
        const rowElements: (JSX.Element | string | number)[] = rows.map(
          (column) => {
            const answerCell = answerRow.find((t) => t.id === column.id);
            const formattedCell = {
              ...column,
              disabled,
            };
            const value = buildElement({
              defaultValue: answerCell?.value ?? "",
              element: formattedCell,
              errorMessage: errorMessages[answerRowIndex]?.get(column.id),
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
              readonly: Boolean(answerCell?.readonly),
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
    const updatedCell = { id, value: value[0] };
    const formattedValue = formatAnswer(updatedCell, rows, type).value;
    const rowToUpdate = answerRows[index] ?? [];
    answerRows[index] = rowToUpdate;
    const cellToUpdate = rowToUpdate.find((t) => t.id === id);

    if (cellToUpdate) {
      cellToUpdate.value = formattedValue;
    } else {
      rowToUpdate.push({ id, value: formattedValue });
    }

    const updatedErrorMessages = [...errorMessages];
    const errorMessage = getErrorMessage(type, false, value);
    updatedErrorMessages[index].set(id, errorMessage);
    setErrorMessages(updatedErrorMessages);

    const updatedAnswer = {
      rows: answerRows,
      // TODO: SummationTable total
      total: answer?.total ?? [],
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

// TODO: SummationTable export view
export const SummationTableExport = (_element: SummationTableTemplate) => {
  return <></>;
};
