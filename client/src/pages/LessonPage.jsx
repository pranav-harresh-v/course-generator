import { useParams } from "react-router-dom";
import { Box, Heading, Text } from "@chakra-ui/react";

const LessonPage = () => {
  const { courseId, moduleIndex, lessonIndex } = useParams();

  return (
    <Box p={8}>
      <Heading mb={4}>
        Course: {courseId} — Module {moduleIndex}, Lesson {lessonIndex}
      </Heading>
      <Text>This is where the lesson content will be rendered.</Text>
    </Box>
  );
};

export default LessonView;
