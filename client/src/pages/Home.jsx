import { Box, Button, Flex, Heading, Text, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

// Reusable motion wrapper
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

export default function Home() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, #101be8ff, #3b0a56)"
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
          <Button
            variant="ghost"
            color="white"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </Button>
          <Button
            colorScheme="green"
            size="sm"
            rightIcon={<Box as="span">→</Box>}
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  screen_hint: "signup",
                },
              })
            }
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
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: {
                    screen_hint: "signup",
                  },
                })
              }
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              borderColor="white"
              color="white"
              _hover={{ bg: "whiteAlpha.100" }}
              size="lg"
              onClick={() => loginWithRedirect()}
            >
              Log In
            </Button>
          </HStack>
        </FadeInUp>
      </Flex>
    </Box>
  );
}
/*
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";

// Animation wrapper
const FadeInUp = ({ delay = 0, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101be8] to-[#3b0a56] px-4 md:px-8 py-6 md:py-8 text-white">
      {/* Navbar }
      <nav className="flex items-center justify-between mb-12 md:mb-16">
        <div className="text-xl font-bold">
          Course
          <span className="text-purple-300">Generator</span>
        </div>

        <div className="flex gap-4">
          <button
            className="text-white hover:text-gray-300"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
          <button
            className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  screen_hint: "signup",
                },
              })
            }
          >
            Sign Up Free →
          </button>
        </div>
      </nav>

      {/* Hero Section }
      <section className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-20">
        <FadeInUp>
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Master Any Topic
          </h1>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <p className="mt-4 text-lg text-green-300 font-semibold">
            Choose to learn smart, not hard.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <p className="mt-4 text-md text-gray-200 max-w-[90%] md:max-w-lg">
            Unlock AI-powered learning. Choose a topic and get custom lessons,
            code examples, quizzes, and revision — instantly. Fast. Free. Smart.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.6}>
          <div className="mt-8 flex gap-4">
            <button
              className="bg-white text-black px-6 py-3 rounded text-lg hover:bg-gray-200"
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: {
                    screen_hint: "signup",
                  },
                })
              }
            >
              Get Started Free
            </button>
            <button
              className="border border-white text-white px-6 py-3 rounded text-lg hover:bg-white/10"
              onClick={() => loginWithRedirect()}
            >
              Log In
            </button>
          </div>
        </FadeInUp>
      </section>
    </div>
  );
}
*/
