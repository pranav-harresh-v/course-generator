import { Box, Text } from "@chakra-ui/react";
import ReactPlayer from "react-player";

export default function VideoBlock({ url, query }) {
  // If query is given but no url, could build a YouTube search in the future
  const videoUrl =
    url ||
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  return (
    <Box my={6}>
      <Text mb={2} fontWeight="semibold" color="purple.300">
        Video Resource
      </Text>
      <Box
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.700"
      >
        <ReactPlayer url={videoUrl} controls width="100%" height="360px" />
      </Box>
    </Box>
  );
}
