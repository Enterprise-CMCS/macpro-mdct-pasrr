import { Button, Flex, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { JSX, useEffect, useRef, useState } from "react";
import {
  ElementType,
  MaskType,
  summationTableAddRowMax,
  SummationTableCellAnswerShape,
  SummationTableRowAnswerShape,
  SummationTableRowElement,
  SummationTableTemplate,
} from "@pasrr/shared";
import {
  buildElement,
  getErrorMessage,
  getNonPresetRows,
  sumById,
} from "utils/state/reportLogic/tableBuilder";
import {
  isEmptyValue,
  isWholePositiveNumber,
  maskByType,
  unmaskByType,
} from "utils/validation/inputValidation";
import { ResponsiveTable } from "components/tables/ResponsiveTable";
import { notAnsweredText } from "../../constants";
import cancelPrimary from "assets/icons/cancel/icon_cancel_primary.svg";
import addPrimary from "assets/icons/add/icon_add_blue.svg";
import addGray from "assets/icons/add/icon_add_gray.svg";

export const SummationTable = (
  props: PageElementProps<SummationTableTemplate>
) => {
  const { disabled, element, updateElement } = props;
  const {
    caption,
    rows,
    answer,
    addRowButtonText = "Add row",
    addRowHelperText,
    addRowMax = summationTableAddRowMax,
  } = element;
  const buildEmptyErrorMessages = (answerRow: SummationTableRowAnswerShape) =>
    new Map<string, string>(answerRow.map((t) => [t.id, ""]));
  const [errorMessages, setErrorMessages] = useState<
    Array<Map<string, string>>
  >(answer?.rows?.map((t) => buildEmptyErrorMessages(t)) ?? []);
  const [enableAddButton, setEnableAddButton] = useState(true);
  const tableRef = useRef<HTMLTableElement>(null);
  const [pendingFocusIndex, setPendingFocusIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const nonPresetRows = getNonPresetRows(answer?.rows);
    setEnableAddButton(addRowMax > nonPresetRows.length);
  }, [answer?.rows, addRowMax]);

  useEffect(() => {
    if (pendingFocusIndex === null) return;
    const input = tableRef.current?.querySelector<HTMLInputElement>(
      `[data-table-row-index="${pendingFocusIndex}"] input`
    );
    input?.focus();
    setPendingFocusIndex(null);
  }, [pendingFocusIndex]);

  const formatAnswer = (
    answerCell: SummationTableCellAnswerShape,
    rows: SummationTableRowElement[],
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

  const generateAriaLabel = ({
    answerRow,
    answerRowIndex,
    firstColumn,
    column,
    prefix,
  }: {
    answerRow: SummationTableRowAnswerShape;
    answerRowIndex: number;
    firstColumn: SummationTableRowElement;
    column?: SummationTableRowElement;
    prefix?: string;
  }): string => {
    const firstAnswerColumn = answerRow.find(
      (row) => row.id === firstColumn.id
    );
    const firstAnswer =
      String(firstAnswerColumn?.value ?? "") || `row ${answerRowIndex + 1}`;
    const addRowLabel = !firstAnswerColumn?.preset
      ? firstColumn.addRowLabel
      : "";

    return [prefix, addRowLabel, firstAnswer, column?.header]
      .filter(Boolean)
      .join(" ");
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
    rows: SummationTableRowElement[];
  }) => {
    const firstColumn = rows?.[0] ?? {};
    const formattedRows: (JSX.Element | string | number)[][] = answer.map(
      (answerRow, answerRowIndex) => {
        const rowElements: (JSX.Element | string | number)[] = rows.map(
          (column) => {
            const answerCell = answerRow.find((t) => t.id === column.id);
            const isReadonly = answerCell?.readonly ?? readonly;
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
              label: generateAriaLabel({
                answerRow,
                answerRowIndex,
                column,
                firstColumn,
              }),
              onChange: (value) =>
                onChange?.({
                  answer,
                  id: column.id,
                  index: answerRowIndex,
                  type: formattedCell.type,
                  value,
                }),
              readonly: isReadonly,
            });
            const showRowLabel = column.addRowLabel && !answerCell?.preset;
            return showRowLabel ? (
              <Flex alignItems="end">
                {showRowLabel && (
                  <Text
                    aria-hidden="true"
                    marginBottom="spacer1"
                    marginRight="spacer2"
                  >
                    {column.addRowLabel}
                  </Text>
                )}
                <Flex direction="column" width="100%">
                  {value}
                </Flex>
              </Flex>
            ) : (
              value
            );
          }
        );
        const isPresetRow = answerRow?.some((cell) => cell.preset);
        if (readonly || isPresetRow) {
          // Empty actions column
          rowElements.push(<></>);
        } else {
          rowElements.push(
            <Flex justifyContent="center">
              <Button
                aria-label={generateAriaLabel({
                  answerRow,
                  answerRowIndex,
                  firstColumn,
                  prefix: "Delete",
                })}
                disabled={disabled}
                leftIcon={<Image src={cancelPrimary} alt="" />}
                onClick={() => onRemoveHandler(answerRowIndex)}
                variant="unstyled"
              />
            </Flex>
          );
        }
        return rowElements;
      }
    );

    return formattedRows;
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

    const currentSum = sumById(rows, id);
    const newSumRow = { id, value: currentSum, readonly: true };
    const updatedTotalRows = total.length > 0 ? [...total] : [[newSumRow]];

    for (const row of updatedTotalRows) {
      const cellToUpdate = row.find((t) => t.id === id);
      if (cellToUpdate) {
        cellToUpdate.value = currentSum;
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

    updateElement({ answer: updatedAnswer });
  };

  const onAddHandler = () => {
    const newRow = rows.map((t) => ({ id: t.id, value: "" }));
    const updatedErrorMessages = [
      ...errorMessages,
      buildEmptyErrorMessages(newRow),
    ];
    setErrorMessages(updatedErrorMessages);

    const updatedAnswer = {
      rows: [...(answer?.rows ?? []), newRow],
      total: answer?.total ?? [],
    };
    setPendingFocusIndex(updatedAnswer.rows.length - 1);
    updateElement({ answer: updatedAnswer });
  };

  const onRemoveHandler = (index: number) => {
    const answerRows = [...(answer?.rows ?? [])];
    const totalRows = [...(answer?.total ?? [])];
    answerRows.splice(index, 1);

    const updatedErrorMessages = [...errorMessages];
    updatedErrorMessages.splice(index, 1);
    setErrorMessages(updatedErrorMessages);

    const updatedTotals = rows.reduce(
      (total, column) =>
        updateTotalRows({
          id: column.id,
          rows: answerRows,
          total,
          type: column.type,
        }),
      totalRows
    );

    const updatedAnswer = {
      rows: answerRows,
      total: updatedTotals,
    };
    updateElement({ answer: updatedAnswer });
  };

  const formattedBodyRows = buildRows({
    answer: answer?.rows,
    disabled,
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

  const hasErrorMessage = (node: string | number | JSX.Element): boolean => {
    if (!node || typeof node !== "object") return false;
    if (node?.props?.errorMessage) return true;
    const children = node?.props?.children;
    if (children) {
      if (Array.isArray(children)) {
        return children.some((child) => hasErrorMessage(child));
      }
      return hasErrorMessage(children);
    }
    return false;
  };

  const styleOverride: string[] = formattedBodyRows.map((row) => {
    const hasError =
      Array.isArray(row) && row.some((cell) => hasErrorMessage(cell));
    return hasError ? "has-error" : "";
  });
  const isDisabled = disabled || !enableAddButton;

  return (
    <VStack alignItems="flex-start" gap="spacer2" width="100%">
      {ResponsiveTable({
        caption,
        footers: formattedFootRows,
        headers,
        ref: tableRef,
        rows: formattedBodyRows,
        styleOverride,
        variant: "summation",
      })}
      {addRowMax > 0 && (
        <VStack alignItems="flex-start" gap="spacer1">
          {addRowHelperText && (
            <Text variant="helperText">{addRowHelperText}</Text>
          )}
          <Button
            disabled={isDisabled}
            leftIcon={<Image src={isDisabled ? addGray : addPrimary} alt="" />}
            onClick={onAddHandler}
            onMouseDown={(evt) => evt.preventDefault()}
            variant="outline"
          >
            {addRowButtonText}
          </Button>
        </VStack>
      )}
    </VStack>
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
      return header.type === ElementType.NumberField &&
        isWholePositiveNumber(cell.value)
        ? maskByType(MaskType.CommaSeparated, cell.value)
        : cell.value.toString();
    });
  };

  const footers = element.answer?.total?.map(buildRow) || [];
  const rows = element.answer?.rows.map(buildRow) || [];

  return (
    <Stack key={element.id}>
      {ResponsiveTable({
        caption: element.id,
        footers,
        headers,
        rows,
        variant: "pdf",
      })}
    </Stack>
  );
};
