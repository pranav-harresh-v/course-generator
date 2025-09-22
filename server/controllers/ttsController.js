const Lesson = require("../models/Lesson");
const { translateToHinglish, textToSpeech } = require("../utils/tts");

// Helper to split large text into ~4500 char chunks
function chunkText(text, maxLen = 4500) {
  const chunks = [];
  let current = "";

  for (const sentence of text.split(/(?<=[.?!])\s+/)) {
    if ((current + sentence).length > maxLen) {
      chunks.push(current.trim());
      current = "";
    }
    current += sentence + " ";
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

exports.generateLessonTTS = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.auth.sub; // Auth0 user ID

    // 1. Fetch lesson + module + course
    const lesson = await Lesson.findById(lessonId).populate({
      path: "module",
      populate: { path: "course", select: "creator title" },
    });

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    const course = lesson.module?.course;
    if (!course || course.creator !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: not your lesson" });
    }

    // 2. Flatten lesson blocks
    const script = lesson.content
      .map((block) => {
        switch (block.type) {
          case "heading":
            return `Section: ${block.text}`;
          case "paragraph":
            return block.text;
          case "mcq":
            return `Question: ${block.question}. Correct answer is ${block.answer}. Explanation: ${block.explanation}`;
          default:
            return "";
        }
      })
      .join("\n");

    if (!script.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Lesson has no content" });
    }

    // 3. Translate
    const hinglishText = await translateToHinglish(script);

    // 4. Split into safe chunks
    const chunks = chunkText(hinglishText);

    // 5. Generate audio for each chunk & merge
    let finalBuffer = Buffer.alloc(0);
    for (const chunk of chunks) {
      const audioPart = await textToSpeech(chunk);
      finalBuffer = Buffer.concat([finalBuffer, audioPart]);
    }

    // 6. Send WAV audio response
    res.set({
      "Content-Type": "audio/wav",
      "Content-Disposition": `attachment; filename="lesson-${lessonId}.wav"`,
    });
    return res.send(finalBuffer);
  } catch (err) {
    console.error("[TTS error]", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate TTS" });
  }
};
