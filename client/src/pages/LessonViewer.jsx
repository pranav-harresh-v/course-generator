// src/pages/LessonViewer.jsx
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
  Code,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

export default function LessonViewer() {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const res = await axios.get(
          `${API_URL}/api/courses/${courseId}/module/${moduleIndex}/lesson/${lessonIndex}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLesson(res.data.data); // backend: { success:true, data:{...lesson} }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, moduleIndex, lessonIndex]);

  if (loading) {
    return (
      <Box py={10} textAlign="center">
        <Spinner size="xl" />
        <Text mt={2}>Loading lesson...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!lesson) {
    return <Text>No lesson found.</Text>;
  }

  return (
    <VStack align="stretch" spacing={4}>
      {/* Lesson title */}
      <Heading size="lg">{lesson.title}</Heading>

      {/* Lesson objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <Box>
          <Heading size="sm" mb={2}>
            Objectives
          </Heading>
          <VStack align="start" spacing={1}>
            {lesson.objectives.map((obj, i) => (
              <Text key={i} fontSize="sm">
                • {obj}
              </Text>
            ))}
          </VStack>
        </Box>
      )}

      {/* Lesson content */}
      {lesson.content?.map((block, idx) => {
        switch (block.type) {
          case "heading":
            return (
              <Heading key={idx} size="md" mt={4}>
                {block.text}
              </Heading>
            );
          case "paragraph":
            return (
              <Text key={idx} fontSize="md">
                {block.text}
              </Text>
            );
          case "code":
            return (
              <Box key={idx} bg="gray.900" color="white" p={4} rounded="md">
                <Code whiteSpace="pre" display="block">
                  {block.text}
                </Code>
              </Box>
            );
          case "video":
            return (
              <Box key={idx}>
                <Text fontWeight="semibold">
                  Video: {block.url || block.query}
                </Text>
                {/* Later: embed YouTube video */}
              </Box>
            );
          case "mcq":
            return (
              <Box
                key={idx}
                p={4}
                border="1px"
                borderColor="gray.200"
                rounded="md"
              >
                <Text fontWeight="semibold" mb={2}>
                  {block.question}
                </Text>
                <VStack align="stretch" spacing={1}>
                  {block.options.map((opt, oi) => (
                    <Text key={oi}>• {opt}</Text>
                  ))}
                </VStack>
              </Box>
            );
          default:
            return null;
        }
      })}
    </VStack>
  );
}
