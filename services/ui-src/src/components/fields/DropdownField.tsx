import { useState, useEffect } from "react";
import { PageElementProps } from "components/report/Elements";
import { DropdownTemplate } from "@pasrr/shared";
import {
  Dropdown as CmsdsDropdownField,
  DropdownChangeObject,
} from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { optionalTag, parseHtml } from "utils";
import { ErrorMessages } from "../../constants";

export const DropdownField = (props: PageElementProps<DropdownTemplate>) => {
  /**
   * TODO:
   * https://design.cms.gov/components/dropdown/?theme=core
   * WCAG 2.1 Level AA Conformance missing - Roll as custom dropdown
   */
  const dropdown = props.element;
  const defaultValue = dropdown.answer ?? dropdown.options[0].value;
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);
  const [errorMessage, setErrorMessage] = useState("");

  // Need to listen to prop updates from the parent for events
  useEffect(() => {
    setDisplayValue(dropdown.answer ?? dropdown.options[0].value);
  }, [dropdown.answer]);

  const onChangeHandler = async (event: DropdownChangeObject) => {
    const value = event.target.value;
    const isEmptyAndRequired = value === "" && dropdown.required;
    setDisplayValue(value);
    setErrorMessage(isEmptyAndRequired ? ErrorMessages.requiredResponse : "");
    props.updateElement({ answer: value });
  };

  const parsedHint = dropdown.helperText && parseHtml(dropdown.helperText);

  return (
    <Box width="100%" sx={sx.container}>
      <CmsdsDropdownField
        name={dropdown.id}
        label={optionalTag(dropdown)}
        hint={parsedHint}
        onChange={onChangeHandler}
        options={dropdown.options}
        value={displayValue}
        disabled={props.disabled || dropdown.disabled}
        errorMessage={errorMessage}
      />
    </Box>
  );
};

const sx = {
  container: {
    ".ds-c-dropdown__menu-container": {
      zIndex: "1001",
    },
  },
};
