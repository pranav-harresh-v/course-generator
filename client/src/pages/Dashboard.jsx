import { Box, Heading, Text } from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <Box p={8}>
      <Heading mb={4}>Welcome to your Dashboard</Heading>
      <Text>Choose a course from the sidebar or create a new one.</Text>
    </Box>
  );
};

export default Dashboard;
