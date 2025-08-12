import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Divider,
} from "@chakra-ui/react";
import LessonRenderer from "../components/LessonRenderer";

export default function LessonViewer() {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use your API base from env
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getAccessTokenSilently();
        const res = await axios.get(
          `${API_URL}/api/courses/${courseId}/module/${moduleIndex}/lesson/${lessonIndex}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLesson(res.data.data);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, moduleIndex, lessonIndex, getAccessTokenSilently, API_URL]);

  // Loading state
  if (loading) {
    return (
      <Box py={10} textAlign="center">
        <Spinner size="xl" color="purple.400" />
        <Text mt={2} color="gray.400">
          Loading lesson...
        </Text>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert status="error" bg="red.900" borderColor="red.700">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  // Empty state
  if (!lesson) {
    return (
      <Text color="gray.400" textAlign="center" mt={4}>
        No lesson found.
      </Text>
    );
  }

  // Lesson view
  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading size="lg" color="white">
          {lesson.title}
        </Heading>
        {lesson.objectives && lesson.objectives.length > 0 && (
          <Box mt={3}>
            <Heading size="sm" color="purple.300" mb={2}>
              Objectives
            </Heading>
            {lesson.objectives.map((obj, i) => (
              <Text key={i} color="gray.200">
                • {obj}
              </Text>
            ))}
          </Box>
        )}
        <Divider borderColor="gray.700" my={4} />
      </Box>

      <LessonRenderer content={lesson.content} />
    </VStack>
  );
}
