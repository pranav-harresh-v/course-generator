const express = require("express");
const router = express.Router();

const { search } = require("../controllers/youtubeController");
const checkJwt = require("../middlewares/authMiddleware");

router.get("/", checkJwt, search);

module.exports = router;
