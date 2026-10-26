import { Box, Stack } from "@chakra-ui/react";
import {
  ElementType,
  PageElement,
  FieldGroupTemplate,
  FieldGroupElement,
} from "@pasrr/shared";
import { Page } from "components";
import { PageElementProps, SubHeaderElement } from "../report/Elements";
import { renderReportTable } from "components/export/ExportedReportWrapper";

export const FieldGroup = (props: PageElementProps<FieldGroupTemplate>) => {
  const { id, label, helperText, elements, headingLevel = 3 } = props.element;

  const subHeaderElement: PageElement = {
    id: `${id}-subheader`,
    type: ElementType.SubHeader,
    text: label,
    helperText,
    headingLevel,
    noWrapper: true,
  };

  const setFieldGroupElements = (element: PageElement[]) => {
    const updatedElement = element as FieldGroupElement[];

    props.updateElement({
      elements: updatedElement,
      answer: updatedElement.map((t) => ({
        id: t.id,
        value: t.answer ?? "",
      })),
    });
  };

  return (
    <Box as="fieldset" width="100%">
      <Box as="legend" marginBottom={"spacer2"} marginTop={0}>
        <SubHeaderElement element={subHeaderElement} />
      </Box>
      <Page
        id="field-group-children"
        setElements={setFieldGroupElements}
        elements={elements}
      />
    </Box>
  );
};

export const FieldGroupExport = (element: FieldGroupTemplate) => {
  const tableResponses = element.elements.map((t) => ({
    id: t.id,
    indicator: t.label,
    response: t.answer,
    required: t.required,
  }));
  const subHeaderElement: PageElement = {
    id: `${element.id}-subheader`,
    type: ElementType.SubHeader,
    text: element.label,
    helperText: element.helperText,
    headingLevel: element.headingLevel ?? 3,
  };
  return (
    <Stack width="720px" key={element.id}>
      <SubHeaderElement element={subHeaderElement} />
      {renderReportTable(tableResponses)}
    </Stack>
  );
};
