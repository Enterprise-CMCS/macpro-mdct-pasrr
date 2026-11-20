import { Link as RouterLink } from "react-router";
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { useStore } from "utils";
import { UserRoles } from "@pasrr/shared";

const adminTools = [
  {
    text: "Banner editor",
    to: "/admin/banner-editor",
    description:
      "Create and edit announcement banners to display on state report dashboards.",
  },
];

const approverTools = [
  {
    text: "Notifications",
    to: "/notifications",
    description:
      "Assign CMS Project Officers to the states they manage and receive report notifications.",
  },
];

export const AdminToolsPage = () => {
  const { userRole } = useStore().user ?? {};
  const tools =
    userRole === UserRoles.APPROVER
      ? [...adminTools, ...approverTools]
      : adminTools;

  return (
    <PageTemplate data-testid="admin-tools-view">
      <Heading as="h1" id="AdminToolsHeader" tabIndex={-1} sx={sx.headerText}>
        Admin tools
      </Heading>
      <Box as="ul" sx={sx.toolList}>
        {tools.map(({ text, to, description }) => (
          <Box as="li" key={to} sx={sx.toolItem}>
            <Link as={RouterLink} to={to} sx={sx.toolLink}>
              {text}
            </Link>
            <Text sx={sx.toolDescription}>{description}</Text>
          </Box>
        ))}
      </Box>
    </PageTemplate>
  );
};

const sx = {
  headerText: {
    marginBottom: "spacer4",
    fontSize: "heading_3xl",
    fontWeight: "heading_3xl",
  },
  toolList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  toolItem: {
    paddingY: "spacer2",
  },
  toolLink: {
    fontWeight: "bold",
  },
  toolDescription: {
    marginTop: "spacer1",
  },
};
