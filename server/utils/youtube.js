// utils/youtube.js
const axios = require("axios");

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

/**
 * Search YouTube for a single embeddable video.
 * @param {string} query - search term
 * @returns {Promise<object|null>}
 */
async function searchYouTube(query) {
  if (!query || !API_KEY) return null;

  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 1,
        videoEmbeddable: true,
        safeSearch: "moderate",
      },
    });

    const item = data?.items?.[0];
    if (!item) return null;

    const videoId = item.id.videoId;
    const snippet = item.snippet;

    return {
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title: snippet.title,
      thumbnail:
        snippet.thumbnails?.high?.url ||
        snippet.thumbnails?.medium?.url ||
        snippet.thumbnails?.default?.url,
    };
  } catch (err) {
    console.error("[YouTube API error]", err?.response?.data || err.message);
    return null;
  }
}

module.exports = { searchYouTube };
