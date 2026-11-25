import { Box, Button, Heading, Flex, Image, Link } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";
import { useStore, flattenPageIds } from "utils";
import arrowDownIcon from "assets/icons/arrows/icon_arrow_down_gray.svg";
import arrowUpIcon from "assets/icons/arrows/icon_arrow_up_gray.svg";
import { ReactNode, useState } from "react";
import { assertExhaustive } from "types";
import { isReportType, Report, ReportType } from "@pasrr/shared";

const navItem = (title: string = "", index: number) => {
  if (index <= 0) return title;
  return (
    <Box as="span" paddingLeft="spacer2" key={`${title}.${index}`}>
      {navItem(title, index - 1)}
    </Box>
  );
};

const getTitle = (report: Report) => {
  if (!isReportType(report.type)) return "";
  switch (report.type) {
    case ReportType.PASRR:
      return "PASRR Report";
    default:
      assertExhaustive(report.type);
      return "";
  }
};

export const Sidebar = () => {
  const { report, pageMap, currentPageId, setSidebar, sidebarOpen } =
    useStore();
  const { reportType, state, reportId } = useParams();
  const [toggleList, setToggleList] = useState<{ [key: string]: boolean }>({});

  if (!report || !pageMap) {
    return null;
  }

  const title = getTitle(report);
  const setToggle = (sectionId: string, currentlyExpanded: boolean) => {
    setToggleList((list) => ({ ...list, [sectionId]: !currentlyExpanded }));
  };

  const navigate = useNavigate();

  const onNavSelect = (sectionId: string) => {
    navigate(`/report/${reportType}/${state}/${reportId}/${sectionId}`);
  };

  const navSection = (section: number, index: number = 0): ReactNode => {
    const page = report.pages[section];
    const childSections =
      page.childPageIds
        ?.map((child) => pageMap.get(child))
        .filter(
          (childIndex): childIndex is number => childIndex !== undefined
        ) || [];
    const hasChildSections = childSections.length > 0;

    const autoExpand = flattenPageIds(
      report,
      pageMap,
      page.childPageIds ?? []
    ).includes(currentPageId!);
    const isExpanded = toggleList[page.id] ?? autoExpand;

    const rowContent = (
      <Flex as="span" justifyContent="space-between" alignItems="flex-start">
        {" "}
        <Flex as="span" width="100%" paddingY="spacer1">
          {" "}
          {navItem(page.title!, index)}{" "}
        </Flex>{" "}
        {hasChildSections && (
          <Flex
            as="span"
            height="var(--chakra-sizes-10)"
            flexShrink="0"
            marginLeft="spacer2"
            paddingRight="spacer2"
            alignItems="center"
            onClick={() => setToggle(page.id, isExpanded)}
          >
            {" "}
            <Image
              src={isExpanded ? arrowUpIcon : arrowDownIcon}
              alt={isExpanded ? "Collapse subitems" : "Expand subitems"}
            />{" "}
          </Flex>
        )}{" "}
      </Flex>
    );

    return (
      <Box key={page.id} inert={!sidebarOpen}>
        {hasChildSections ? (
          <Link
            as="button"
            variant="sidebar"
            aria-expanded={isExpanded}
            height="auto"
            minHeight="var(--chakra-sizes-10)"
            onClick={() => setToggle(page.id, isExpanded)}
          >
            {rowContent}
          </Link>
        ) : (
          <Link
            variant="sidebar"
            className={page.id === currentPageId ? "selected" : ""}
            href={`/report/${reportType}/${state}/${reportId}/${page.id}`}
            height="auto"
            minHeight="var(--chakra-sizes-10)"
            onClick={(e) => {
              e.preventDefault();
              onNavSelect(page.id);
            }}
          >
            {rowContent}
          </Link>
        )}
        {hasChildSections &&
          isExpanded &&
          childSections.map((section) => navSection(section, index + 1))}
      </Box>
    );
  };

  const root = pageMap.get("root");
  if (root == undefined) return null;

  return (
    <Box sx={sx.sidebar} className={sidebarOpen ? "open" : "closed"}>
      <Flex sx={sx.sidebarNav}>
        <Button
          aria-label="Sidebar"
          aria-expanded={sidebarOpen}
          variant="sidebarToggle"
          onClick={() => setSidebar(!sidebarOpen)}
          className={sidebarOpen ? "open" : "closed"}
        >
          <Image
            src={arrowDownIcon}
            alt=""
            className={sidebarOpen ? "left" : "right"}
          />
        </Button>
        <Flex sx={sx.sidebarList}>
          <Heading variant="sidebar">{title}</Heading>
          {report.pages[root].childPageIds?.map((child) =>
            navSection(pageMap.get(child)!)
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

const sx = {
  sidebar: {
    position: "relative",
    transition: "all 0.3s ease",
    height: "100%",
    zIndex: "dropdown",
    "&.open": {
      marginLeft: "0rem",
    },
    "&.closed": {
      marginLeft: "-20.5rem",
    },
    "[inert] > *": {
      opacity: 0.5,
    },
    ".tablet &, .mobile &": {
      position: "sticky",
      top: "0",
      display: "block",
      maxHeight: "100vh",
    },
  },
  sidebarNav: {
    height: "100%",
  },
  sidebarList: {
    background: "gray_lightest",
    width: "20.5rem",
    flexDir: "column",
  },
};
