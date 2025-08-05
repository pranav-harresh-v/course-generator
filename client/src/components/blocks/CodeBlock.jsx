import { Box } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language, text }) => (
  <Box borderWidth={1} borderRadius="md" overflow="hidden">
    <SyntaxHighlighter language={language} style={oneDark}>
      {text}
    </SyntaxHighlighter>
  </Box>
);

export default CodeBlock;
