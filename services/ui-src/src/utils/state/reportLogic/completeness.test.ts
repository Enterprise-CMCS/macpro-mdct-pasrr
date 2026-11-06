import {
  ActionTableTemplate,
  dropdownEmptyOption,
  ElementType,
  FormPageTemplate,
  ListInputTemplate,
  PageElement,
  PageStatus,
  RadioTemplate,
  Report,
  TextboxTemplate,
} from "@pasrr/shared";
import {
  elementSatisfiesRequired,
  inferredReportStatus,
  pageInProgress,
  pageIsCompletable,
} from "./completeness";

describe("inferredReportStatus", () => {
  test("handles different rollup types", () => {
    const report = {
      pages: [
        {
          id: "mock-page-id",
          required: true,
          title: "a title",
          elements: [
            {
              id: "mock_textboxId",
              type: ElementType.Textbox,
              answer: "Good",
              required: true,
            },
          ],
        },
        {
          id: "mock-page-id-2",
          required: true,
          title: "a title",
          elements: [
            {
              id: "mock_textboxNoAnswerId",
              type: ElementType.Textbox,
              answer: undefined,
              required: true,
            },
          ],
        },
      ],
    } as any;
    expect(inferredReportStatus(report, "mock-page-id")).toEqual(
      PageStatus.COMPLETE
    );
    expect(inferredReportStatus(report, "mock-page-id-2")).toEqual(
      PageStatus.NOT_STARTED
    );
  });
});

describe("pageInProgress", () => {
  const isInProgress = (element: object) => {
    const report = {
      pages: [
        {
          id: "mock-page-id",
          elements: [element as PageElement],
        },
      ],
    } as Report;
    return pageInProgress(report, "mock-page-id");
  };

  test("should treat missing or empty answers as not in progress", () => {
    expect(isInProgress({})).toBe(false);
    expect(isInProgress({ answer: undefined })).toBe(false);
    expect(isInProgress({ answer: "" })).toBe(false);
  });

  test("should treat numeric answers as in progress", () => {
    expect(isInProgress({ answer: 0 })).toBe(true);
    expect(isInProgress({ answer: 42 })).toBe(true);
  });

  test("should treat empty answer objects as not in progress", () => {
    expect(isInProgress({ answer: {} })).toBe(false);
    expect(isInProgress({ answer: [] })).toBe(false);
    expect(isInProgress({ answer: [{}, {}] })).toBe(false);
    expect(isInProgress({ answer: { x: [{}] } })).toBe(false);
  });

  test("should treat answers with data in progress", () => {
    expect(isInProgress({ answer: "hello" })).toBe(true);
    expect(isInProgress({ answer: [1, 2] })).toBe(true);
    expect(isInProgress({ answer: [{ x: 42 }] })).toBe(true);
    expect(isInProgress({ answer: { x: [96, 78] } })).toBe(true);
  });

  test("should treat unknown data types as in progress", () => {
    // We don't, and should never, have a BigInt answer type. But if we did:
    expect(isInProgress({ answer: 99n })).toBe(true);
  });
});

describe("pageIsCompletable", () => {
  test("handles empty conditions", () => {
    const missingPageReport = {
      pages: [] as FormPageTemplate[],
    } as Report;
    expect(pageIsCompletable(missingPageReport, "root")).toBeFalsy();

    const noElementsOnPage = {
      pages: [{ id: "root" }],
    } as Report;
    expect(pageIsCompletable(noElementsOnPage, "root")).toBeTruthy();
  });

  test("false when incomplete element", () => {
    const report = {
      pages: [
        {
          id: "mock-page-id",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              id: "mock_badQuestionId",
              type: ElementType.TextAreaField,
              answer: undefined,
              required: true,
            },
            {
              id: "mock_badRadioQuestionId",
              type: ElementType.Radio,
              answer: undefined,
              required: true,
              choices: [
                {
                  label: "Choice 1",
                  value: "A",
                  checked: false,
                },
                {
                  label: "Choice 2",
                  value: "B",
                  checked: false,
                },
                {
                  label: "Choice 3",
                  value: "C",
                  checked: false,
                },
              ],
            },
            {
              id: "mock_badDropdownQuestionId",
              type: ElementType.Dropdown,
              answer: "",
              required: true,
              options: [
                dropdownEmptyOption,
                { label: "2026", value: "2026" },
                { label: "2027", value: "2027" },
              ],
            },
          ],
        },
      ],
    } as Report;
    expect(pageIsCompletable(report, "mock-page-id")).toBeFalsy();
  });

  test("succeeds when complete element", () => {
    const report = {
      pages: [
        {
          id: "mock-page-id",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              id: "mock_textboxId",
              type: ElementType.TextAreaField,
              answer: "mock text",
              required: true,
            },
            {
              id: "mock_radioId",
              type: ElementType.Radio,
              answer: "A",
              required: true,
              choices: [
                {
                  label: "Choice 1",
                  value: "A",
                  checked: false,
                },
                {
                  label: "Choice 2",
                  value: "B",
                  checked: false,
                },
                {
                  label: "Choice 3",
                  value: "C",
                  checked: false,
                },
              ],
            },
            {
              id: "mock_hiddenElementId",
              type: ElementType.TextAreaField,
              answer: undefined,
              required: true,
              hideCondition: {
                controllerElementId: "mock_radioId",
                answer: "A",
              },
            },
            {
              id: "mock_dropdownId",
              type: ElementType.Dropdown,
              answer: "2026",
              required: true,
              options: [
                dropdownEmptyOption,
                { label: "2026", value: "2026" },
                { label: "2027", value: "2027" },
              ],
            },
          ],
        },
      ],
    } as Report;
    expect(pageIsCompletable(report, "mock-page-id")).toBeTruthy();
  });

  test("is completable when element type is an AccordionGroup", () => {
    const report = {
      pages: [
        {
          id: "mock-page-id",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              type: ElementType.AccordionGroup,
              id: "mock_accordionGroupId",
              accordions: [
                {
                  label: "",
                  elements: [
                    {
                      id: "mock_accordionId_textboxId",
                      type: ElementType.Textbox,
                      answer: "WOW",
                      required: true,
                    },
                  ],
                },
              ],
              required: true,
            },
          ],
        },
      ],
    } as Report;
    expect(pageIsCompletable(report, "mock-page-id")).toBeTruthy();
  });

  test("is completable when element type is fieldGroup", () => {
    const report = {
      pages: [
        {
          id: "mock-page-id",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              type: ElementType.FieldGroup,
              id: "mock_fieldGroupId",
              elements: [
                {
                  type: ElementType.Textbox,
                  id: "mock_textboxId",
                  required: true,
                  answer: "mock text",
                },
              ],
              answer: [{ id: "mock_textboxId", value: "mock text" }],
              required: true,
            },
          ],
        },
      ],
    } as Report;
    expect(pageIsCompletable(report, "mock-page-id")).toBeTruthy();
  });
});

describe("elementSatisfiesRequired", () => {
  test("returns true when hidden or not required", () => {
    const hiddenElement: TextboxTemplate = {
      id: "mock_hiddenElementId",
      label: "hidden textbox",
      answer: "foo",
      type: ElementType.Textbox,
      required: true,
    };
    const notRequired: TextboxTemplate = {
      id: "mock_notRequiredElementId",
      label: "optional textbox",
      answer: "foo",
      type: ElementType.Textbox,
      required: false,
    };
    const otherElement: TextboxTemplate = {
      id: "mock_otherElementId",
      label: "irrelevant other textbox",
      answer: "foo",
      type: ElementType.Textbox,
      required: false,
    };
    const elements = [otherElement, hiddenElement, notRequired];
    expect(elementSatisfiesRequired(hiddenElement, elements)).toBeTruthy();
    expect(elementSatisfiesRequired(notRequired, elements)).toBeTruthy();
  });

  test("handles radios", () => {
    const radio = {
      id: "mock_radioId",
      answer: "foo",
      type: ElementType.Radio,
      choices: [
        {
          label: "me",
          value: "me",
        },
      ],
      required: true,
    } as RadioTemplate;
    const incompleteChildren = {
      id: "mock_incompleteChildrenId",
      answer: "me",
      type: ElementType.Radio,
      choices: [
        {
          label: "me",
          value: "me",
          checkedChildren: [
            {
              type: ElementType.Textbox,
              answer: undefined,
              required: true,
            },
          ],
        },
      ],
      required: true,
    } as RadioTemplate;
    const radios = [radio, incompleteChildren];
    expect(elementSatisfiesRequired(radio, radios)).toBeTruthy();
    expect(elementSatisfiesRequired(incompleteChildren, radios)).toBeFalsy();
  });

  test("reject incomplete ListInput", () => {
    const element = {
      type: ElementType.ListInput,
      required: false,
      answer: [""],
    } as ListInputTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
  });

  test("required ListInput is incomplete until a value is entered", () => {
    const element = {
      type: ElementType.ListInput,
      required: true,
    } as ListInputTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeFalsy();

    const answered = { ...element, answer: ["data source"] };
    expect(elementSatisfiesRequired(answered, [answered])).toBeTruthy();
  });

  test("handles Metrics Table", () => {
    const element = {
      type: ElementType.ActionTable,
      id: "mock_actionTableId",
      label: "action table",
      heading: "Heading",
      modal: { title: "", elements: [] },
      rows: [
        {
          id: "mock_actionTableId_textboxId",
          type: ElementType.Paragraph,
          header: "",
        },
      ],
      answer: [[{ id: "mock_actionTableId_textboxId", value: "2" as string }]],
      required: true,
    } as ActionTableTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
  });

  test("ignores optional Metrics Table columns", () => {
    const element = {
      type: ElementType.ActionTable,
      id: "mock_actionTableId",
      label: "action table",
      heading: "Heading",
      modal: {
        title: "",
        elements: [
          {
            id: "mock_actionTableId_textboxId",
            type: ElementType.Textbox,
            required: true,
          },
          {
            id: "mock_actionTableId_textboxOptionalId",
            type: ElementType.Textbox,
            required: false,
          },
        ],
      },
      rows: [
        {
          id: "mock_actionTableId_textboxId",
          type: ElementType.Paragraph,
          header: "",
        },
      ],
      answer: [
        [
          { id: "status", value: "Active" },
          { id: "mock_actionTableId_textboxId", value: "complete" },
          { id: "mock_actionTableId_textboxOptionalId", value: "" },
        ],
      ],
      required: true,
    } as ActionTableTemplate;

    expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
  });

  test("handles invalid email field", () => {
    const element = {
      type: ElementType.Textbox,
      id: "mock_textboxId_email",
      required: true,
    } as TextboxTemplate;
    const invalidEmail = {
      ...element,
      answer: "not-a-valid-email",
    };
    const validEmail = {
      ...element,
      answer: "test@email.com",
    };
    expect(elementSatisfiesRequired(invalidEmail, [invalidEmail])).toBeFalsy();
    expect(elementSatisfiesRequired(validEmail, [validEmail])).toBeTruthy();
  });

  test("handles invalid phone field", () => {
    const element = {
      type: ElementType.Textbox,
      id: "mock_textboxId_phone",
      required: true,
    } as TextboxTemplate;
    const invalidPhone = {
      ...element,
      answer: "not-a-valid-phone",
    };
    const validPhone = {
      ...element,
      answer: "555-555-5555",
    };
    expect(elementSatisfiesRequired(invalidPhone, [invalidPhone])).toBeFalsy();
    expect(elementSatisfiesRequired(validPhone, [validPhone])).toBeTruthy();
  });

  test("handles invalid zip code field", () => {
    const element = {
      type: ElementType.Textbox,
      id: "mock_textboxId_zipCode",
      required: true,
    } as TextboxTemplate;
    const invalidZipCode = {
      ...element,
      answer: "not-a-valid-zipCode",
    };
    const validZipCode = {
      ...element,
      answer: "55555",
    };
    expect(
      elementSatisfiesRequired(invalidZipCode, [invalidZipCode])
    ).toBeFalsy();
    expect(elementSatisfiesRequired(validZipCode, [validZipCode])).toBeTruthy();
  });
});
