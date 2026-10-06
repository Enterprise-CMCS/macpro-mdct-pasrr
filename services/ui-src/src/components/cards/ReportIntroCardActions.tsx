import { Button, Flex, Image, Link } from "@chakra-ui/react";
import downloadIcon from "assets/icons/download/icon_download_primary.svg";
import rightIcon from "assets/icons/arrows/icon_arrow_right_white.svg";
import { useNavigate } from "react-router";
import { ReportType, isReportType } from "@pasrr/shared";
import { useStore } from "utils";

/**
 * This component is contained within each card on the state user home page.
 * It has a link to that report type's dashboard.
 */
export const ReportIntroCardActions = ({ reportType }: Props) => {
  const navigate = useNavigate();
  const state = useStore().user?.state;
  const dashboardRoute = `/report/${reportType}/${state}`;
  const showDownloadButton = reportType === ReportType.PASRR;

  const getAbbreviation = (reportType: string) => {
    if (!isReportType(reportType)) return "";
    switch (reportType) {
      case ReportType.PASRR:
        return "PASRR";
    }
  };

  return (
    <Flex sx={showDownloadButton ? sx.actionsFlex : sx.actionsFlexEnd}>
      {showDownloadButton && (
        <Button
          variant={"link"}
          onClick={(e) => {
            e.preventDefault();
            alert("TODO");
          }}
          leftIcon={<Image src={downloadIcon} alt="Download" height="1rem" />}
        >
          User Guide and Help File
        </Button>
      )}
      <Button
        as={Link}
        variant={"primary"}
        href={`/report/${reportType}/${state}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(dashboardRoute);
        }}
        rightIcon={<Image src={rightIcon} alt="Link" height="1rem" />}
        sx={sx.link}
      >
        Enter {getAbbreviation(reportType)} report
      </Button>
    </Flex>
  );
};

interface Props {
  reportType: ReportType;
}

const sx = {
  actionsFlex: {
    flexFlow: "no-wrap",
    justifyContent: "space-between",
    marginY: "spacer3",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  actionsFlexEnd: {
    flexFlow: "no-wrap",
    justifyContent: "end",
    marginY: "spacer3",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  link: {
    textDecoration: "none",
    "&:visited, &:visited:hover": {
      color: "white",
      textDecoration: "none",
    },
    "&:hover": {
      color: "white",
      textDecoration: "none",
      backgroundColor: "primary_darker",
    },
  },
};
