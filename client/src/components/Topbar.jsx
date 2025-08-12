import {
  Flex,
  Box,
  Text,
  Button,
  Avatar,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function TopBar({ showBackButton = false }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth0();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={6}
      py={3}
      bg="gray.900"
      borderBottom="1px solid"
      borderColor="gray.700"
      color="white"
      shadow="sm"
    >
      <HStack spacing={3}>
        {showBackButton && (
          <IconButton
            aria-label="Back to dashboard"
            icon={<ArrowBackIcon />}
            variant="ghost"
            colorScheme="purple"
            onClick={() => navigate("/")}
          />
        )}
        <Text
          fontWeight="bold"
          fontSize="xl"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          Course
          <Box as="span" color="purple.400">
            Generator
          </Box>
        </Text>
      </HStack>

      <HStack spacing={4}>
        {user && <Avatar size="sm" name={user.name} src={user.picture} />}
        <Button
          size="sm"
          variant="outline"
          borderColor="purple.400"
          color="purple.400"
          _hover={{ bg: "purple.500", color: "white" }}
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Logout
        </Button>
      </HStack>
    </Flex>
  );
}
