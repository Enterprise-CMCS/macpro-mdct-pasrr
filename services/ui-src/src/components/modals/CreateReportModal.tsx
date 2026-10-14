import { useEffect, useState } from "react";
import { Alert, Modal } from "components";
import { Spinner, Flex, Box } from "@chakra-ui/react";
import { Dropdown as CmsdsDropdownField } from "@cmsgov/design-system";
import {
  createReport,
  getReportsForState,
} from "utils/api/requestMethods/report";
import {
  AlertTypes,
  CreateReportOptions,
  isReportType,
  LiteReport,
  PasrrSubTypeMap,
} from "@pasrr/shared";
import { useStore } from "utils";

const verbiage = {
  addReportHeader: "Create a PASRR Report",
  reportingYearLabel: "Which reporting year does this report cover?",
  reportingYearHint:
    'Select the calendar year the data was collected (January 1 to December 31). For example, if you are submitting data for 2025, select "2025".',
  copyReportHeader: (latestReport: LiteReport) => {
    const latestReportSubType = latestReport.subTypeKey;
    const latest = PasrrSubTypeMap[latestReportSubType];
    const next = latest && PasrrSubTypeMap[latest.nextReportSubType];
    if (!latest || !next) return verbiage.addReportHeader;
    return `Copy PASRR ${latest.name} to ${next.name} (${next.dateRangeString})`;
  },
  copyReportSubheader:
    "This copied report will copy some data from the previous report for review and editing in the next report cycle.",
};

export const CreateReportModal = ({
  activeState,
  reportType,
  modalDisclosure,
  reportHandler,
}: Props) => {
  if (!isReportType(reportType)) return null;

  const [errorAlert, setErrorAlert] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [latestReport, setLatestReport] = useState<LiteReport | undefined>(
    undefined,
  );

  const { devDate } = useStore();

  const currentYear = (devDate ? new Date(devDate) : new Date()).getFullYear();
  const reportingYearOptions = [
    { label: `${currentYear}`, value: `${currentYear}` },
  ];
  const [reportingYear, setReportingYear] = useState(`${currentYear}`);

  const handleReportingYearChange = (evt: { target: { value: string } }) => {
    setReportingYear(evt.target.value);
  };

  useEffect(() => {
    (async () => {
      const reports = await getReportsForState(reportType, activeState);
      if (reports?.length > 0) {
        const latestReport = reports.reduce((latest, current) => {
          if (latest.created > current.created) {
            return latest;
          } else {
            return current;
          }
        }, reports[0]);
        setLatestReport(latestReport);
      }
    })();
  }, []);

  const onSubmit = async () => {
    setSubmitting(true);

    const reportOptions: CreateReportOptions = {
      mockDate: devDate,
      reportingYear: parseInt(reportingYear),
    };

    try {
      await createReport(reportType, activeState, reportOptions);
      await reportHandler(reportType, activeState);
      modalDisclosure.onClose();
    } catch (error: any) {
      const errorMessage =
        error.message?.split(" - ").at(-1) || "Unknown error";
      setErrorAlert(errorMessage);
    }

    setSubmitting(false);
  };

  return (
    <Modal
      modalDisclosure={{
        isOpen: modalDisclosure.isOpen,
        onClose: () => {
          modalDisclosure.onClose();
          setErrorAlert(undefined);
        },
      }}
      content={{
        heading: `${!latestReport ? verbiage.addReportHeader : verbiage.copyReportHeader(latestReport)}`,
        subheading: `${!latestReport ? "" : verbiage.copyReportSubheader}`,
        actionButtonText: submitting ? <Spinner size="md" /> : "Save",
        closeButtonText: "Cancel",
      }}
      disableConfirm={submitting}
      onConfirmHandler={onSubmit}
    >
      <Flex direction="column" gap="2rem">
        {errorAlert !== undefined ? (
          <Alert status={AlertTypes.ERROR} title="Failed to create report">
            {errorAlert}
          </Alert>
        ) : null}
        <Box sx={sx.reportingYearField}>
          <CmsdsDropdownField
            name="reportingYear"
            label={verbiage.reportingYearLabel}
            hint={verbiage.reportingYearHint}
            value={reportingYear}
            onChange={handleReportingYearChange}
            options={reportingYearOptions}
          />
        </Box>
      </Flex>
    </Modal>
  );
};

interface Props {
  activeState: string;
  reportType: string;
  modalDisclosure: {
    isOpen: boolean;
    onClose: () => void;
  };
  reportHandler: (reportType: string, activeState: string) => void;
}

const sx = {
  reportingYearField: {
    ".ds-c-dropdown": {
      maxWidth: "12rem",
    },
  },
};
