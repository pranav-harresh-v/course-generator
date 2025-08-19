import { Box, Button, Flex, Heading, Text, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

// Motion wrapper
const MotionBox = motion(Box);

const FadeInUp = ({ delay = 0, children }) => (
  <MotionBox
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
  >
    {children}
  </MotionBox>
);

export default function LandingPage() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () =>
    loginWithRedirect({
      appState: { returnTo: "/" },
    });

  const handleSignup = () =>
    loginWithRedirect({
      authorizationParams: { screen_hint: "signup" },
      appState: { returnTo: "/" },
    });

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, blue.900, purple.900)"
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 8 }}
    >
      {/* Navbar */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        mb={{ base: 12, md: 16 }}
        color="white"
      >
        <Text fontWeight="bold" fontSize="xl">
          Course
          <Box as="span" color="purple.300">
            Generator
          </Box>
        </Text>

        <HStack spacing={4}>
          <Button variant="ghost" color="white" onClick={handleLogin}>
            Log In
          </Button>
          <Button
            colorScheme="green"
            size="sm"
            rightIcon={<Box as="span">→</Box>}
            onClick={handleSignup}
          >
            Sign Up Free
          </Button>
        </HStack>
      </Flex>

      {/* Hero Section */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        textAlign="center"
        color="white"
        px={4}
        py={{ base: 16, md: 20 }}
      >
        <FadeInUp>
          <Heading fontSize={{ base: "4xl", md: "5xl" }} fontWeight="extrabold">
            Master Any Topic
          </Heading>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <Text mt={4} fontSize="lg" color="green.300" fontWeight="semibold">
            Choose to learn smart, not hard.
          </Text>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <Text
            mt={4}
            maxW={{ base: "90%", md: "lg" }}
            fontSize="md"
            color="gray.200"
          >
            Unlock AI-powered learning. Choose a topic and get custom lessons,
            code examples, quizzes, and revision — instantly. Fast. Free. Smart.
          </Text>
        </FadeInUp>

        <FadeInUp delay={0.6}>
          <HStack mt={8} spacing={4}>
            <Button
              bg="white"
              color="black"
              _hover={{ bg: "gray.200" }}
              size="lg"
              onClick={handleSignup}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              borderColor="white"
              color="white"
              _hover={{ bg: "whiteAlpha.100" }}
              size="lg"
              onClick={handleLogin}
            >
              Log In
            </Button>
          </HStack>
        </FadeInUp>
      </Flex>
    </Box>
  );
}
