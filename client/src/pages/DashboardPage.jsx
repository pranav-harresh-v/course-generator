import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Spinner,
  useToast,
  Flex,
  Avatar,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

export default function DashboardPage() {
  const { getAccessTokenSilently, user, logout } = useAuth0();
  const [courses, setCourses] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const API_URL = "http://localhost:5000";

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error loading courses",
        description: err.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Create course
  const handleCreateCourse = async () => {
    if (!prompt.trim()) return;
    try {
      setCreating(true);
      const token = await getAccessTokenSilently();
      const res = await axios.post(
        `${API_URL}/api/courses`,
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "Course created!", status: "success" });
      setPrompt("");
      // Instead of navigating immediately, add it to the list
      setCourses((prev) => [res.data.data, ...prev]);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error creating course",
        description: err.message,
        status: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  // Delete course
  const handleDeleteCourse = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast({ title: "Course deleted", status: "info" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error deleting course",
        description: err.message,
        status: "error",
      });
    }
  };

  if (loading) {
    return (
      <VStack py={20}>
        <Spinner size="xl" />
        <Text>Loading your courses...</Text>
      </VStack>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Top Nav */}
      <Flex
        bgGradient="linear(to-r, blue.600, purple.600)"
        color="white"
        px={6}
        py={4}
        align="center"
        justify="space-between"
        shadow="md"
      >
        <Heading size="md" fontWeight="bold">
          CourseGenerator
        </Heading>
        <Flex align="center" gap={3}>
          <Text fontSize="sm">{user?.name}</Text>
          <Avatar size="sm" name={user?.name} src={user?.picture} />
          <Button
            size="sm"
            variant="outline"
            color="white"
            borderColor="whiteAlpha.400"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </Button>
        </Flex>
      </Flex>

      {/* Main content */}
      <Box maxW="6xl" mx="auto" px={6} py={8}>
        {/* Create course */}
        <Box bg="white" p={6} rounded="lg" shadow="sm" mb={10}>
          <Heading size="md" mb={4}>
            Create a New Course
          </Heading>
          <VStack spacing={3} align="stretch">
            <Input
              placeholder="Enter a topic (e.g., Introduction to Machine Learning)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              bg="gray.50"
            />
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleCreateCourse}
              isLoading={creating}
            >
              Generate Course
            </Button>
            <Text fontSize="sm" color="gray.500">
              AI will generate a complete course outline and lessons for your
              topic.
            </Text>
          </VStack>
        </Box>

        {/* Courses list */}
        <Heading size="md" mb={4}>
          My Courses
        </Heading>
        {courses.length === 0 ? (
          <Text color="gray.500">
            You don’t have any courses yet — create one above!
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
            {courses.map((course) => (
              <Box
                key={course._id}
                bg="white"
                p={5}
                rounded="lg"
                shadow="sm"
                position="relative"
                cursor="pointer"
                _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  position="absolute"
                  top={2}
                  right={2}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCourse(course._id);
                  }}
                />
                <Heading size="sm" mb={2}>
                  {course.title}
                </Heading>
                <Text fontSize="sm" color="gray.600" noOfLines={3}>
                  {course.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}
