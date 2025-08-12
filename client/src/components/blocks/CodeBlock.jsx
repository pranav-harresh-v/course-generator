import { Box } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ language, text }) {
  return (
    <Box
      my={4}
      border="1px solid"
      borderColor="gray.700"
      borderRadius="md"
      overflow="hidden"
    >
      <SyntaxHighlighter
        language={language || "javascript"}
        style={dracula}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "#1a202c", // Chakra gray.900
        }}
      >
        {text}
      </SyntaxHighlighter>
    </Box>
  );
}
