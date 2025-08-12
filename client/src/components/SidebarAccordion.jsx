import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export default function SidebarAccordion() {
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`${API_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setModules(res.data.data.modules || []);
      } catch (err) {
        console.error("Error fetching modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId, getAccessTokenSilently]);

  if (loading) {
    return (
      <Box w="300px" bg="gray.800" p={4} color="gray.300">
        Loading modules...
      </Box>
    );
  }

  return (
    <Box
      w="300px"
      bg="gray.800"
      borderRight="1px solid"
      borderColor="gray.700"
      color="gray.200"
      overflowY="auto"
    >
      <Accordion
        allowMultiple
        defaultIndex={moduleIndex ? [parseInt(moduleIndex)] : []}
      >
        {modules.map((module, mIdx) => (
          <AccordionItem key={mIdx} border="none">
            <h2>
              <AccordionButton
                _expanded={{ bg: "gray.700", color: "white" }}
                _hover={{ bg: "gray.700" }}
              >
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {module.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel p={0}>
              <VStack align="stretch" spacing={0}>
                {module.lessons.map((lesson, lIdx) => {
                  const isActive =
                    parseInt(moduleIndex) === mIdx &&
                    parseInt(lessonIndex) === lIdx;

                  return (
                    <Box
                      key={lIdx}
                      px={4}
                      py={2}
                      bg={isActive ? "purple.600" : "transparent"}
                      _hover={{
                        bg: isActive ? "purple.700" : "gray.700",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(
                          `/courses/${courseId}/module/${mIdx}/lesson/${lIdx}`
                        )
                      }
                    >
                      <Text fontSize="sm" noOfLines={1}>
                        {lesson.title}
                      </Text>
                    </Box>
                  );
                })}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}
