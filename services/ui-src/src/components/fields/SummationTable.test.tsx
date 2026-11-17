import { SummationTable } from "components";
import { useState } from "react";
import { MockedFunction } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUseStore } from "utils/testing/setupTest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import {
  ElementType,
  getResidentDispositionsPresetRowsAndAnswer,
  MaskType,
  SummationTableTemplate,
} from "@pasrr/shared";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockImplementation(
  (selector?: (state: typeof mockUseStore) => unknown) => {
    if (selector) {
      return selector(mockUseStore);
    }
    return mockUseStore;
  }
);

const id = "mock_summationTableId";

const mockedSummationTableElement: SummationTableTemplate = {
  id,
  type: ElementType.SummationTable,
  caption: "Summation Table",
  required: true,
  rows: [
    {
      id: `${id}_textboxId`,
      header: "Textbox",
      type: ElementType.Textbox,
      addRowLabel: "Other:",
    },
    {
      id: `${id}_numberFieldId`,
      header: "NumberField",
      type: ElementType.NumberField,
    },
    {
      id: `${id}_numberFieldWithMaskId`,
      header: "NumberField Mask",
      type: ElementType.NumberField,
      mask: MaskType.CommaSeparated,
    },
  ],
  answer: {
    rows: [[{ id: `${id}_textboxId`, value: "mock text" }]],
    total: [],
  },
};

const updateSpy = vi.fn();

const SummationTableWrapper = ({
  template,
}: {
  template: SummationTableTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <SummationTable element={element} updateElement={onChange} />;
};

describe("<SummationTable />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("SummationTable is visible", () => {
    render(<SummationTableWrapper template={mockedSummationTableElement} />);
    const table = screen.getByRole("table", { name: "Summation Table" });
    expect(table).toBeVisible();

    const textbox = screen.getByRole("textbox", {
      name: "Other: mock text Textbox",
    });
    expect(textbox).toBeVisible();
    expect(textbox).toHaveValue("mock text");

    const numberField = screen.getByRole("textbox", {
      name: "Other: mock text NumberField",
    });
    expect(numberField).toBeVisible();
    expect(numberField).toHaveValue("");
  });

  test("SummationTable adds and deletes a new row", async () => {
    render(
      <SummationTableWrapper
        template={{
          ...mockedSummationTableElement,
          addRowMax: 2,
        }}
      />
    );
    const rowGroups = screen.getAllByRole("rowgroup");
    const [_, tbody] = rowGroups;
    const addRowButton = screen.getByRole("button", {
      name: "Add row",
    });
    const deleteRowButton = screen.getByRole("button", {
      name: "Delete Other: mock text",
    });
    expect(deleteRowButton).toBeVisible();

    expect(within(tbody).getAllByRole("row")).toHaveLength(1);
    await userEvent.click(addRowButton);

    const updatedRows = within(tbody).getAllByRole("row");
    expect(updatedRows).toHaveLength(2);

    expect(
      within(updatedRows[1]).getByRole("textbox", {
        name: "Other: row 2 Textbox",
      })
    ).toHaveFocus();
    expect(addRowButton).toBeDisabled();

    const deleteRowButton2 = screen.getByRole("button", {
      name: "Delete Other: row 2",
    });
    await userEvent.click(deleteRowButton2);
    expect(within(tbody).getAllByRole("row")).toHaveLength(1);
    expect(addRowButton).toBeEnabled();
  });

  test("SummationTable should send updates to the Form", async () => {
    render(<SummationTableWrapper template={mockedSummationTableElement} />);
    const textbox = screen.getByRole("textbox", {
      name: "Other: mock text Textbox",
    });
    await userEvent.clear(textbox);
    expect(updateSpy).toHaveBeenCalledWith({
      answer: {
        rows: [[{ id: `${id}_textboxId`, value: "" }]],
        total: [],
      },
    });

    const numberField = screen.getByRole("textbox", {
      name: "Other: row 1 NumberField",
    });
    await userEvent.clear(numberField);
    await userEvent.type(numberField, "123");
    expect(updateSpy).toHaveBeenCalledWith({
      answer: {
        rows: [
          [
            { id: `${id}_textboxId`, value: "" },
            { id: `${id}_numberFieldId`, value: 123 },
          ],
        ],
        total: [[{ id: `${id}_numberFieldId`, value: 123, readonly: true }]],
      },
    });

    const numberFieldWithMask = screen.getByRole("textbox", {
      name: "Other: row 1 NumberField Mask",
    });
    await userEvent.type(numberFieldWithMask, "mock text");
    expect(screen.getByText("Response must be a valid number")).toBeVisible();

    await userEvent.clear(numberFieldWithMask);
    await userEvent.type(numberFieldWithMask, "12,345");
    expect(updateSpy).toHaveBeenCalledWith({
      answer: {
        rows: [
          [
            { id: `${id}_textboxId`, value: "" },
            { id: `${id}_numberFieldId`, value: 123 },
            { id: `${id}_numberFieldWithMaskId`, value: 12345 },
          ],
        ],
        total: [
          [
            { id: `${id}_numberFieldId`, value: 123, readonly: true },
            {
              id: `${id}_numberFieldWithMaskId`,
              value: 12345,
              readonly: true,
            },
          ],
        ],
      },
    });
    expect(
      screen.queryByText("Response must be a valid number")
    ).not.toBeInTheDocument();
  });

  test("Resident Dispositions SummationTable is visible", () => {
    const tableElement = getResidentDispositionsPresetRowsAndAnswer({ id });
    const mockedResidentDispositionsSummationTableElement = {
      ...mockedSummationTableElement,
      ...tableElement,
    };
    render(
      <SummationTableWrapper
        template={mockedResidentDispositionsSummationTableElement}
      />
    );

    const rowGroups = screen.getAllByRole("rowgroup");
    const [thead, tbody, tfoot] = rowGroups;
    expect(rowGroups).toHaveLength(3);
    expect(thead.tagName).toBe("THEAD");
    expect(tbody.tagName).toBe("TBODY");
    expect(tfoot.tagName).toBe("TFOOT");

    tableElement.rows.forEach((row) => {
      const headCell = within(thead).getByRole("columnheader", {
        name: row.header,
      });
      expect(headCell).toBeVisible();
    });

    tableElement.answer.rows.forEach((answerRow) => {
      const firstValue = answerRow?.[0]?.value?.toString();
      const readonlyTextbox = within(tbody).getByRole("cell", {
        name: firstValue,
      });
      expect(readonlyTextbox).toBeVisible();

      const numberField = within(tbody).getByRole("textbox", {
        name: `${firstValue} # of residents`,
      });
      expect(numberField).toBeVisible();
    });

    tableElement.answer.total.flat().forEach((answerRow) => {
      const footField = within(tfoot).getByRole("cell", {
        name: answerRow?.value?.toString(),
      });
      expect(footField).toBeVisible();
    });
  });

  test("Resident Dispositions SummationTable should update total", async () => {
    const mockedResidentDispositionsSummationTableElement = {
      ...mockedSummationTableElement,
      ...getResidentDispositionsPresetRowsAndAnswer({ id }),
    };
    render(
      <SummationTableWrapper
        template={mockedResidentDispositionsSummationTableElement}
      />
    );
    const rowGroups = screen.getAllByRole("rowgroup");
    const [_, tbody, tfoot] = rowGroups;

    // Number entry should update the total
    const numberField = within(tbody).getByRole("textbox", {
      name: "Discharged to community # of residents",
    });
    await userEvent.type(numberField, "12345");
    const total = within(tfoot).getByRole("cell", {
      name: "12,345",
    });
    expect(total).toBeVisible();

    // Invalid number should not update the total
    const numberField2 = within(tbody).getByRole("textbox", {
      name: "Discharged to Medicaid home and community-based services waiver # of residents",
    });
    await userEvent.type(numberField2, "-1");
    const updatedTotal = within(tfoot).getByRole("cell", {
      name: "12,345",
    });
    expect(
      within(numberField2.closest("td") as HTMLElement).getByText(
        "Response must be a valid number"
      )
    ).toBeVisible();
    expect(updatedTotal).toBeVisible();

    // Second number should update the total
    const numberField3 = within(tbody).getByRole("textbox", {
      name: "Discharged to an institution for mental diseases (IMD) or inpatient psychiatric facility # of residents",
    });
    await userEvent.type(numberField3, "55555");
    const finalTotal = within(tfoot).getByRole("cell", {
      name: "67,900",
    });
    expect(finalTotal).toBeVisible();
  });

  testA11y(<SummationTableWrapper template={mockedSummationTableElement} />);
});
