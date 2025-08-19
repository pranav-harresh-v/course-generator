import { Text, useColorModeValue } from "@chakra-ui/react";

export default function ParagraphBlock({ text }) {
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Text
      fontSize="md"
      lineHeight="tall"
      whiteSpace="pre-wrap"
      color={textColor}
    >
      {text}
    </Text>
  );
}
