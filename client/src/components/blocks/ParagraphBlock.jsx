import { Text } from "@chakra-ui/react";

export default function ParagraphBlock({ text }) {
  return (
    <Text fontSize="md" mb={4} lineHeight="tall" color="gray.200">
      {text}
    </Text>
  );
}
