import { VStack, Text } from "@chakra-ui/react";
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import MCQBlock from "./blocks/MCQBlock";

export default function LessonRenderer({ content = [] }) {
  if (!content.length) {
    return (
      <Text fontStyle="italic" color="gray.500">
        No content available.
      </Text>
    );
  }

  return (
    <VStack align="stretch" spacing={4}>
      {content.map((block, idx) => {
        const key = block._id || `${block.type}-${idx}`;

        switch (block.type) {
          case "heading":
            return <HeadingBlock key={key} text={block.text} />;
          case "paragraph":
            return <ParagraphBlock key={key} text={block.text} />;
          case "code":
            return (
              <CodeBlock
                key={key}
                code={block.text}
                language={block.language}
              />
            );
          case "video":
            return <VideoBlock key={key} query={block.query || block.url} />;
          case "mcq":
            return <MCQBlock key={key} {...block} />;
          default:
            return (
              <Text key={key} color="red.400" fontSize="sm">
                Unknown block type: {block.type}
              </Text>
            );
        }
      })}
    </VStack>
  );
}
