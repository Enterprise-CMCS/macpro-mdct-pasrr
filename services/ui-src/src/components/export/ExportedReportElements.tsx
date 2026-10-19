import { Heading } from "@chakra-ui/react";
import { ElementType, PageElement } from "@pasrr/shared";
import { notAnsweredText } from "../../constants";
import { ActionTableExport } from "components/fields/ActionTable";
import { parseHtml } from "utils";
import { AttachmentAreaExport } from "components/fields/AttachmentArea";

// TODO: add PASRR-specific paragraph ids that should render in exports once
// the PASRR report schema is defined.
const specificIds: string[] = [];

//elements that are rendered as part of the table that does not need a unique renderer
const tableElementList = [
  ElementType.Textbox,
  ElementType.Radio,
  ElementType.TextAreaField,
  ElementType.NumberField,
  ElementType.Dropdown,
  ElementType.ListInput,
  ElementType.AttachmentArea,
];

const renderElementList = [
  ...tableElementList,
  ElementType.SubHeader,
  ElementType.Paragraph,
  ElementType.ActionTable,
];

export const shouldUseTable = (type: ElementType) => {
  return tableElementList.includes(type);
};

export const renderElements = (element: PageElement) => {
  const { type } = element;
  if (!renderElementList.includes(type)) return;

  switch (type) {
    case ElementType.SubHeader:
      return (
        <Heading as="h3" variant="nestedHeading" my="2rem" key={element.id}>
          {element.text}
        </Heading>
      );
    case ElementType.Paragraph:
      if (specificIds.includes(element.id))
        return <div key={element.id}>{parseHtml(element.text)}</div>;
      return;
    case ElementType.AttachmentArea:
      return AttachmentAreaExport(element);
    case ElementType.ActionTable:
      return ActionTableExport(element);
    case ElementType.AccordionGroup:
      return "";
  }

  if (!("answer" in element)) {
    return notAnsweredText;
  }

  return element.answer ?? notAnsweredText;
};
