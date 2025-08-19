import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Spinner,
  useToast,
  Flex,
  IconButton,
  useColorModeValue,
  Input,
  Skeleton,
} from "@chakra-ui/react";
import { ArrowUpIcon, DeleteIcon } from "@chakra-ui/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TopBar from "../components/TopBar";
import {
  getCourses,
  createCourse as apiCreateCourse,
  deleteCourse as apiDeleteCourse,
} from "../utils/api";

const MotionBox = motion(Box);

/* ---------------- Course Card ---------------- */
function CourseCard({ course, onDelete, onClick }) {
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <MotionBox
      p={{ base: 3, md: 5 }}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
      bg={cardBg}
      position="relative"
      cursor="pointer"
      minH="150px"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
    >
      <IconButton
        size="sm"
        icon={<DeleteIcon />}
        variant="ghost"
        colorScheme="red"
        aria-label="Delete course"
        position="absolute"
        top={2}
        right={2}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(course._id);
        }}
      />
      <Heading size="md" noOfLines={1}>
        {course.title}
      </Heading>
      <Text mt={2} fontSize="sm" color="gray.500" noOfLines={3}>
        {course.description || "No description provided"}
      </Text>
    </MotionBox>
  );
}

/* ---------------- Dashboard ---------------- */
export default function DashboardPage() {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Colors for the GPT-style bar
  const barBg = useColorModeValue("gray.50", "gray.800");
  const barBorder = useColorModeValue("gray.200", "gray.600");
  const iconBg = useColorModeValue("white", "gray.700");
  const iconHover = useColorModeValue("gray.100", "gray.600");

  // Fetch courses
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getCourses(getAccessTokenSilently);
        setCourses(list);
      } catch (err) {
        toast({
          title: "Error loading courses",
          description: err?.response?.data?.message || err.message,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [getAccessTokenSilently, toast]);

  const handleCreate = useCallback(
    async (e) => {
      e?.preventDefault?.();
      const trimmed = prompt.trim();
      if (!trimmed) {
        toast({ title: "Title required", status: "warning" });
        return;
      }
      try {
        setCreating(true);
        const created = await apiCreateCourse(getAccessTokenSilently, trimmed);
        if (created) {
          setCourses((prev) => [...prev, created]);
          setPrompt("");
          toast({ title: "Course created", status: "success" });
          navigate(`/courses/${created._id}`);
        }
      } catch (err) {
        toast({
          title: "Error creating course",
          description: err?.response?.data?.message || err.message,
          status: "error",
        });
      } finally {
        setCreating(false);
      }
    },
    [prompt, getAccessTokenSilently, navigate, toast]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await apiDeleteCourse(getAccessTokenSilently, id);
        setCourses((prev) => prev.filter((c) => c._id !== id));
        toast({ title: "Course deleted", status: "info" });
      } catch (err) {
        toast({
          title: "Error deleting course",
          description: err?.response?.data?.message || err.message,
          status: "error",
        });
      }
    },
    [getAccessTokenSilently, toast]
  );

  return (
    <>
      <TopBar />

      <Box p={{ base: 4, md: 8 }}>
        {/* GPT-style create bar */}
        <form onSubmit={handleCreate}>
          <Box
            mx="auto"
            maxW="720px"
            w="100%"
            bg={barBg}
            border="1px solid"
            borderColor={barBorder}
            borderRadius="full"
            boxShadow="md"
            px={{ base: 4, md: 6 }}
            py={{ base: 2, md: 3 }}
            position="relative"
            mb={8}
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Create any course..."
              aria-label="Course creation input"
              variant="unstyled"
              pr={{ base: 12, md: 16 }}
              fontSize={{ base: "md", md: "lg" }}
              disabled={creating}
            />

            <IconButton
              type="submit"
              aria-label="Create course"
              icon={
                creating ? <Spinner size="sm" /> : <ArrowUpIcon boxSize={4} />
              }
              isDisabled={creating}
              size="sm"
              position="absolute"
              right={{ base: 3, md: 4 }}
              bottom={{ base: 2, md: 3 }}
              borderRadius="full"
              bg={iconBg}
              _hover={{ bg: iconHover }}
              boxShadow="sm"
            />
          </Box>
        </form>

        {/* Loading skeleton */}
        {loading && (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height="150px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        )}

        {/* Empty state */}
        {!loading && courses.length === 0 && (
          <Flex direction="column" align="center" justify="center" mt={20}>
            <Heading size="md" mb={2}>
              No courses yet
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Start your learning journey by creating your first course.
            </Text>
          </Flex>
        )}

        {/* Courses grid */}
        {!loading && courses.length > 0 && (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onDelete={handleDelete}
                onClick={() => navigate(`/courses/${course._id}`)}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </>
  );
}
