import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Flex,
  Button,
  useToast,
  useColorModeValue,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LessonRenderer from "../components/LessonRenderer";
import { getLesson } from "../utils/api";
import { getLessonTTS } from "../utils/api";
import { downloadLessonAsPDF } from "../utils/pdfExporter";

export default function LessonViewer() {
  const [audioUrl, setAudioUrl] = useState(null);
  const { courseId, moduleIndex, lessonIndex } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const toast = useToast();
  const navigate = useNavigate();
  const { modules } = useOutletContext();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudoLoading] = useState(false);
  const m = parseInt(moduleIndex, 10);
  const l = parseInt(lessonIndex, 10);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const data = await getLesson(getAccessTokenSilently, courseId, m, l);
        setLesson(data || null);
      } catch (err) {
        toast({
          title: "Error loading lesson",
          description: err?.response?.data?.message || err.message,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [courseId, m, l, getAccessTokenSilently, toast]);

  // Smooth scroll to top when lesson changes and reset audio
  useEffect(() => {
    setAudioUrl(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [courseId, m, l]);

  const handlePrev = () => {
    if (l > 0) {
      navigate(`/courses/${courseId}/module/${m}/lesson/${l - 1}`);
    } else if (m > 0) {
      const prevModule = modules[m - 1];
      navigate(
        `/courses/${courseId}/module/${m - 1}/lesson/${
          prevModule.lessons.length - 1
        }`
      );
    }
  };

  const handleNext = () => {
    const currentModule = modules[m];
    if (l < currentModule.lessons.length - 1) {
      navigate(`/courses/${courseId}/module/${m}/lesson/${l + 1}`);
    } else if (m < modules.length - 1) {
      navigate(`/courses/${courseId}/module/${m + 1}/lesson/0`);
    }
  };

  const handleExplain = async () => {
    try {
      setAudoLoading(true);
      const url = await getLessonTTS(getAccessTokenSilently, lesson._id);
      setAudioUrl(url);
    } catch (err) {
      toast({
        title: "Error generating explanation",
        description: err.message,
        status: "error",
      });
    } finally {
      setAudoLoading(false);
    }
  };

  const isFirstLesson = m === 0 && l === 0;
  const isLastLesson =
    m === modules.length - 1 &&
    l === (modules[modules.length - 1]?.lessons.length || 1) - 1;

  return (
    <Flex direction="column" height="100%">
      <Box
        flex="1"
        overflowY="auto"
        p={4}
        bg={cardBg}
        borderRadius="md"
        boxShadow="sm"
      >
        {loading ? (
          <Box>
            <Skeleton height="28px" width="60%" mb={4} />
            <Skeleton height="16px" mb={2} />
            <Skeleton height="16px" mb={2} />
            <Skeleton height="16px" width="80%" />
          </Box>
        ) : lesson ? (
          <>
            <Heading size="lg" mb={4} aria-live="polite">
              {lesson.title}
            </Heading>
            <LessonRenderer content={lesson.content || []} />
          </>
        ) : (
          <Heading size="md">Lesson not found.</Heading>
        )}
      </Box>

      <Flex
        mt={4}
        p={3}
        borderTop="1px solid"
        borderColor={borderColor}
        bg={cardBg}
        justify="space-between"
        align="center"
        boxShadow="sm"
      >
        <Flex gap={2}>
          <Button
            variant="outline"
            onClick={handlePrev}
            isDisabled={isFirstLesson}
            aria-label="Go to previous lesson"
          >
            Previous
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleNext}
            isDisabled={isLastLesson}
            aria-label="Go to next lesson"
          >
            Next
          </Button>
        </Flex>
        <Flex gap={2}>
          <Button
            variant="ghost"
            onClick={() => downloadLessonAsPDF(lesson, lesson.title)}
          >
            Download PDF
          </Button>
          <Button
            variant="ghost"
            onClick={handleExplain}
            isDisabled={audioLoading}
            leftIcon={audioLoading ? <Spinner size="sm" /> : null}
          >
            {audioLoading ? "Generating..." : "Explain Lesson"}
          </Button>
        </Flex>
      </Flex>
      {/* Hidden audio player (appears when audio is ready) */}
      {audioUrl && (
        <Box mt={2} px={4}>
          <audio controls src={audioUrl} style={{ width: "100%" }} />
        </Box>
      )}
    </Flex>
  );
}
