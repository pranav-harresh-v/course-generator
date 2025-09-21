require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Routes
const courseRoutes = require("./routes/courseRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
const ttsRoutes = require("./routes/ttsRoutes");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Text-to-Learn Backend is running" });
});

// API routes
app.use("/api/courses", courseRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/tts", ttsRoutes);

// Error handler
app.use(errorMiddleware);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Server running on port ${PORT}`);
      }
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
