const express = require("express");
const router = express.Router();
const { generateLessonTTS } = require("../controllers/ttsController");
const checkJwt = require("../middlewares/authMiddleware");

// POST /api/tts/:lessonId
router.post("/:lessonId", checkJwt, generateLessonTTS);

module.exports = router;
