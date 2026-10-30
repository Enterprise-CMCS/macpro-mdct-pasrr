import {
  Grid,
  Hide,
  Show,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
  Divider,
  Box,
  Button,
  Image,
  TableCaption,
  VisuallyHidden,
  Tfoot,
} from "@chakra-ui/react";
import { Fragment, JSX } from "react";
import sortIcon from "assets/icons/sort/icon_sort.svg";
import sortAscIcon from "assets/icons/sort/icon_sort_asc.svg";
import sortDescIcon from "assets/icons/sort/icon_sort_desc.svg";

export type TableRowType = string | number | JSX.Element | undefined | boolean;

export enum SORT_TYPE {
  DEFAULT,
  ASCENDING,
  DESCENDING,
}

let sort = { label: "", type: SORT_TYPE.DEFAULT };

const getSortIcon = (type: SORT_TYPE) => {
  switch (type) {
    case SORT_TYPE.ASCENDING:
      return sortAscIcon;
    case SORT_TYPE.DESCENDING:
      return sortDescIcon;
    default:
      return sortIcon;
  }
};

const setNextSort = (type: SORT_TYPE) => {
  switch (type) {
    case SORT_TYPE.DESCENDING:
      return SORT_TYPE.ASCENDING;
    case SORT_TYPE.ASCENDING:
      return SORT_TYPE.DEFAULT;
    case SORT_TYPE.DEFAULT:
      return SORT_TYPE.DESCENDING;
  }
};

const ariaSortType = (type: SORT_TYPE) => {
  switch (type) {
    case SORT_TYPE.ASCENDING:
      return "ascending";
    case SORT_TYPE.DESCENDING:
      return "descending";
    default:
      return "none";
  }
};

const HorizontalTable = ({
  caption,
  footers = [],
  headers,
  rows,
  sorting,
  styleOverride,
  variant = "",
}: {
  caption?: string;
  headers: { label: string; sortable?: boolean }[];
  rows: TableRowType[][];
  footers?: TableRowType[][];
  sorting: (header: string, type: SORT_TYPE) => void;
  styleOverride?: string[];
  variant?: string;
}) => {
  const onSort = (sortName: string) => {
    const type =
      sortName === sort.label ? setNextSort(sort.type) : SORT_TYPE.DESCENDING;
    sort = { label: sortName, type };
    sorting(sortName, type);
  };

  return (
    <Table variant={variant}>
      {caption && (
        <TableCaption height="0" margin="0" padding="0">
          <VisuallyHidden>{caption}</VisuallyHidden>
        </TableCaption>
      )}
      <Thead>
        <Tr>
          {headers.map((item) => (
            <Th
              key={item.label}
              aria-sort={
                item.label === sort.label ? ariaSortType(sort.type) : "none"
              }
              textAlign={item.label === "Actions" ? "center" : undefined}
            >
              {item.sortable ? (
                <Button
                  variant="sort"
                  onClick={() => onSort(item.label)}
                  rightIcon={
                    <Image
                      src={
                        item.label === sort.label
                          ? getSortIcon(sort.type)
                          : sortIcon
                      }
                    ></Image>
                  }
                >
                  {item.label}
                </Button>
              ) : (
                item.label
              )}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((column: TableRowType[], rowIndex) => (
          <Tr
            key={`horizontal-table-body-row-${rowIndex}`}
            className={styleOverride?.[rowIndex] ?? ""}
          >
            {column.map((data, dataIndex) => (
              <Td key={`horizontal-table-body-data-${rowIndex}-${dataIndex}`}>
                {data}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
      {footers.length > 0 && (
        <Tfoot>
          {footers.map((column: TableRowType[], rowIndex) => (
            <Tr
              key={`horizontal-table-foot-row-${rowIndex}`}
              className={styleOverride?.[rowIndex] ?? ""}
            >
              {column.map((data, dataIndex) => (
                <Td key={`horizontal-table-foot-data-${rowIndex}-${dataIndex}`}>
                  {data}
                </Td>
              ))}
            </Tr>
          ))}
        </Tfoot>
      )}
    </Table>
  );
};

const VerticalTable = ({
  footers = [],
  headers,
  rows,
}: {
  footers?: TableRowType[][];
  headers: string[];
  rows: TableRowType[][];
}) => {
  return (
    <VStack gap="1.5rem" alignItems="flex-start">
      <Divider />
      {rows.map((row, rowIndex) => (
        <Fragment key={`vertical-table-body-row-${rowIndex}`}>
          {row
            .map((data, dataIndex) => {
              return data ? (
                <Grid
                  key={`vertical-table-body-data-${rowIndex}-${dataIndex}`}
                  templateColumns="minmax(0, 40vw) minmax(0, 1fr) "
                  gap="1.5rem"
                >
                  <Text fontSize="1rem" color="#71767a" fontWeight="bold">
                    {headers[dataIndex]}
                  </Text>
                  <Box fontSize={{ base: "14px", sm: "16px" }}>{data}</Box>
                </Grid>
              ) : undefined;
            })
            .filter(Boolean)}
          <Divider></Divider>
        </Fragment>
      ))}
      {footers.map((row, rowIndex) => (
        <Fragment key={`vertical-table-foot-row-${rowIndex}`}>
          {row
            .map((data, dataIndex) => {
              return data ? (
                <Grid
                  key={`vertical-table-foot-data-${rowIndex}-${dataIndex}`}
                  templateColumns="minmax(0, 40vw) minmax(0, 1fr) "
                  gap="1.5rem"
                >
                  <Text fontSize="1rem" color="#71767a" fontWeight="bold">
                    {headers[dataIndex]}
                  </Text>
                  <Box fontSize={{ base: "14px", sm: "16px" }}>{data}</Box>
                </Grid>
              ) : undefined;
            })
            .filter(Boolean)}
          <Divider></Divider>
        </Fragment>
      ))}
    </VStack>
  );
};

export const ResponsiveTable = ({
  caption,
  footers = [],
  headers,
  rows,
  sorting = () => {},
  styleOverride,
  variant,
}: {
  caption?: string;
  footers?: TableRowType[][];
  headers: { label: string; sortable?: boolean }[];
  rows: TableRowType[][];
  sorting?: (header: string, type: SORT_TYPE) => void;
  styleOverride?: string[];
  variant?: string;
}) => {
  return (
    <>
      <Hide below="md" key="table">
        {HorizontalTable({
          caption,
          footers,
          headers,
          rows,
          sorting,
          styleOverride,
          variant,
        })}
      </Hide>
      <Show below="md" key="table-mobile">
        {VerticalTable({
          footers,
          headers: headers.map((header) => header.label),
          rows,
        })}
      </Show>
    </>
  );
};
