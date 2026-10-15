import React, { useState, useEffect } from "react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { optionalTag, parseHintText, useStore } from "utils";
import {
  TextboxTemplate,
  NumberFieldTemplate,
  ElementType,
} from "@pasrr/shared";
import { PageElementProps } from "../report/Elements";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { ErrorMessages } from "../../constants";
import {
  isEmail,
  isPhone,
  maskByType,
  parseNumber,
  stringifyInput,
} from "utils/validation/inputValidation";

export const TextField = (
  props: PageElementProps<TextboxTemplate | NumberFieldTemplate>
) => {
  const { setModalComponent } = useStore();
  const { element: textbox, disabled } = props;
  const stringifyAnswer = (newAnswer: typeof textbox.answer) => {
    if (textbox.mask) {
      newAnswer = maskByType(textbox.mask, newAnswer);
    }
    if (textbox.type === ElementType.NumberField) {
      return stringifyInput(newAnswer as number);
    }

    return newAnswer ?? "";
  };

  const defaultValue = stringifyAnswer(textbox?.answer);
  const [displayValue, setDisplayValue] = useState(defaultValue);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasFocus, setHasFocus] = useState(false);

  const hideElement = useElementIsHidden(textbox.hideCondition);

  useEffect(() => {
    const defaultValueString = stringifyInput(displayValue);
    // Clear error message by default
    setErrorMessage("");

    switch (true) {
      case !defaultValueString:
        break;
      case textbox.id.includes("email") && !isEmail(defaultValueString):
        setErrorMessage(ErrorMessages.mustBeAnEmail);
        break;
      case textbox.id.includes("phone") && !isPhone(defaultValueString):
        setErrorMessage(ErrorMessages.mustBeAPhone);
        break;
    }
  }, []);

  useEffect(() => {
    /*
     * We need to listen for answer updates.
     * But we don't want to overwrite input contents while the user is typing.
     * This only comes up if a valid answer becomes invalid mid-typing.
     * For example, typing "123abc" into a number field. The values saved up to
     * the store will be: 1, 12, 123, undefined, undefined, undefined.
     * Each of these will immediately be passed back down through the props.
     * When the 1st `undefined` comes through, if we neglect to check for focus,
     * we will wipe out the data, and the textbox will end up with just "bc".
     */
    if (!hasFocus) {
      setDisplayValue(stringifyAnswer(textbox.answer));
    }
  }, [textbox.answer]);

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value;
    setDisplayValue(rawValue);
    // Clear error message by default
    setErrorMessage("");

    switch (textbox.type) {
      case ElementType.NumberField: {
        const updateElement = (props as PageElementProps<NumberFieldTemplate>)
          .updateElement;
        const parsedValue = parseNumber(rawValue);
        updateElement({ answer: parsedValue });

        const valueIsNonNumeric = rawValue && parsedValue === undefined;
        if (!rawValue && textbox.required) {
          setErrorMessage(ErrorMessages.requiredResponse);
        } else if (valueIsNonNumeric) {
          setErrorMessage(ErrorMessages.mustBeANumber);
        }
        break;
      }
      case ElementType.Textbox: {
        const updateElement = (props as PageElementProps<TextboxTemplate>)
          .updateElement;
        updateElement({ answer: rawValue });

        // Order by match priority
        const validations = [
          {
            match: !rawValue && textbox.required,
            message: ErrorMessages.requiredResponse,
          },
          {
            match: textbox.id.includes("email") && !isEmail(rawValue),
            message: ErrorMessages.mustBeAnEmail,
          },
          {
            match: textbox.id.includes("phone") && !isPhone(rawValue),
            message: ErrorMessages.mustBeAPhone,
          },
        ];

        const failedValidation = validations.find((v) => v.match);
        if (failedValidation) {
          setErrorMessage(failedValidation.message);
        }
        break;
      }
    }
  };

  const onBlurHandler = () => {
    // When the user is done typing, overwrite the answer with the parsed value.
    setHasFocus(false);
    // Need to save the masked value to the store if the textbox has a mask
    if (textbox.type === ElementType.Textbox && textbox.mask) {
      const updateElement = (props as PageElementProps<TextboxTemplate>)
        .updateElement;
      const maskedAnswer = maskByType(textbox.mask, displayValue);
      updateElement({ answer: maskedAnswer });
      setDisplayValue(maskedAnswer);
    } else {
      setDisplayValue(stringifyAnswer(textbox.answer));
    }
    if (!textbox.answer && textbox.required) {
      setErrorMessage(ErrorMessages.requiredResponse);
    }
  };

  const parsedHint = parseHintText(textbox, setModalComponent);

  if (hideElement) {
    return null;
  }

  return (
    <Box width="100%">
      <CmsdsTextField
        name={textbox.id}
        label={optionalTag(textbox)}
        hint={parsedHint}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        onFocus={() => setHasFocus(true)}
        value={displayValue}
        errorMessage={errorMessage}
        disabled={disabled || textbox.disabled}
        fieldClassName={textbox.type}
      />
    </Box>
  );
};
