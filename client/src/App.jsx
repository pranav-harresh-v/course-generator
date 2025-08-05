import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import LessonRenderer from "./components/LessonRenderer";

const sampleContent = [
  { type: "heading", text: "Introduction to AI" },
  { type: "paragraph", text: "AI is a rapidly evolving field..." },
  { type: "code", language: "python", text: "print('Hello, AI!')" },
  { type: "video", url: "dQw4w9WgXcQ" },
  {
    type: "mcq",
    question: "What is AI?",
    options: [
      "A type of robot",
      "A field of computer science",
      "A programming language",
    ],
    answer: 1,
  },
];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LessonRenderer content={sampleContent} />} />
    </Routes>
  );
}
