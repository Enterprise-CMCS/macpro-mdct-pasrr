import { Accordion } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportIntroCardActions } from "./ReportIntroCardActions";
import { ReportType } from "@pasrr/shared";

/**
 * This card appears on the state user home page.
 * It contains text specific to the PASRR report.
 */
export const PasrrIntroductionCard = () => {
  return (
    <ReportIntroCard title="PASRR Report">
      <p>
        The{" "}
        <a href="https://www.medicaid.gov/medicaid/long-term-services-supports/preadmission-screening-and-resident-review">
          Preadmission Screening and Resident Review (PASRR)
        </a>{" "}
        {/* TODO: replace placeholder copy with final PASRR program language */}
      </p>
      <ReportIntroCardActions reportType={ReportType.PASRR} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="When is the PASRR Report Due?">
          {/* TODO: replace with the real PASRR reporting schedule */}
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
