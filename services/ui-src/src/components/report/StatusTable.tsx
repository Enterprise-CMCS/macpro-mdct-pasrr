import { Fragment } from "react";
import { PageStatus } from "@pasrr/shared";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { useStore } from "utils";
import { TableStatusIcon } from "components/tables/TableStatusIcon";
import {
  ReviewRow,
  SectionDetails,
  submittableMetricsSelector,
} from "utils/state/selectors";

export const StatusTableElement = () => {
  const { report } = useStore();
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();
  const submittableMetrics = useStore(submittableMetricsSelector);

  if (!report) {
    return null;
  }

  const handleEditClick = (sectionId: string) => {
    const path = `/report/${reportType}/${state}/${reportId}/${sectionId}`;
    navigate(path);
  };

  const renderSectionRow = (
    sectionDetails: SectionDetails | null,
    key: string,
    nested: boolean
  ) => {
    if (!sectionDetails) return;
    const { section, displayStatus, submittable } = sectionDetails;
    // Optional pages have no required fields, so they show Complete once they are submittable.
    const status =
      displayStatus === PageStatus.OPTIONAL && submittable
        ? PageStatus.COMPLETE
        : displayStatus;
    return (
      <Tr key={key} p={0}>
        <Td>
          <Text ml={nested ? "1.25rem" : 0}>{section.title}</Text>
        </Td>
        <Td>
          <TableStatusIcon tableStatus={status} showLabel={true} />
        </Td>
        <Td>
          <Button
            variant="outline"
            width="100%"
            onClick={() => handleEditClick(section.id)}
          >
            Edit
          </Button>
        </Td>
      </Tr>
    );
  };

  // Parent pages are labels only, so they have no status or Edit button.
  const renderRow = (row: ReviewRow) => {
    if (row.kind === "section") {
      return renderSectionRow(row.section, row.id, false);
    }
    return (
      <Fragment key={row.id}>
        <Tr p={0}>
          <Td>
            <Text fontWeight="bold">{row.title}</Text>
          </Td>
          <Td />
          <Td />
        </Tr>
        {row.children.map((child, index) =>
          renderSectionRow(child, `${row.id}-${index}`, true)
        )}
      </Fragment>
    );
  };

  return (
    <>
      <Table variant="status">
        <Thead>
          <Tr>
            <Th>Section</Th>
            <Th>Status</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>{submittableMetrics?.rows.map(renderRow)}</Tbody>
      </Table>
    </>
  );
};
