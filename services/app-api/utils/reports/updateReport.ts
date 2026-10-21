import { User } from "../../types/types";
import {
  AccordionGroupItem,
  AccordionGroupTemplate,
  CheckboxTemplate,
  ChoiceTemplate,
  DropdownTemplate,
  ElementType,
  FieldGroupTemplate,
  PageElement,
  RadioTemplate,
  Report,
  ReportStatus,
} from "@pasrr/shared";
import { getReport as getReportFromDatabase } from "../../storage/reports";
import { isAdminUser } from "../authorization";

export const updateStatePolicyCommitments = (
  accordions: AccordionGroupItem[],
  requestAccordions: AccordionGroupItem[],
  user: User
) => {
  for (const accordionItem of accordions) {
    const requestAccordionItem = requestAccordions.find(
      (newAccordionItem) => newAccordionItem.label === accordionItem.label
    );
    if (!requestAccordionItem) continue;
    updateElements(accordionItem.elements, requestAccordionItem.elements, user);
  }
};

export const updateChoiceTemplates = (
  choiceTemplates: ChoiceTemplate[],
  requestChoiceTemplates: ChoiceTemplate[],
  user: User
) => {
  for (const choiceTemplate of choiceTemplates) {
    const requestTemplate = requestChoiceTemplates.find(
      (template) => template.label === choiceTemplate.label
    );
    if (
      !requestTemplate ||
      !choiceTemplate.checkedChildren ||
      !requestTemplate.checkedChildren
    )
      continue;
    updateElements(
      choiceTemplate.checkedChildren,
      requestTemplate.checkedChildren,
      user
    );
  }
};

export const updateElements = (
  elements: PageElement[],
  requestElements: PageElement[],
  user: User
) => {
  for (const element of elements) {
    const requestElement =
      requestElements.find((newElement) => newElement.id === element.id) ??
      ({} as PageElement);

    switch (element.type) {
      // Handle nested elements
      case ElementType.AccordionGroup:
        updateStatePolicyCommitments(
          element.accordions,
          (requestElement as AccordionGroupTemplate).accordions,
          user
        );
        break;

      case ElementType.FieldGroup:
        updateElements(
          element.elements,
          (requestElement as FieldGroupTemplate).elements,
          user
        );
        break;

      case ElementType.Checkbox:
      case ElementType.Radio:
        updateChoiceTemplates(
          element.choices,
          (requestElement as CheckboxTemplate | RadioTemplate).choices,
          user
        );
        break;

      case ElementType.Dropdown:
        updateChoiceTemplates(
          element.options,
          (requestElement as DropdownTemplate).options,
          user
        );
        break;
    }

    if (!("answer" in requestElement)) {
      continue;
    }
    if (
      "onlyCmsAdminCanEdit" in element &&
      element.onlyCmsAdminCanEdit &&
      !isAdminUser(user)
    ) {
      continue;
    }
    if (element.type === requestElement.type) {
      element.answer = requestElement.answer;
    }
  }
};

export const updateReportAnswers = async (
  reportRequest: Report,
  user: User
) => {
  const { id, pages: newPages, state, type } = reportRequest;

  const report = await getReportFromDatabase(type, state, id!);
  if (!report) return;

  report.status = ReportStatus.IN_PROGRESS;
  report.lastEdited = Date.now();
  report.lastEditedBy = user.fullName;

  for (const page of report.pages) {
    let requestPage = newPages.find((newPage) => newPage.id === page.id);

    if (!page.elements || !requestPage || !requestPage.elements) continue;
    updateElements(page.elements, requestPage.elements, user);
  }
  return report;
};

// Goes through the whole report and only updates the elements that have the cmsAdminCanEditInSubmitted flag set to true
const updatePrivilegedPageElements = (
  elements: PageElement[],
  requestElements: PageElement[]
) => {
  for (const element of elements) {
    if (element.type === ElementType.AccordionGroup) {
      const reqGroup = requestElements.find(
        (el) => el.id === element.id
      ) as AccordionGroupTemplate;
      if (!reqGroup) continue;
      for (const accordion of element.accordions) {
        const reqAccordion = reqGroup.accordions.find(
          (a) => a.label === accordion.label
        );
        if (!reqAccordion) continue;
        updatePrivilegedPageElements(accordion.elements, reqAccordion.elements);
      }
      continue;
    }

    if (
      !(
        "cmsAdminCanEditInSubmitted" in element &&
        element.cmsAdminCanEditInSubmitted
      )
    )
      continue;
    const reqEl = requestElements.find((el) => el.id === element.id);
    if (!reqEl || !("answer" in reqEl) || reqEl.type !== element.type) continue;
    element.answer = reqEl.answer;
  }
};

export const updatePrivilegedFieldsOnly = async (
  reportRequest: Report,
  user: User
) => {
  const { id, pages: newPages, state, type } = reportRequest;
  const report = await getReportFromDatabase(type, state, id!);
  if (!report) return;

  report.lastEdited = Date.now();
  report.lastEditedBy = user.fullName;

  for (const page of report.pages) {
    const requestPage = newPages.find((p) => p.id === page.id);
    if (!page.elements || !requestPage?.elements) continue;
    updatePrivilegedPageElements(page.elements, requestPage.elements);
  }
  return report;
};
