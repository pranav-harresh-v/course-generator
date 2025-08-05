import { Box, Text } from "@chakra-ui/react";

const VideoBlock = ({ query }) => (
  <Box
    bg="black"
    color="white"
    p={4}
    borderRadius="md"
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="250px"
  >
    <Text fontSize="md">🎬 Placeholder for: {query}</Text>
  </Box>
);

export default VideoBlock;
