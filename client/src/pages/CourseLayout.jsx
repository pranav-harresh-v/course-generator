import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  IconButton,
  Spinner,
  useToast,
  useColorModeValue,
  Skeleton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useParams, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import TopBar from "../components/TopBar";
import SidebarAccordion from "../components/SidebarAccordion";
import { getCourseById } from "../utils/api";

const MotionBox = motion(Box);

export default function CourseLayout() {
  const { courseId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const toast = useToast();

  const [course, setCourse] = useState({ title: "", modules: [] });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const sidebarBg = useColorModeValue("white", "gray.800");
  const contentBg = useColorModeValue("gray.50", "gray.900");
  const toggleBg = useColorModeValue("white", "gray.700");
  const toggleHoverBg = useColorModeValue("gray.100", "gray.600");

  // Detect mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch course
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const courseData = await getCourseById(
          getAccessTokenSilently,
          courseId
        );
        setCourse({
          title: courseData?.title || "",
          modules: courseData?.modules || [],
        });
      } catch (err) {
        toast({
          title: "Error loading course",
          description: err?.response?.data?.message || err.message,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, getAccessTokenSilently, toast]);

  const SidebarContent = (
    <Box
      w="100%"
      maxW="300px"
      h="100%"
      borderRight="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      overflowY="auto"
      p={4}
      bg={sidebarBg}
    >
      {loading ? (
        <Box>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="40px" mb={3} borderRadius="md" />
          ))}
        </Box>
      ) : (
        <SidebarAccordion modules={course.modules} />
      )}
    </Box>
  );

  return (
    <Flex direction="column" h="100vh">
      <TopBar courseTitle={course.title} />

      <Flex flex="1" overflow="hidden" position="relative">
        {/* Sidebar */}
        {isMobile ? (
          <Drawer
            isOpen={sidebarOpen}
            placement="left"
            onClose={() => setSidebarOpen(false)}
          >
            <DrawerOverlay />
            <DrawerContent bg={sidebarBg}>
              <DrawerBody p={0}>{SidebarContent}</DrawerBody>
            </DrawerContent>
          </Drawer>
        ) : (
          sidebarOpen && (
            <MotionBox
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.2 }}
              w="300px"
            >
              {SidebarContent}
            </MotionBox>
          )
        )}

        {/* Sidebar toggle button */}
        <IconButton
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          aria-expanded={sidebarOpen}
          icon={sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          position="absolute"
          top="80px"
          left={sidebarOpen && !isMobile ? "300px" : "20px"}
          transform="translateX(-50%)"
          size="sm"
          borderRadius="full"
          boxShadow="md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          bg={toggleBg}
          _hover={{ bg: toggleHoverBg }}
          zIndex={20}
        />

        {/* Main content */}
        <Box flex="1" overflowY="auto" p={{ base: 4, md: 6 }} bg={contentBg}>
          <Outlet
            context={{ modules: course.modules, courseTitle: course.title }}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
