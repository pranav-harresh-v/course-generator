import { Heading, useColorModeValue } from "@chakra-ui/react";

export default function HeadingBlock({ text }) {
  const headingColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Heading size="md" mt={4} mb={2} color={headingColor}>
      {text}
    </Heading>
  );
}
