import { Box, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

const MCQBlock = ({ question, options, answer }) => {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index) => {
    setSelected(index);
    setShowResult(true);
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
      <Text fontWeight="semibold">{question}</Text>
      <VStack spacing={2} mt={2} align="stretch">
        {options.map((opt, i) => (
          <Box
            key={i}
            p={2}
            cursor="pointer"
            borderWidth={1}
            borderRadius="md"
            onClick={() => handleSelect(i)}
            bg={
              showResult
                ? i === answer
                  ? "green.100"
                  : i === selected
                  ? "red.100"
                  : "white"
                : "white"
            }
            borderColor={
              showResult
                ? i === answer
                  ? "green.500"
                  : i === selected
                  ? "red.500"
                  : "gray.200"
                : "gray.200"
            }
            _hover={!showResult ? { bg: "gray.100" } : {}}
          >
            {opt}
          </Box>
        ))}
      </VStack>
      {showResult && selected !== null && (
        <Text mt={2} fontSize="sm" color="gray.600">
          {selected === answer ? "✅ Correct!" : "❌ Incorrect."}
        </Text>
      )}
    </Box>
  );
};

export default MCQBlock;
