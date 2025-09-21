const Lesson = require("../models/Lesson");
const { translateToHinglish, textToSpeech } = require("../utils/tts");

exports.generateLessonTTS = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.auth.sub; // Auth0 user ID from checkJwt

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
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // 2. Ownership check
    if (course.creator !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: not your lesson" });
    }

    // 3. Flatten lesson blocks into readable script
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
        .json({ success: false, message: "Lesson has no content to explain" });
    }

    // 4. Translate to Hinglish
    const hinglishText = await translateToHinglish(script);

    // 5. Generate TTS audio
    const audioBuffer = await textToSpeech(hinglishText);

    // 6. Send WAV audio response
    res.set({
      "Content-Type": "audio/wav",
      "Content-Disposition": `attachment; filename="lesson-${lessonId}.wav"`,
    });
    return res.send(audioBuffer);
  } catch (err) {
    console.error("[TTS error]", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate TTS" });
  }
};
