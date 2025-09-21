const { Groq } = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// === COURSE PROMPT ===
const generateCoursePrompt = (topic) => `
You are an expert curriculum designer creating a professional, market-ready online course.

Topic: "${topic}"

Output ONLY valid JSON in this format:
{
  "title": "Engaging course title",
  "description": "A compelling 2–3 sentence course description that excites learners",
  "tags": ["Relevant", "Keywords", "Max 5"],
  "modules": [
    {
      "title": "Descriptive and engaging module title (specific, not generic)",
      "lessons": [
        "descriptive and clear",
        "descriptive and clear",
        "descriptive and clear"
      ]
    }
  ]
}

Rules:
- 5–8 modules total with 3-5 lessons each
- Each module title must be specific and directly related to the topic, not just "Introduction" or "Basics"
- Each lesson title must start with a capital letter and clearly indicate what will be learned
- No repetition between module titles
- Lessons should progressively build in complexity
- JSON only, double quotes, no extra commentary
`;

// === LESSON PROMPT (More Detailed) ===
const generateLessonPrompt = (courseTitle, moduleTitle, lessonTitle) => `
You are an expert educator creating a detailed, structured lesson.

Course: "${courseTitle}"
Module: "${moduleTitle}"
Lesson: "${lessonTitle}"

Output ONLY valid JSON in this format:
{
  "title": "${lessonTitle}",
  "objectives": [
    "At least 3 clear and measurable learning objectives"
  ],
  "content": [
    { "type": "heading", "text": "Introduction" },
    { "type": "paragraph", "text": "At least 100 words introduction with examples and context" },
    { "type": "heading", "text": "Core Concepts" },
    { "type": "paragraph", "text": "Detailed explanation of the main ideas (150+ words), with real-world examples" },
    { "type": "heading", "text": "Step-by-Step Guide" },
    { "type": "paragraph", "text": "Practical, actionable steps for the learner to follow" },
    { "type": "heading", "text": "Common Mistakes" },
    { "type": "paragraph", "text": "List common errors and how to avoid them" },
    { "type": "video", "query": "${lessonTitle} tutorial" },
    { "type": "video", "query": "${lessonTitle} examples" },
    {
      "type": "mcq",
      "question": "Relevant question 1",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": "Correct Option",
      "explanation": "Why this is correct"
    },
    {
      "type": "mcq",
      "question": "Relevant question 2",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": "Correct Option",
      "explanation": "Why this is correct"
    },
    {
      "type": "mcq",
      "question": "Relevant question 3",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": "Correct Option",
      "explanation": "Why this is correct"
    }
  ]
}

Rules:
- At least 4 headings
- At least 4 paragraphs, each 80+ words
- 2 videos
- 3 MCQs minimum
- JSON only, double quotes, no extra commentary
`;

// === CALL AI WITH DEBUG LOGGING ===
const callAI = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    let raw = completion.choices[0]?.message?.content?.trim();

    // Debug log
    console.log("==== RAW AI OUTPUT START ====");
    console.log(raw);
    console.log("==== RAW AI OUTPUT END ====");

    // Clean markdown fences if present
    if (raw.startsWith("```")) {
      raw = raw.replace(/```json|```/gi, "").trim();
    }

    return JSON.parse(raw);
  } catch (err) {
    console.error("Error parsing AI response:", err.message);
    throw new Error("Failed to parse AI response as JSON");
  }
};

module.exports = {
  generateCoursePrompt,
  generateLessonPrompt,
  callAI,
};
