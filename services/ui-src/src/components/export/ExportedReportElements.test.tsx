import { MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderElements } from "./ExportedReportElements";
import { AttachmentAreaTemplate, ElementType } from "@pasrr/shared";
import { mockUseStore } from "utils/testing/setupTest";
import { useStore } from "utils";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const mockFile = {
  name: "mock-file.txt",
  size: 100,
  fileId: "mockKsuId_mock-file-id.pdf",
};

describe("Test ExportedReportElements", () => {
  test("render SubHeader element", () => {
    const element = renderElements({
      id: "mock_subHeaderId",
      text: "mock sub header",
      type: ElementType.SubHeader,
    });
    render(element);
    expect(screen.getByText("mock sub header")).toBeInTheDocument();
  });
  test("render AttachmentArea element", () => {
    const notAnswered = {
      type: ElementType.AttachmentArea,
      id: "mock_attachmentAreaId",
      label: "",
      required: true,
    } as AttachmentAreaTemplate;

    const element = renderElements(notAnswered);
    render(element);
    expect(screen.getByText("Not answered")).toBeInTheDocument();

    const answeredElement = renderElements({
      ...notAnswered,
      answer: [mockFile],
    });
    render(answeredElement);
    expect(screen.getByText("mock-file.txt")).toBeInTheDocument();
    expect(screen.getByText("1 KB")).toBeInTheDocument();
  });
  test("render ActionTable element", () => {
    const element = renderElements({
      type: ElementType.ActionTable,
      id: "mock_actionTableId",
      label: "action table",
      heading: "Action Table",
      modal: {
        title: "",
        elements: [],
      },
      rows: [
        {
          header: "no",
          id: "#",
          type: ElementType.Paragraph,
        },
        {
          header: "mock header 1",
          id: "mock_actionTableId_header1",
          type: ElementType.Paragraph,
        },
        {
          header: "mock header 2",
          id: "mock_actionTableId_header2",
          type: ElementType.Paragraph,
        },
      ],
      answer: [[{ id: "mock_actionTableId_header1", value: "mock value" }]],
      required: true,
    });
    render(element);
    expect(screen.getByText("action table")).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "mock header 1" })
    ).toBeVisible();
    expect(
      screen.getByRole("columnheader", { name: "mock header 2" })
    ).toBeVisible();
    expect(screen.getByText("mock value")).toBeVisible();
  });
});
