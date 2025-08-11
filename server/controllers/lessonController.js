const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const { generateLessonPrompt, callAI } = require("../utils/ai");

exports.getLessonByIndex = async (req, res, next) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.params;

    const mIdx = parseInt(moduleIndex, 10);
    const lIdx = parseInt(lessonIndex, 10);

    if (isNaN(mIdx) || isNaN(lIdx) || mIdx < 0 || lIdx < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid indices" });
    }

    // 1. Find course & check ownership
    const course = await Course.findById(courseId);
    if (!course || course.creator !== req.auth.sub) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found or unauthorized" });
    }

    // 2. Get moduleId from course.modules
    const moduleId = course.modules[mIdx];
    if (!moduleId) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }

    // 3. Find module
    const moduleDoc = await Module.findById(moduleId);
    if (!moduleDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }

    // 4. Get lessonId from module.lessons
    const lessonId = moduleDoc.lessons[lIdx];
    if (!lessonId) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    // 5. Find lesson
    let lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    // 6. If lesson already has content, return it
    if (lesson.content.length > 0) {
      return res.json({ success: true, data: lesson });
    }

    // 7. Generate lesson content with AI
    const aiPrompt = generateLessonPrompt(
      course.title,
      moduleDoc.title,
      lesson.title
    );
    const lessonData = await callAI(aiPrompt);

    if (!lessonData || !Array.isArray(lessonData.content)) {
      throw new Error("Invalid lesson structure from AI");
    }

    // 8. Update lesson document
    lesson.title = lessonData.title || lesson.title;
    lesson.objectives = Array.isArray(lessonData.objectives)
      ? lessonData.objectives
      : [];
    lesson.content = lessonData.content;
    await lesson.save();

    res.json({ success: true, data: lesson });
  } catch (err) {
    next(err);
  }
};
