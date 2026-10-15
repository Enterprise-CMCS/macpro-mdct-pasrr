import { useEffect, useState } from "react";
import { Alert, Modal } from "components";
import { Spinner, Flex, Text } from "@chakra-ui/react";
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
  reportingYearHint: (reportingYear: number) =>
    `This report will be created for the previous calendar year (${reportingYear}), covering data collected from January 1 to December 31.`,
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
  const reportingYear = currentYear - 1;

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
      reportingYear,
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
        <Text>{verbiage.reportingYearHint(reportingYear)}</Text>
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
