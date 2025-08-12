// src/pages/CourseLayout.jsx
import { useEffect, useState } from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import {
  Box,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Spinner,
  VStack,
} from "@chakra-ui/react";

export default function CourseLayout() {
  const { courseId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`${API_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(res.data.data); // backend: { success:true, data: { ...course } }
      } catch (err) {
        console.error("Error fetching course", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="gray.50">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!course) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="gray.50">
        <Text>Course not found.</Text>
      </Flex>
    );
  }

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        w="300px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        overflowY="auto"
        p={4}
      >
        <Text fontWeight="bold" fontSize="lg" mb={4}>
          {course.title}
        </Text>
        <Accordion allowMultiple>
          {course.modules?.map((module, moduleIndex) => (
            <AccordionItem key={moduleIndex} border="none">
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {module.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={2}>
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <Box
                      key={lessonIndex}
                      px={2}
                      py={1}
                      borderRadius="md"
                      _hover={{ bg: "gray.100", cursor: "pointer" }}
                      onClick={() =>
                        navigate(
                          `/courses/${courseId}/module/${moduleIndex}/lesson/${lessonIndex}`
                        )
                      }
                    >
                      <Text fontSize="sm">{lesson.title}</Text>
                    </Box>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>

      {/* Lesson Content */}
      <Box flex="1" p={6} overflowY="auto">
        <Outlet />
      </Box>
    </Flex>
  );
}
