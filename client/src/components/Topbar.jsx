import React from "react";
import {
  Flex,
  Text,
  Spacer,
  Avatar,
  Button,
  Tooltip,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const TopBar = ({ courseTitle }) => {
  const { logout, user, isAuthenticated } = useAuth0();
  const { colorMode, toggleColorMode } = useColorMode();

  // Theme-aware colors
  const bg = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const brandColor = useColorModeValue("purple.600", "purple.300");

  return (
    <Flex
      as="header"
      bg={bg}
      color={textColor}
      align="center"
      p={4}
      borderBottom="1px solid"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      {/* Logo / App name */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <Text fontSize="xl" fontWeight="bold" _hover={{ opacity: 0.8 }}>
          Course
          <Text as="span" color={brandColor}>
            Generator
          </Text>
        </Text>
      </Link>

      {/* Course Title (if provided) */}
      {courseTitle && (
        <Tooltip label={courseTitle} aria-label="Course title">
          <Text
            ml={6}
            fontSize="lg"
            fontWeight="medium"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxW={{ base: "50%", md: "40%", lg: "30%" }}
          >
            {courseTitle}
          </Text>
        </Tooltip>
      )}

      <Spacer />

      {/* Color Mode Toggle */}
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        mr={isAuthenticated ? 2 : 0}
      />

      {/* User actions */}
      {isAuthenticated && (
        <Flex align="center" gap={4}>
          <Avatar
            size="sm"
            name={user?.name}
            src={user?.picture}
            aria-label="User profile"
          />
          <Button
            size="sm"
            variant="outline"
            colorScheme="purple"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default TopBar;
