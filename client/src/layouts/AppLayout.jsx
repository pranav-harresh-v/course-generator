import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <Flex height="100vh" flexDirection="column">
      <Topbar />
      <Flex flex="1">
        <Sidebar />
        <Box flex="1" p={4} overflow="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
