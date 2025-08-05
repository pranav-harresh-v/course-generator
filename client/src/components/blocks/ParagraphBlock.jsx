import { Text } from "@chakra-ui/react";

const ParagraphBlock = ({ text }) => (
  <Text fontSize="md" color="gray.700" lineHeight="tall">
    {text}
  </Text>
);

export default ParagraphBlock;
