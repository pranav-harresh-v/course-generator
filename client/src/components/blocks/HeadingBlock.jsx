import { Heading } from "@chakra-ui/react";

export default function HeadingBlock({ text }) {
  return (
    <Heading
      size="lg"
      mt={6}
      mb={3}
      color="purple.300"
      borderBottom="1px solid"
      borderColor="gray.700"
      pb={1}
    >
      {text}
    </Heading>
  );
}
