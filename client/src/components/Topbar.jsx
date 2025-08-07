import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

const Topbar = () => {
  const { logout, user } = useAuth0();

  return (
    <Flex
      as="header"
      bg="gray.900"
      color="white"
      px={6}
      py={3}
      justify="space-between"
      align="center"
    >
      <Text fontSize="xl" fontWeight="bold">
        Text-to-Learn
      </Text>
      <Flex gap={4} align="center">
        <Text>{user?.name}</Text>
        <Button
          colorScheme="red"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log Out
        </Button>
      </Flex>
    </Flex>
  );
};

export default Topbar;
