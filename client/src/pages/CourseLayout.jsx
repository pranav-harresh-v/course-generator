import { Flex, Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import SidebarAccordion from "../components/SidebarAccordion";

export default function CourseLayout() {
  return (
    <Flex direction="column" h="100vh" bg="gray.900">
      <TopBar showBackButton />
      <Flex flex="1" overflow="hidden">
        <SidebarAccordion />
        <Box flex="1" p={6} bg="gray.900" color="gray.100" overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
