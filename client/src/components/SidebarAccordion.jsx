import React, { useMemo } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  VStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

export default function SidebarAccordion({ modules = [] }) {
  const {
    courseId,
    moduleIndex: activeModuleIndex,
    lessonIndex: activeLessonIndex,
  } = useParams();
  const navigate = useNavigate();

  // Color tokens
  const sidebarBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const activeBg = useColorModeValue("purple.50", "purple.600");
  const activeColor = useColorModeValue("purple.700", "white");
  const moduleTitleColor = useColorModeValue("gray.800", "gray.200");
  const lessonTextColor = useColorModeValue("gray.700", "gray.300");
  const emptyTextColor = useColorModeValue("gray.500", "gray.400");

  // Auto-expand the active module
  const defaultIndex = useMemo(() => {
    if (!modules.length) return [];
    const index = parseInt(activeModuleIndex, 10);
    return isNaN(index) ? [0] : [index];
  }, [modules, activeModuleIndex]);

  if (!modules.length) {
    return (
      <Box p={4} color={emptyTextColor} textAlign="center" fontSize="sm">
        No modules available
      </Box>
    );
  }

  return (
    <Box
      bg={sidebarBg}
      height="100%"
      overflowY="auto"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Accordion allowMultiple defaultIndex={defaultIndex}>
        {modules.map((module, mIndex) => (
          <AccordionItem key={mIndex} border="none">
            <h2>
              <AccordionButton px={3} py={2} _hover={{ bg: hoverBg }}>
                <Box
                  flex="1"
                  textAlign="left"
                  fontWeight="semibold"
                  color={moduleTitleColor}
                  fontSize="sm"
                  isTruncated
                >
                  {module.title || `Module ${mIndex + 1}`}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={2} px={0}>
              <VStack align="stretch" spacing={1}>
                {module.lessons.map((lesson, lIndex) => {
                  const isActive =
                    parseInt(activeModuleIndex, 10) === mIndex &&
                    parseInt(activeLessonIndex, 10) === lIndex;

                  return (
                    <Button
                      key={lIndex}
                      justifyContent="flex-start"
                      variant="ghost"
                      size="sm"
                      fontWeight={isActive ? "bold" : "normal"}
                      bg={isActive ? activeBg : "transparent"}
                      color={isActive ? activeColor : lessonTextColor}
                      _hover={{ bg: hoverBg }}
                      onClick={() =>
                        navigate(
                          `/courses/${courseId}/module/${mIndex}/lesson/${lIndex}`
                        )
                      }
                      aria-current={isActive ? "page" : undefined}
                      isTruncated
                    >
                      {lesson.title || `Lesson ${lIndex + 1}`}
                    </Button>
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
