// src/components/blocks/VideoBlock.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Spinner,
  AspectRatio,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export default function VideoBlock({ query }) {
  const { getAccessTokenSilently } = useAuth0();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const API_URL = import.meta.env.VITE_API_URL;
  const cardBg = useColorModeValue("white", "gray.800");
  const borderClr = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    let isMounted = true;

    const fetchVideo = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const res = await axios.get(`${API_URL}/api/youtube`, {
          params: { q: query },
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.videos || null;

        if (isMounted) setVideo(data);
      } catch (err) {
        if (isMounted) {
          toast({
            title: "Error loading video",
            description: err?.response?.data?.message || err.message,
            status: "error",
          });
          setVideo(null);
        }
      } finally {
        isMounted && setLoading(false);
      }
    };

    fetchVideo();
    return () => {
      isMounted = false;
    };
  }, [query, API_URL, getAccessTokenSilently, toast]);

  if (loading) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        bg={cardBg}
        borderColor={borderClr}
        textAlign="center"
      >
        <Spinner />
      </Box>
    );
  }

  if (!video) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        bg={cardBg}
        borderColor={borderClr}
      >
        <Text color="red.400">No video found for: {query}</Text>
      </Box>
    );
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      bg={cardBg}
      borderColor={borderClr}
    >
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={video.embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </AspectRatio>
      <Box p={3}>
        <Text fontWeight="semibold" noOfLines={2}>
          {video.title}
        </Text>
      </Box>
    </Box>
  );
}
