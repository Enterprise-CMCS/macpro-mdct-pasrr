import React, { useEffect, useRef, useState } from "react";
import { ListInputTemplate } from "@pasrr/shared";
import { PageElementProps } from "components/report/Elements";
import { Button, HStack, Image } from "@chakra-ui/react";
import { Hint, TextField } from "@cmsgov/design-system";
import cancelPrimary from "assets/icons/cancel/icon_cancel_primary.svg";
import addPrimary from "assets/icons/add/icon_add_blue.svg";
import addGray from "assets/icons/add/icon_add_gray.svg";
import { ErrorMessages } from "../../constants";

const validateField = (rawValue: string, validation: string | undefined) => {
  let validationError = undefined;
  if (validation === "link") {
    const isValid = URL.canParse(rawValue);
    if (!isValid) validationError = ErrorMessages.mustBeALink;
  }
  return validationError;
};

export const ListInput = (props: PageElementProps<ListInputTemplate>) => {
  const { updateElement, disabled, element } = props;
  const {
    id,
    fieldLabel,
    helperText,
    buttonText,
    answer,
    validation,
    disabled: elementDisabled,
  } = element;
  // A list always has at least one field, so start with a blank one when there are no saved answers.
  const [displayValue, setDisplayValue] = useState(
    answer?.length ? answer : [""]
  );
  const [errorMessages, setErrorMessages] = useState([""]);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const [pendingFocusIndex, setPendingFocusIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (pendingFocusIndex === null) return;
    fieldsetRef.current
      ?.querySelector<HTMLInputElement>(
        `input[name="list-item-${pendingFocusIndex}"]`
      )
      ?.focus();
    setPendingFocusIndex(null);
  }, [pendingFocusIndex]);

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const rawValue = event.target.value;
    const newDisplay = [...displayValue];
    newDisplay[index] = rawValue;
    setDisplayValue(newDisplay);

    const newErrorMessages = [...errorMessages];
    const validationError = validateField(rawValue, validation);
    if (!rawValue) {
      newErrorMessages[index] = ErrorMessages.requiredResponse;
    } else if (validationError) {
      newErrorMessages[index] = validationError;
    } else {
      newErrorMessages[index] = "";
    }
    setErrorMessages(newErrorMessages);

    updateElement({ answer: newDisplay });
  };

  const onAddHandler = () => {
    const newDisplay = [...displayValue, ""];
    setDisplayValue(newDisplay);
    const newErrorMessages = [...errorMessages, ""];
    setErrorMessages(newErrorMessages);
    setPendingFocusIndex(newDisplay.length - 1);
    updateElement({ answer: newDisplay });
  };

  const onRemoveHandler = (index: number) => {
    const newDisplay = [...displayValue];
    newDisplay.splice(index, 1);
    setDisplayValue(newDisplay);
    const newErrorMessages = [...errorMessages];
    newErrorMessages.splice(index, 1);
    setErrorMessages(newErrorMessages);
    updateElement({ answer: newDisplay });
  };

  const isDisabled = () => {
    return disabled || elementDisabled;
  };

  return (
    <fieldset ref={fieldsetRef} key="list-input-field">
      <Hint id={id}>{helperText}</Hint>
      {displayValue.map((field, index) => (
        <HStack
          alignItems="flex-end"
          mt={index > 0 ? "1rem" : undefined}
          key={`list-item-stack-${index}`}
        >
          <TextField
            key={`list-item-${index}`}
            name={`list-item-${index}`}
            label={fieldLabel}
            value={field}
            onChange={(evt) => onChangeHandler(evt, index)}
            onBlur={(evt) => onChangeHandler(evt, index)}
            errorMessage={errorMessages?.[index]}
            disabled={isDisabled()}
          />
          {displayValue.length > 1 && (
            <Button
              variant="unstyled"
              onClick={() => onRemoveHandler(index)}
              disabled={isDisabled()}
              aria-label={`Remove ${fieldLabel} ${index + 1}`}
              leftIcon={<Image src={cancelPrimary} alt="Remove" />}
            />
          )}
        </HStack>
      ))}
      <Button
        mt="spacer3"
        variant="outline"
        leftIcon={<Image src={isDisabled() ? addGray : addPrimary} alt="Add" />}
        onClick={onAddHandler}
        disabled={isDisabled()}
      >
        {buttonText}
      </Button>
    </fieldset>
  );
};
