import { Accordion, Text } from "@chakra-ui/react";
import { AccordionItem, ExternalLink, ReportIntroCard } from "components";
import { ReportIntroCardActions } from "./ReportIntroCardActions";
import { ReportType } from "@pasrr/shared";
import { PASRR_OVERVIEW_URL } from "../../constants";

/**
 * This card appears on the state user home page.
 * It contains text specific to the PASRR report.
 */
export const PasrrIntroductionCard = () => {
  return (
    <ReportIntroCard title="PASRR Report">
      <Text>
        The{" "}
        <ExternalLink href={PASRR_OVERVIEW_URL}>
          Preadmission Screening and Resident Review (PASRR)
        </ExternalLink>{" "}
        annual reporting application is used by state Medicaid agencies to
        report the PASRR Level II resident review data required by section
        1919(e)(7)(C)(iv) of the Social Security Act and described in State
        Medicaid Director letter # XX-XXX.
      </Text>
      <ReportIntroCardActions reportType={ReportType.PASRR} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="When is the PASRR report due?">
          <Text>
            Submit your annual report by March 31. Your submission must cover
            data from January 1 through December 31 of the previous calendar
            year.
          </Text>
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
