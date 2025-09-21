const { searchYouTube } = require("../utils/youtube");

exports.search = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) {
      return res
        .status(400)
        .json({ success: false, message: "Missing query ?q=" });
    }
    const maxResults = Math.min(parseInt(req.query.maxResults) || 2, 5);
    const videos = await searchYouTube(q, { maxResults });
    return res.json({ success: true, videos });
  } catch (err) {
    console.error("[youtube.search] error:", err?.response?.data || err);
    return res
      .status(500)
      .json({ success: false, message: "YouTube search failed" });
  }
};
