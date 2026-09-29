import { Box, Heading, Text } from "@chakra-ui/react";
import { BannerAreas } from "@pasrr/shared";
import {
  AdminDashboard,
  Banner,
  PageTemplate,
  PasrrIntroductionCard,
} from "components";
import { useStore } from "utils";
import { activeBannerSelector } from "utils/state/selectors";

export const HomePage = () => {
  const banner = useStore(activeBannerSelector(BannerAreas.Home));
  const { userIsAdmin, userIsEndUser } = useStore().user ?? {};

  return (
    <>
      {banner ? (
        <Box marginX={{ base: "spacer2", md: "spacer3" }} marginTop="spacer3">
          {" "}
          <Banner {...banner} key={banner.key} />
        </Box>
      ) : null}
      {userIsEndUser && !userIsAdmin ? (
        <PageTemplate>
          <Box>
            <Heading as="h1" variant="h1" paddingBottom="spacer3">
              Preadmission Screening and Resident Review
            </Heading>
            <Text paddingBottom="spacer3">
              Get started by completing the reports for your state or territory.
            </Text>
          </Box>
          <PasrrIntroductionCard />
        </PageTemplate>
      ) : (
        <AdminDashboard />
      )}
    </>
  );
};
