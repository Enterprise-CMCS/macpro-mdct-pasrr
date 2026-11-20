import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Heading,
  Flex,
  Accordion,
  Spinner,
  Stack,
  HStack,
  Image,
  Box,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { Dropdown as CmsdsDropdownField } from "@cmsgov/design-system";
import {
  Report,
  ReportType,
  StateDropdownOptions,
  StateNames,
  UserRoles,
} from "@pasrr/shared";
import { PageTemplate, AccordionItem } from "components";
import { ResponsiveTable, SORT_TYPE } from "components/tables/ResponsiveTable";
import {
  formatMonthDayYear,
  getReportByType,
  reportBasePath,
  useStore,
} from "utils";
import { MultiSelect } from "./Multiselect";
import closeTag from "assets/icons/close/icon_close_tag.svg";
import { budgetPeriodFilterOptions } from "./../../constants";
import { ReportCommentDrawer } from "components/drawers/ReportCommentDrawer";
import { getStatus } from "utils/other/status";
import { getAssignedStatesByEmail } from "utils/api/requestMethods/notificationRecipients";
import { useFlags } from "launchdarkly-react-client-sdk";
import { DevTools, ToolType } from "components/devTools/DevTools";

const budgetPeriodValues = [1, 2, 3, 4, 5];
const stateAbbr = Object.keys(StateNames);

const getSavedStateFilter = () => {
  const savedFilter = localStorage.getItem("states");
  if (!savedFilter) return [];
  return savedFilter.split(",");
};

export const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [sortedReports, setSortedReports] = useState<Report[]>([]);
  const [tableRows, setTableRows] = useState<
    (string | number | JSX.Element | undefined)[][]
  >([]);
  const navigate = useNavigate();
  const [budgetValue, setBudgetValue] = useState("All");
  const [selectedStates, setSelectedStates] = useState<string[]>(
    getSavedStateFilter()
  );
  const [lastSorted, setLastSorted] = useState<{
    sort: string;
    type: SORT_TYPE;
  }>({ sort: "", type: SORT_TYPE.DEFAULT });

  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report>();
  const { email: userEmail, userRole } = useStore().user ?? {};
  const flags = useFlags();
  const userCanStartReport =
    [UserRoles.ADMIN, UserRoles.PROJECT_OFFICER].includes(
      userRole as UserRoles
    ) && flags?.adminCanEditReport;

  const setStatesHandler = (states: string[]) => {
    const sortedStates = states.toSorted();
    localStorage.setItem("states", sortedStates.join(","));
    setSelectedStates(sortedStates);
  };

  const reloadReports = async (reportType: string) => {
    setIsLoading(true);
    const result = await getReportByType(reportType);
    //set latest edit report to the top
    setReports(
      result.toSorted((a, b) => (b.lastEdited! < a.lastEdited! ? -1 : 1))
    );
    setIsLoading(false);
  };

  const getAssignedStatesForUser = async () => {
    const sessionStateFilter = localStorage.getItem("states");
    if (!userEmail || sessionStateFilter !== null) return;
    setIsLoading(true);
    const assignedStates = await getAssignedStatesByEmail(userEmail);
    setStatesHandler(assignedStates);
    setIsLoading(false);
  };

  //when the page is loaded, we load the reports and states assigned to the user
  useEffect(() => {
    //we don't have any other report types so defaulting to PASRR
    reloadReports(ReportType.PASRR);
    getAssignedStatesForUser();
  }, []);

  useEffect(() => {
    const filterBudgetPeriod =
      budgetValue == null || budgetValue == "All"
        ? budgetPeriodValues
        : [parseInt(budgetValue)];

    const sessionStateFilter = localStorage.getItem("states");
    const filterStates = !sessionStateFilter
      ? stateAbbr
      : sessionStateFilter.split(",");

    const filtered = reports.filter(
      (report) =>
        filterBudgetPeriod.includes(report.budgetPeriod) &&
        filterStates.includes(report.state)
    );

    setSortedReports(filtered);
  }, [reports, selectedStates, budgetValue]);

  //after reports are filtered, we apply the last saved sort
  useEffect(() => {
    sortRows(lastSorted.sort, lastSorted.type);
  }, [sortedReports]);

  const handleBudgetPeriodChange = (evt: { target: { value: string } }) => {
    setBudgetValue(evt.target.value);
  };

  const clearFilter = () => {
    setStatesHandler([]);
    setBudgetValue("All");
    setSortedReports(reports);
  };

  const tagLabel = (id: string) => {
    return StateNames[id as keyof typeof StateNames];
  };

  const removeTag = (deleteTag: string) => {
    const remainingTags = selectedStates.filter((tag) => tag != deleteTag);
    setStatesHandler(remainingTags);
  };

  const openCommentsDrawer = (report: Report) => {
    setSelectedReport(report);
    setCommentDrawerOpen(true);
  };

  const closeCommentsDrawer = (shouldReload?: boolean) => {
    setSelectedReport(undefined);
    setCommentDrawerOpen(false);
    if (shouldReload) reloadReports(ReportType.PASRR);
  };

  const buildRows = (reports: Report[]) => {
    return reports.map((report) => {
      const columnAction = (
        <HStack>
          <Button
            variant="outline"
            onClick={() => navigate(reportBasePath(report))}
          >
            View Report
          </Button>
          <Button
            variant="link"
            fontWeight="bold"
            onClick={() => openCommentsDrawer(report)}
          >
            Comment/Status
          </Button>
        </HStack>
      );

      return [
        StateNames[report.state],
        report.name,
        report.budgetPeriod,
        formatMonthDayYear(report.lastEdited!),
        getStatus(report),
        report.submissionCount,
        columnAction,
      ];
    });
  };

  const sortRows = (row: string, type: SORT_TYPE) => {
    const getValue = (answer: Report, type: string) => {
      switch (type) {
        case "State/Territory":
          return StateNames[answer.state] || "";
        case "Submission name":
          return answer.name;
        case "Budget Period":
          return answer.budgetPeriod;
        case "Last Edited":
          return answer.lastEdited!;
        case "Status":
          return getStatus(answer);
        default:
          return "";
      }
    };

    const runSort = (arr: Report[]) => {
      return type == SORT_TYPE.DEFAULT
        ? arr
        : arr.toSorted((a, b) => {
            const valueA = getValue(a, row);
            const valueB = getValue(b, row);
            if (type === SORT_TYPE.DESCENDING) {
              return valueA < valueB ? -1 : 1;
            } else {
              return valueB < valueA ? -1 : 1;
            }
          });
    };
    setLastSorted({ sort: row, type: type });
    setTableRows(buildRows(runSort(sortedReports)));
  };

  return (
    <PageTemplate type="report" sxOverride={sx.layout}>
      {userCanStartReport && (
        <DevTools
          reportType={ReportType.PASRR}
          reloadReports={reloadReports}
          reports={reports}
          type={ToolType.DASHBOARD}
        />
      )}
      <Stack sx={sx.box} gap="2rem">
        <Heading as="h1" variant="h1">
          PASRR Admin Dashboard
        </Heading>
        <Accordion
          allowToggle={true}
          defaultIndex={[-1]} // sets the accordion to closed by default
        >
          <AccordionItem label="Admin Instructions">
            <Box sx={sx.accordionPanel}>
              <Text fontWeight="bold" marginBottom="spacer1">
                Reviewing submissions
              </Text>
              <UnorderedList spacing="spacer1" marginStart="spacer4">
                <ListItem>
                  To view a state or territory’s submission, select “View”.
                </ListItem>
                <ListItem>
                  After you finish your review, update the status to “Completed”
                  on the dashboard.
                </ListItem>
              </UnorderedList>
              <Text fontWeight="bold" marginBottom="spacer1">
                Filtering state submissions
              </Text>
              <Text marginBottom="spacer1">
                The table below lists PASRR reports for all states.
              </Text>
              <UnorderedList spacing="spacer1" marginStart="spacer4">
                <ListItem>
                  Select an option from the “State” or “Reporting year” dropdown
                  to update the table immediately.
                </ListItem>
                <ListItem>
                  Search and select multiple states to add them to your view, or
                  select “Clear filters” to reset the table.
                </ListItem>
              </UnorderedList>
              <Text fontWeight="bold" marginBottom="spacer1">
                Reopening submissions for revision
              </Text>
              <UnorderedList spacing="spacer1" marginStart="spacer4">
                <ListItem>
                  To allow a state or territory to make corrections or edits to
                  a submission, select “Update status” to unlock and release the
                  submission. The status will change to “In revision”.
                </ListItem>
                <ListItem>
                  Submission count is shown in the # column. Any submissions
                  started and submitted once have a count of 1. When a state or
                  territory resubmits a previous submission, the count increases
                  by 1.
                </ListItem>
              </UnorderedList>
            </Box>
          </AccordionItem>
        </Accordion>
        <Heading as="h2" variant="h2">
          State Submissions
        </Heading>
        <Box>
          The table below lists PASRR reports for all states. By default, this
          list is automatically filtered to show your assigned states. Selecting
          an option from the State(s) or Budget Period dropdowns will
          immediately update the table content below. You can search and select
          multiple states to add them to your view, or select Clear Filters to
          reset the table.
        </Box>
        <Flex gap="spacer3" alignItems="flex-end" sx={sx.filters}>
          <MultiSelect
            label="State(s)"
            placeholder="Search states"
            countLabel="States"
            options={StateDropdownOptions}
            values={selectedStates}
            onChange={(selected) => setStatesHandler(selected)}
          />
          <CmsdsDropdownField
            name="budgetPeriodFilter"
            label="Filter by Budget Period"
            value={budgetValue}
            onChange={handleBudgetPeriodChange}
            options={budgetPeriodFilterOptions}
          />
          <Button
            onClick={clearFilter}
            variant="link"
            height="40px"
            fontWeight="bold"
            aria-label="Clear All Filters"
          >
            Clear Filters
          </Button>
        </Flex>
        {selectedStates.length > 0 && (
          <Flex gap=".75rem" flexWrap="wrap">
            {selectedStates.map((tag) => (
              <Button
                key={tag}
                variant="tag"
                rightIcon={<Image src={closeTag} />}
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tagLabel(tag)} tag`}
              >
                {tagLabel(tag)}
              </Button>
            ))}
          </Flex>
        )}
        {isLoading ? (
          <Flex justify="center">
            <Spinner size="md" />
          </Flex>
        ) : (
          ResponsiveTable({
            headers: [
              { label: "State/Territory", sortable: true },
              { label: "Submission name", sortable: true },
              { label: "Budget Period", sortable: true },
              { label: "Last Edited", sortable: true },
              { label: "Status", sortable: true },
              { label: "#" },
              { label: "Actions" },
            ],
            rows: tableRows,
            sorting: sortRows,
          })
        )}
      </Stack>
      {selectedReport && (
        <ReportCommentDrawer
          modalDisclosure={{
            isOpen: commentDrawerOpen,
            onClose: closeCommentsDrawer,
          }}
          selectedReport={selectedReport}
        />
      )}
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      maxWidth: "appMax",
      marginTop: "spacer7",
      marginBottom: "100px",
      alignItems: "center",
    },
  },
  box: {
    maxWidth: "55.25rem",
  },
  filters: {
    ".ds-c-dropdown__menu-container": {
      zIndex: "1001",
    },
  },
  accordionPanel: {
    // zero the last list's bottom margin so the page's gap is the only space
    "& > :last-child": {
      marginBottom: 0,
    },
    ".mobile &": {
      paddingTop: "spacer2",
    },
  },
};
