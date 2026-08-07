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
        process helps ensure that individuals with mental illness or
        intellectual disability are not inappropriately placed in nursing
        facilities, and that they receive the services they need. States report
        to CMS on their PASRR activities using this application.
        {/* TODO: replace placeholder copy with final PASRR program language */}
      </p>
      <ReportIntroCardActions reportType={ReportType.PASRR} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="When is the PASRR Report Due?">
          {/* TODO: replace with the real PASRR reporting schedule */}
          Reports are due 30 days after the reporting period ends.
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
