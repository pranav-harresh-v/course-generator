import { Box, Code, useColorModeValue } from "@chakra-ui/react";

export default function CodeBlock({ code = "", language = "javascript" }) {
  const bg = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Box
      bg={bg}
      color={textColor}
      p={4}
      borderRadius="md"
      overflowX="auto"
      fontSize="sm"
      fontFamily="mono"
      border="1px solid"
      borderColor={borderColor}
    >
      <Code whiteSpace="pre" display="block">
        {code}
      </Code>
    </Box>
  );
}
