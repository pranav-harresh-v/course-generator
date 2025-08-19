import { useState } from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  Flex,
  useColorModeValue,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export default function MCQBlock({
  question,
  options = [],
  answer,
  explanation,
}) {
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Theme-aware colors
  const correctBg = useColorModeValue("green.100", "green.600");
  const wrongBg = useColorModeValue("red.100", "red.600");
  const neutralBg = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const explanationBg = useColorModeValue("gray.50", "gray.800");
  const explanationBorder = useColorModeValue("blue.400", "blue.300");

  const isCorrect = (opt) => opt === answer;

  const handleReset = () => {
    setSelected(null);
    setShowAnswer(false);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow="sm"
    >
      {/* Question */}
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        {question}
      </Text>

      {/* Options */}
      <VStack spacing={2} align="stretch">
        {options.map((opt, idx) => {
          let bgClr = neutralBg;
          let borderClr = "transparent";

          if (showAnswer) {
            if (isCorrect(opt)) {
              bgClr = correctBg;
            } else if (selected === idx && !isCorrect(opt)) {
              bgClr = wrongBg;
            }
          } else if (selected === idx) {
            borderClr = useColorModeValue("blue.400", "blue.300");
          }

          return (
            <Box
              key={idx}
              px={4}
              py={2}
              borderRadius="md"
              cursor={!showAnswer ? "pointer" : "default"}
              bg={bgClr}
              border="1px solid"
              borderColor={borderClr}
              onClick={() => !showAnswer && setSelected(idx)}
              transition="all 0.2s"
              _hover={!showAnswer ? { bg: hoverBg } : {}}
            >
              {opt}
            </Box>
          );
        })}
      </VStack>

      {/* Buttons */}
      <Flex mt={4} gap={2}>
        <Button
          size="sm"
          colorScheme="purple"
          onClick={() => setShowAnswer(true)}
          isDisabled={showAnswer || selected === null}
        >
          {showAnswer ? "Answer Shown" : "Show Answer"}
        </Button>
        {showAnswer && (
          <Button size="sm" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        )}
      </Flex>

      {/* Explanation */}
      {showAnswer && (
        <Box
          mt={4}
          p={3}
          borderWidth="1px"
          borderRadius="md"
          borderColor={explanationBorder}
          bg={explanationBg}
        >
          <Flex align="center" mb={2}>
            <Icon as={CheckCircleIcon} color={explanationBorder} mr={2} />
            <Text fontWeight="bold" color={explanationBorder}>
              Explanation:
            </Text>
          </Flex>
          <Divider mb={2} />
          <Text fontSize="sm">{explanation}</Text>
        </Box>
      )}
    </Box>
  );
}
