import { VStack } from "@chakra-ui/react";
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import MCQBlock from "./blocks/MCQBlock";

const LessonRenderer = ({ content }) => {
  return (
    <VStack align="stretch" spacing={6}>
      {content.map((block, index) => {
        switch (block.type) {
          case "heading":
            return <HeadingBlock key={index} text={block.text} />;
          case "paragraph":
            return <ParagraphBlock key={index} text={block.text} />;
          case "code":
            return (
              <CodeBlock
                key={index}
                language={block.language}
                text={block.text}
              />
            );
          case "video":
            return <VideoBlock key={index} query={block.url} />;
          case "mcq":
            return (
              <MCQBlock
                key={index}
                question={block.question}
                options={block.options}
                answer={block.answer}
              />
            );
          default:
            return null;
        }
      })}
    </VStack>
  );
};

export default LessonRenderer;
