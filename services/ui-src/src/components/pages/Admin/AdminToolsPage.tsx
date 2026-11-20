import { Link as RouterLink } from "react-router";
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { useStore } from "utils";
import { UserRoles } from "@pasrr/shared";

export const AdminToolsPage = () => {
  const { userRole } = useStore().user ?? {};

  return (
    <PageTemplate data-testid="admin-tools-view">
      <Heading as="h1" id="AdminToolsHeader" tabIndex={-1} sx={sx.headerText}>
        Admin Tools
      </Heading>
      <Text mb="1.25rem">
        Select a tool below to manage announcements and other admin tasks.
      </Text>
      <Box as="ul" sx={sx.toolList}>
        <li>
          <Link as={RouterLink} to="/admin/banner-editor" sx={sx.toolLink}>
            Banner Editor
          </Link>
        </li>
        {userRole === UserRoles.APPROVER && (
          <li>
            <Link as={RouterLink} to="/notifications" sx={sx.toolLink}>
              Notifications
            </Link>
          </li>
        )}
      </Box>
    </PageTemplate>
  );
};

const sx = {
  headerText: {
    marginBottom: "spacer2",
    fontSize: "heading_3xl",
    fontWeight: "heading_3xl",
  },
  toolList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  toolLink: {
    fontWeight: "bold",
  },
};
