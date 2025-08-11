const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");

const { generateCoursePrompt, callAI } = require("../utils/ai");

// Create a new course from AI prompt
exports.createCourse = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }

    // 1. Get course data from AI
    const aiPrompt = generateCoursePrompt(prompt);
    const courseData = await callAI(aiPrompt);

    // 2. Create course first (empty modules array)
    const course = await Course.create({
      title: courseData.title,
      description: courseData.description,
      creator: req.auth.sub,
      tags: courseData.tags || [],
      modules: [],
    });

    const moduleIds = [];

    // 3. Create modules & lessons
    for (const module of courseData.modules) {
      // Create module first with no lessons
      const newModule = await Module.create({
        title: module.title,
        course: course._id,
        lessons: [],
      });

      const lessonIds = [];

      // Create lessons with correct module reference
      for (const lessonTitle of module.lessons) {
        const newLesson = await Lesson.create({
          title: lessonTitle,
          content: [],
          objectives: [],
          module: newModule._id,
        });
        lessonIds.push(newLesson._id);
      }

      // Update module with its lesson IDs
      newModule.lessons = lessonIds;
      await newModule.save();

      moduleIds.push(newModule._id);
    }

    // 4. Update course with module IDs
    course.modules = moduleIds;
    await course.save();

    // 5. Return populated course with titles only
    const populatedCourse = await Course.findById(course._id)
      .select("title description tags modules")
      .populate({
        path: "modules",
        select: "title lessons",
        populate: {
          path: "lessons",
          select: "title",
        },
      });

    res.status(201).json({ success: true, data: populatedCourse });
  } catch (err) {
    next(err);
  }
};

// Get all courses (minimal for cards list)
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ creator: req.auth.sub }).select(
      "title description tags"
    );
    res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

// Get one course with modules & lesson titles
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      creator: req.auth.sub,
    })
      .select("title description tags modules")
      .populate({
        path: "modules",
        select: "title lessons",
        populate: {
          path: "lessons",
          select: "title",
        },
      });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// Delete a course and its modules & lessons
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      creator: req.auth.sub,
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    await Module.deleteMany({ _id: { $in: course.modules } });
    await Lesson.deleteMany({ module: { $in: course.modules } });
    await course.deleteOne();

    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};
