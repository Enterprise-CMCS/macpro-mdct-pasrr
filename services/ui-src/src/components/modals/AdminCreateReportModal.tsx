import { useEffect, useMemo, useState } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { Dropdown } from "@cmsgov/design-system";
import {
  AlertTypes,
  CreateReportOptions,
  dropdownEmptyOption,
  Report,
  ReportType,
  StateDropdownOptions,
} from "@pasrr/shared";
import { Alert, Modal } from "components";
import { createReport, getReportByType, useStore } from "utils";

const YEARS_BACK = 5;

export const AdminCreateReportModal = ({ modalDisclosure }: Props) => {
  const { devDate } = useStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [errorAlert, setErrorAlert] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // Dev tools store the date as an epoch-millisecond string
  const parsedDevDate =
    devDate && /^\d+$/.test(devDate) ? Number(devDate) : devDate;
  const currentYear = (
    parsedDevDate ? new Date(parsedDevDate) : new Date()
  ).getFullYear();

  const years = Array.from(
    { length: YEARS_BACK + 1 },
    (_, i) => currentYear - i
  );

  const loadReports = async () => {
    try {
      setReports((await getReportByType(ReportType.PASRR)) ?? []);
    } catch {
      setReports([]);
    }
  };

  useEffect(() => {
    if (modalDisclosure.isOpen) loadReports();
  }, [modalDisclosure.isOpen]);

  const stateOptions = useMemo(() => {
    if (!selectedYear) return [];
    const statesWithReport = new Set(
      reports
        .filter((report) => report.reportingYear === Number(selectedYear))
        .map((report) => report.state)
    );
    return StateDropdownOptions.filter(
      ({ value }) => !statesWithReport.has(value as Report["state"])
    );
  }, [reports, selectedYear]);

  const resetAndClose = () => {
    setSelectedYear("");
    setSelectedState("");
    setErrorAlert(undefined);
    modalDisclosure.onClose();
  };

  const onSubmit = async () => {
    setSubmitting(true);
    const reportOptions: CreateReportOptions = {
      mockDate: devDate,
      reportingYear: Number(selectedYear),
    };
    try {
      await createReport(ReportType.PASRR, selectedState, reportOptions);
      resetAndClose();
    } catch (error: any) {
      setErrorAlert(error.message?.split(" - ").at(-1) || "Unknown error");
    }
    setSubmitting(false);
  };

  return (
    <Modal
      modalDisclosure={{
        isOpen: modalDisclosure.isOpen,
        onClose: resetAndClose,
      }}
      content={{
        heading: "Create a report",
        actionButtonText: submitting ? <Spinner size="md" /> : "Create",
        closeButtonText: "Cancel",
      }}
      disableConfirm={submitting || !selectedYear || !selectedState}
      onConfirmHandler={onSubmit}
    >
      <Flex direction="column" gap="spacer3">
        {errorAlert !== undefined && (
          <Alert status={AlertTypes.ERROR} title="Failed to create report">
            {errorAlert}
          </Alert>
        )}
        <Dropdown
          name="reportingYear"
          label="Reporting year"
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSelectedState("");
          }}
          options={[
            dropdownEmptyOption,
            ...years.map((year) => ({
              label: String(year),
              value: String(year),
            })),
          ]}
        />
        <Dropdown
          name="state"
          label="State or territory"
          value={selectedState}
          disabled={!selectedYear}
          onChange={(e) => setSelectedState(e.target.value)}
          options={[dropdownEmptyOption, ...stateOptions]}
        />
      </Flex>
    </Modal>
  );
};

interface Props {
  modalDisclosure: {
    isOpen: boolean;
    onClose: () => void;
  };
}
