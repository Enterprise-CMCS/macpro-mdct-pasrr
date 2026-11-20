import { Link as RouterLink } from "react-router";
import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { useStore } from "utils";
import { UserRoles } from "@pasrr/shared";

type AdminTool = {
  text: string;
  to: string;
  description: string;
  // Omit to show the tool to every admin user
  roles?: UserRoles[];
};

const tools: AdminTool[] = [
  {
    text: "Banner editor",
    to: "/admin/banner-editor",
    description:
      "Create and edit announcement banners to display on state report dashboards.",
  },
  {
    text: "Notifications",
    to: "/notifications",
    description:
      "Assign CMS Project Officers to the states they manage and receive report notifications.",
    roles: [UserRoles.APPROVER],
  },
];

export const AdminToolsPage = () => {
  const { userRole } = useStore().user ?? {};
  const visibleTools = tools.filter(
    ({ roles }) => !roles || roles.includes(userRole as UserRoles)
  );

  return (
    <PageTemplate>
      <Heading as="h1" variant="h1" sx={sx.headerText}>
        Admin tools
      </Heading>
      <Box as="ul" sx={sx.toolList}>
        {visibleTools.map(({ text, to, description }) => (
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
