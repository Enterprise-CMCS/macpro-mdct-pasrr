import {
  TextField,
  SingleInputDateField,
  Dropdown,
  DropdownOption,
} from "@cmsgov/design-system";
import { ErrorMessages } from "../../../constants";
import {
  ActionElement,
  ElementType,
  SummationTableRowAnswerShape,
} from "@pasrr/shared";
import {
  isEmptyValue,
  isWholePositiveNumber,
  parseNumber,
  maskByType,
  validateDate,
} from "utils/validation/inputValidation";

export const buildElement = ({
  defaultValue,
  element,
  errorMessage,
  id,
  key,
  label,
  onChange,
  readonly = false,
}: {
  defaultValue: string | number;
  element: ActionElement;
  errorMessage?: string;
  id: string;
  key: string;
  label?: string;
  onChange: (value: string[]) => void;
  readonly?: boolean;
}) => {
  let type = element.type;
  const children = "children" in element ? element.children : [];

  if (
    [ElementType.NumberField, ElementType.Textbox].includes(type) &&
    readonly
  ) {
    type = ElementType.Paragraph;
  }

  switch (type) {
    case ElementType.Paragraph:
      return element.mask
        ? maskByType(element.mask, defaultValue)
        : defaultValue;
    case ElementType.Dropdown:
      return (
        <Dropdown
          key={`dropdown-${key}`}
          name={id}
          label={label}
          onChange={(event) => {
            onChange([event.target.value]);
          }}
          options={children as DropdownOption[]}
          value={defaultValue}
          errorMessage={errorMessage}
          disabled={element.disabled}
          hint={element.hintText ?? ""}
        />
      );
    case ElementType.Textbox:
      return (
        <TextField
          key={`textbox-${key}`}
          label={label}
          name={id}
          onChange={(event) => {
            onChange([event.target.value]);
          }}
          onBlur={(event) => {
            onChange([event.target.value]);
          }}
          value={defaultValue}
          errorMessage={errorMessage}
          disabled={element.disabled}
        />
      );
    case ElementType.NumberField:
      return (
        <TextField
          key={`textbox-${key}`}
          label={label}
          name={id}
          onChange={(event) => {
            onChange([event.target.value]);
          }}
          onBlur={(event) => {
            onChange([event.target.value]);
          }}
          value={
            element.mask ? maskByType(element.mask, defaultValue) : defaultValue
          }
          errorMessage={errorMessage}
          disabled={element.disabled}
        />
      );
    case ElementType.TextAreaField:
      return (
        <TextField
          key={`textarea-${key}`}
          label={label}
          name={id}
          onChange={(event) => {
            onChange([event.target.value]);
          }}
          onBlur={(event) => {
            onChange([event.target.value]);
          }}
          value={defaultValue}
          errorMessage={errorMessage}
          multiline
          rows={3}
          disabled={element.disabled}
        />
      );
    case ElementType.Date:
      return (
        <SingleInputDateField
          key={`date-${key}`}
          name={id}
          label={label}
          onChange={(_rawValue: string, maskedValue: string) => {
            onChange([_rawValue, maskedValue]);
          }}
          value={defaultValue as string}
          errorMessage={errorMessage}
          disabled={element.disabled}
        />
      );
    default:
      console.error("missing: " + element);
      return null;
  }
};

export const getErrorMessage = ({
  required = true,
  type,
  validators = {},
  value,
}: {
  required?: boolean;
  type: string;
  validators?: {
    [key: string]: (value: string) => boolean;
  };
  value: string[];
}) => {
  if (isEmptyValue(value[0]) && required) {
    return ErrorMessages.requiredResponse;
  }

  switch (type) {
    case ElementType.NumberField:
      if (validators?.[type] && !validators[type](value[0])) {
        return ErrorMessages.mustBeANumber;
      }
      if (parseNumber(value[0]) === undefined) {
        return ErrorMessages.mustBeANumber;
      }
      break;
    case ElementType.Date:
      const { errorMessage } = validateDate(value[0], value[1], true);
      return errorMessage;
  }

  return "";
};

export const sumById = (rows: SummationTableRowAnswerShape[], id: string) =>
  rows.reduce((sum, row) => {
    const cell = row.find((t) => t.id === id);
    return sum + (isWholePositiveNumber(cell?.value) ? Number(cell?.value) : 0);
  }, 0);

export const getNonPresetRows = (
  answerRows: SummationTableRowAnswerShape[] = []
) => answerRows.filter((answerRow) => answerRow.every((cell) => !cell.preset));
