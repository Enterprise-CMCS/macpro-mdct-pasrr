import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router";
import {
  StateNames,
  isStateAbbr,
  isReportType,
  LiteReport,
  BannerArea,
  isCompleteStatus,
} from "@pasrr/shared";
import { getReportName } from "types";
import {
  PageTemplate,
  DashboardTable,
  CreateReportModal,
  AccordionItem,
  Banner,
} from "components";
import {
  Box,
  Button,
  Image,
  Heading,
  Link,
  ListItem,
  Text,
  Flex,
  UnorderedList,
  useDisclosure,
  Accordion,
  Spinner,
} from "@chakra-ui/react";
import { useStore } from "utils";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.svg";
import { getReportsForState } from "utils/api/requestMethods/report";
import { Dropdown as CmsdsDropdownField } from "@cmsgov/design-system";
import { DevTools, ToolType } from "components/devTools/DevTools";
import { activeBannerSelector } from "utils/state/selectors";
import { budgetPeriodFilterOptions } from "./../../../constants";

export const DashboardPage = () => {
  const { reportType, state } = useParams();
  const banner = useStore(activeBannerSelector(reportType as BannerArea));
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<LiteReport[]>([]);
  const [canCreateReport, setCanCreateReport] = useState(false);
  const [filteredReports, setFilteredReports] = useState<LiteReport[]>([]);
  const [budgetPeriodFilter, setBudgetPeriodFilter] = useState("All");

  const fullStateName = isStateAbbr(state) ? StateNames[state] : "";
  const reportName = getReportName(reportType);
  const hasSubmittedReport = reports.some((report) =>
    isCompleteStatus(report.status)
  );

  useEffect(() => {
    if (!isReportType(reportType) || !isStateAbbr(state)) {
      return;
    }
    reloadReports(reportType, state);
  }, [reportType, state]);

  useEffect(() => {
    if (budgetPeriodFilter === "All") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(
        reports.filter(
          (report) => report.budgetPeriod === parseInt(budgetPeriodFilter)
        )
      );
    }
  }, [reports, budgetPeriodFilter]);

  useEffect(() => {
    const noReports = reports.length === 0;
    const allSubmittedReports = reports.every((report) =>
      isCompleteStatus(report.status)
    );
    setCanCreateReport(noReports || allSubmittedReports);
  }, [reports]);

  const reloadReports = (reportType: string, state: string) => {
    (async () => {
      setIsLoading(true);
      const result = await getReportsForState(reportType, state);
      setReports(result);
      setIsLoading(false);
    })();
  };

  // add/edit program modal disclosure
  const {
    isOpen: createReportModalIsOpen,
    onOpen: createReportModalOnOpenHandler,
    onClose: createReportModalOnCloseHandler,
  } = useDisclosure();

  const handleBudgetPeriodChange = (evt: { target: { value: string } }) => {
    setBudgetPeriodFilter(evt.target.value);
  };

  const clearFilter = () => {
    setBudgetPeriodFilter("All");
  };

  return (
    <PageTemplate type="report" sxOverride={sx.layout}>
      <DevTools
        reportType={reportType}
        state={state}
        reloadReports={reloadReports}
        reports={reports}
        type={ToolType.DASHBOARD}
      />
      <Link as={RouterLink} to="/" variant="return">
        <Image src={arrowLeftIcon} alt="" className="icon" />
        Return home
      </Link>
      {banner ? <Banner {...banner} key={banner.key} /> : null}
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" variant="h1">
          {fullStateName} {reportName}
        </Heading>
        <Box marginTop="spacer4">
          <Text marginBottom="spacer2">
            Select “Create {reportName} Report” to create a new report. Then you
            can use the dashboard below to edit the report name, fill it out,
            and monitor its status.
          </Text>
          <Text>
            While this tool will not prevent you from creating multiple reports
            for the same reporting period, you should only submit{" "}
            <strong>one</strong> report per reporting period.
          </Text>
        </Box>
        <Accordion
          allowToggle={true}
          sx={sx.accordion}
          defaultIndex={[-1]} // sets the accordion to closed by default
        >
          <AccordionItem
            label="Understanding report statuses"
            sx={sx.accordionItem}
          >
            <Box sx={sx.accordionPanel}>
              <UnorderedList spacing="spacer1" marginStart="2rem">
                <ListItem>
                  <strong>Not started:</strong> The state created the report,
                  but hasn’t entered any data yet.
                </ListItem>
                <ListItem>
                  <strong>In progress:</strong> The state is actively working on
                  the report, with some or all data entered.
                </ListItem>
                <ListItem>
                  <strong>Submitted:</strong> The state submitted the report to
                  CMS for review, and it is locked from editing.
                </ListItem>
                <ListItem>
                  <strong>In revision:</strong> CMS has sent the report back to
                  the state for revisions or additional information after
                  submission.
                </ListItem>
              </UnorderedList>
              <Text>
                Note: If you need to make changes to a submitted report, reach
                out to the CMS PASRR team at{" "}
                <Link
                  overflowWrap="anywhere"
                  href="mailto:PASRR_Institutional_Coverage@cms.hhs.gov"
                >
                  PASRR_Institutional_Coverage@cms.hhs.gov
                </Link>{" "}
                to have them unlock it.
              </Text>
              <Text marginTop="spacer4" marginBottom="spacer1">
                The PASRR application automatically triggers email notifications
                to your state team for these key milestones:
              </Text>
              <UnorderedList
                marginBottom={0}
                spacing="spacer1"
                marginStart="2rem"
              >
                <ListItem>
                  <strong>When You Submit a Report:</strong> The moment your
                  state team hits finalize, an immediate automated confirmation
                  email is sent to your point-of-contact roster. This serves as
                  your digital receipt and proof of timely completion.
                </ListItem>
                <ListItem>
                  <strong>
                    When a Report Status is “Unlocked for Revision”:
                  </strong>{" "}
                  If your initial submission requires adjustments, CMS will
                  unlock the document. An automated notification will detail the
                  necessary changes and grant you immediate data entry access
                  again.
                </ListItem>
              </UnorderedList>
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
      <Flex sx={sx.bodyBox} gap="2rem" flexDirection="column">
        <Flex alignItems="flex-end" gap="spacer3">
          <CmsdsDropdownField
            name="budgetPeriodFilter"
            label="Filter by Budget Period"
            value={budgetPeriodFilter}
            onChange={handleBudgetPeriodChange}
            options={budgetPeriodFilterOptions}
          />
          <Button
            onClick={clearFilter}
            variant="link"
            fontWeight="bold"
            height="40px"
          >
            Clear Filter
          </Button>
        </Flex>
        {!isLoading && <DashboardTable reports={filteredReports} />}
        {isLoading && (
          <Flex justify="center">
            <Spinner size="md" />
          </Flex>
        )}
        {reports.length === 0 && (
          <Text variant="tableEmpty">
            Keep track of your {reportName} Reports, once you start a report you
            can access it here.
          </Text>
        )}
        <Flex justifyContent="center">
          <Button
            onClick={createReportModalOnOpenHandler}
            type="submit"
            disabled={!canCreateReport}
          >
            {hasSubmittedReport
              ? `Copy ${reportName} Submission`
              : `Create ${reportName} Report`}
          </Button>
        </Flex>
      </Flex>
      <CreateReportModal
        activeState={state!}
        reportType={reportType!}
        modalDisclosure={{
          isOpen: createReportModalIsOpen,
          onClose: createReportModalOnCloseHandler,
        }}
        reportHandler={reloadReports}
      />
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      maxWidth: "appMax",
      marginTop: "spacer4",
      marginBottom: "spacer7",
    },
  },
  leadTextBox: {
    width: "100%",
    maxWidth: "55.25rem",
    marginTop: "spacer5",
    marginX: "auto",
  },
  bodyBox: {
    maxWidth: "55.25rem",
    margin: "0 auto",
    ".desktop &": {
      width: "100%",
    },
    ".tablet &, .mobile &": {
      margin: "0",
    },
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "black",
      },
      "&:after": {
        borderLeftColor: "black",
      },
    },
    ".ds-c-dropdown__menu-container": {
      zIndex: "1101",
    },
  },
  accordion: {
    marginTop: "spacer4",
    color: "base",
  },
  accordionItem: {
    marginBottom: "spacer1",
    ".chakra-accordion__panel": {
      paddingBottom: 0,
    },
  },
  accordionPanel: {
    "ul:first-of-type": {
      marginBottom: "spacer1",
    },
    "& > :last-child": {
      marginBottom: 0,
    },
    ".mobile &": {
      paddingTop: "spacer2",
    },
  },
};
