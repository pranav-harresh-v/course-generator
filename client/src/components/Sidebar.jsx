import {
  Box,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
} from "@chakra-ui/react";
import { NavLink, useParams } from "react-router-dom";

const Sidebar = ({ course }) => {
  const { courseId } = useParams();

  return (
    <Box w="300px" bg="gray.800" color="white" h="100vh" p={4} overflowY="auto">
      <Text fontSize="2xl" mb={6} fontWeight="bold">
        {course?.title || "Course"}
      </Text>

      <Accordion allowMultiple>
        {course?.modules?.map((module, moduleIndex) => (
          <AccordionItem key={moduleIndex} border="none">
            <AccordionButton
              _expanded={{ bg: "gray.700" }}
              _hover={{ bg: "gray.700" }}
              py={3}
            >
              <Box flex="1" textAlign="left" fontWeight="semibold">
                {module.title || `Module ${moduleIndex + 1}`}
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel pb={4} pl={4}>
              <VStack align="start" spacing={2}>
                {module.lessons?.map((lesson, lessonIndex) => (
                  <Link
                    as={NavLink}
                    key={lessonIndex}
                    to={`/courses/${courseId}/module/${moduleIndex}/lesson/${lessonIndex}`}
                    _hover={{ textDecoration: "underline" }}
                    _activeLink={{ fontWeight: "bold", color: "teal.300" }}
                  >
                    {lesson.title || `Lesson ${lessonIndex + 1}`}
                  </Link>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default Sidebar;
