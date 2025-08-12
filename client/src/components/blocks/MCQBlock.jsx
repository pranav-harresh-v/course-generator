import { useState } from "react";
import { Box, Text, VStack, Button } from "@chakra-ui/react";

export default function MCQBlock({ question, options, answer }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index) => {
    if (!submitted) setSelected(index);
  };

  const handleSubmit = () => {
    if (selected !== null) setSubmitted(true);
  };

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.700"
      bg="gray.800"
      rounded="md"
      my={4}
    >
      <Text fontWeight="bold" mb={3} color="purple.300">
        {question}
      </Text>
      <VStack align="stretch" spacing={2}>
        {options.map((opt, i) => {
          const isCorrect = i === answer;
          const isSelected = i === selected;

          return (
            <Box
              key={i}
              p={2}
              borderRadius="md"
              border="1px solid"
              borderColor={
                submitted && isCorrect
                  ? "green.400"
                  : isSelected
                  ? "purple.400"
                  : "gray.600"
              }
              bg={
                submitted && isCorrect
                  ? "green.900"
                  : isSelected
                  ? "purple.900"
                  : "transparent"
              }
              color={
                submitted && isCorrect
                  ? "green.200"
                  : isSelected
                  ? "purple.200"
                  : "gray.200"
              }
              _hover={{ bg: submitted ? "" : "gray.700", cursor: "pointer" }}
              onClick={() => handleSelect(i)}
            >
              {opt}
            </Box>
          );
        })}
      </VStack>
      {!submitted && (
        <Button
          mt={3}
          size="sm"
          colorScheme="purple"
          isDisabled={selected === null}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      )}
      {submitted && (
        <Text mt={2} color={selected === answer ? "green.300" : "red.300"}>
          {selected === answer ? "Correct! 🎉" : "Incorrect. Try again!"}
        </Text>
      )}
    </Box>
  );
}
