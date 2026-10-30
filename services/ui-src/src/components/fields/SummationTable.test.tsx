import { SummationTable } from "components";
import { MockedFunction } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUseStore } from "utils/testing/setupTest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import {
  ElementType,
  getResidentDispositionPresetRowsAndAnswer,
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

const id = "mock-summation-table-id";

const mockedSummationTableElement: SummationTableTemplate = {
  id,
  type: ElementType.SummationTable,
  caption: "Summation Table",
  required: true,
  rows: [
    {
      id: `${id}-textbox`,
      header: "Textbox",
      type: ElementType.Textbox,
    },
    {
      id: `${id}-number-field`,
      header: "NumberField",
      type: ElementType.NumberField,
    },
    {
      id: `${id}-number-field-with-mask`,
      header: "NumberField Mask",
      type: ElementType.NumberField,
      mask: MaskType.CommaSeparated,
    },
  ],
  answer: {
    rows: [[{ id: `${id}-textbox`, value: "mock text" }]],
    total: [
      [
        { id: `${id}-textbox`, value: "Total", preset: true, readonly: true },
        { id: `${id}-number-field`, value: 0, readonly: true },
        { id: `${id}-number-field-with-mask`, value: 0, readonly: true },
      ],
    ],
  },
};

const updateSpy = vi.fn();

const SummationTableWrapper = ({
  template,
}: {
  template: SummationTableTemplate;
}) => {
  return <SummationTable element={template} updateElement={updateSpy} />;
};

describe("<SummationTable />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("SummationTable is visible", () => {
    render(<SummationTableWrapper template={mockedSummationTableElement} />);
    const table = screen.getByRole("table", { name: "Summation Table" });
    expect(table).toBeVisible();

    const textbox = screen.getByRole("textbox", { name: "mock text Textbox" });
    expect(textbox).toBeVisible();
    expect(textbox).toHaveValue("mock text");

    const numberField = screen.getByRole("textbox", {
      name: "mock text NumberField",
    });
    expect(numberField).toBeVisible();
    expect(numberField).toHaveValue("");
  });

  test("SummationTable should send updates to the Form", async () => {
    render(<SummationTableWrapper template={mockedSummationTableElement} />);
    const textbox = screen.getByRole("textbox", { name: "mock text Textbox" });
    await userEvent.clear(textbox);
    expect(updateSpy).toHaveBeenCalledWith({
      answer: {
        rows: [[{ id: `${id}-textbox`, value: "" }]],
        total: mockedSummationTableElement.answer?.total,
      },
    });

    const numberField = screen.getByRole("textbox", {
      name: "NumberField",
    });
    await userEvent.clear(numberField);
    await userEvent.type(numberField, "123");
    expect(updateSpy).toHaveBeenCalledWith({
      answer: {
        rows: [
          [
            { id: `${id}-textbox`, value: "" },
            { id: `${id}-number-field`, value: 123 },
          ],
        ],
        total: mockedSummationTableElement.answer?.total,
      },
    });

    const numberFieldWithMask = screen.getByRole("textbox", {
      name: "NumberField Mask",
    });
    await userEvent.type(numberFieldWithMask, "mock text");
    expect(screen.getByText("Response must be a valid number")).toBeVisible();

    await userEvent.clear(numberFieldWithMask);
    await userEvent.type(numberFieldWithMask, "12,345");
    expect(updateSpy).toHaveBeenCalledWith({
      answer: {
        rows: [
          [
            { id: `${id}-textbox`, value: "" },
            { id: `${id}-number-field`, value: 123 },
            { id: `${id}-number-field-with-mask`, value: 12345 },
          ],
        ],
        total: mockedSummationTableElement.answer?.total,
      },
    });
    expect(
      screen.queryByText("Response must be a valid number")
    ).not.toBeInTheDocument();
  });

  test("Resident Disposition SummationTable is visible", () => {
    const { rows, answer } = getResidentDispositionPresetRowsAndAnswer({ id });
    const mockedResidentDispositionSummationTableElement = {
      ...mockedSummationTableElement,
      rows,
      answer,
    };
    render(
      <SummationTableWrapper
        template={mockedResidentDispositionSummationTableElement}
      />
    );

    const rowGroups = screen.getAllByRole("rowgroup");
    const thead = rowGroups[0];
    const tbody = rowGroups[1];
    const tfoot = rowGroups[2];
    expect(rowGroups).toHaveLength(3);
    expect(thead.tagName).toBe("THEAD");
    expect(tbody.tagName).toBe("TBODY");
    expect(tfoot.tagName).toBe("TFOOT");

    rows.forEach((row) => {
      const headCell = within(thead).getByRole("columnheader", {
        name: row.header,
      });
      expect(headCell).toBeVisible();
    });

    answer.rows.forEach((answerRow) => {
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

    answer.total.flat().forEach((answerRow) => {
      const footField = within(tfoot).getByRole("cell", {
        name: answerRow?.value?.toString(),
      });
      expect(footField).toBeVisible();
    });
  });

  testA11y(<SummationTableWrapper template={mockedSummationTableElement} />);
});
