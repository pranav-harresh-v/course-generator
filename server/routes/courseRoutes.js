const express = require("express");
const router = express.Router();

const checkJwt = require("../middlewares/authMiddleware");
const {
  createCourse,
  getCourses,
  getCourseById,
  deleteCourse,
} = require("../controllers/courseController");

const { getLessonByIndex } = require("../controllers/lessonController");

// Course endpoints
router.post("/", checkJwt, createCourse);
router.get("/", checkJwt, getCourses);
router.get("/:id", checkJwt, getCourseById);
router.delete("/:id", checkJwt, deleteCourse);

// Lesson fetch (generate if missing)
router.get(
  "/:courseId/module/:moduleIndex/lesson/:lessonIndex",
  checkJwt,
  getLessonByIndex
);

module.exports = router;
