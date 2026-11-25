import { Link as RouterLink } from "react-router";
import {
  Button,
  Heading,
  Link,
  List,
  ListItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AdminCreateReportModal, PageTemplate } from "components";
import { useStore } from "utils";
import { UserRoles } from "@pasrr/shared";

type AdminTool = {
  text: string;
  to: string;
  description: string;
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
  const createReportModal = useDisclosure();
  const visibleTools = tools.filter(
    ({ roles }) => !roles || roles.includes(userRole as UserRoles)
  );

  return (
    <PageTemplate>
      <Heading as="h1" variant="h1" sx={sx.headerText}>
        Admin tools
      </Heading>
      <List sx={sx.toolList}>
        {visibleTools.map(({ text, to, description }) => (
          <ListItem key={to} sx={sx.toolItem}>
            <Link as={RouterLink} to={to} sx={sx.toolLink}>
              {text}
            </Link>
            <Text sx={sx.toolDescription}>{description}</Text>
          </ListItem>
        ))}
        <ListItem sx={sx.toolItem}>
          <Button
            variant="link"
            onClick={createReportModal.onOpen}
            sx={sx.toolLink}
          >
            Create a report
          </Button>
          <Text sx={sx.toolDescription}>
            Create a report for a state or territory and reporting year.
          </Text>
        </ListItem>
      </List>
      <AdminCreateReportModal
        modalDisclosure={{
          isOpen: createReportModal.isOpen,
          onClose: createReportModal.onClose,
        }}
      />
    </PageTemplate>
  );
};

const sx = {
  headerText: {
    marginBottom: "spacer4",
  },
  toolList: {
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
