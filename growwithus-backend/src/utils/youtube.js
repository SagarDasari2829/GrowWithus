const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

function extractYouTubeId(input) {
  const value = String(input || "").trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) return match[1];
  }

  return value;
}

function sanitizeVideos(videos) {
  if (!Array.isArray(videos) || videos.length === 0) {
    throw new Error("Each topic must have at least one video");
  }

  return videos.map((video) => {
    const youtubeId = extractYouTubeId(video.youtubeId || video.url || "");
    if (!YOUTUBE_ID_REGEX.test(youtubeId)) {
      throw new Error(`Invalid YouTube link or ID for video: ${video.title || "Untitled"}`);
    }

    const title = String(video.title || "").trim();
    const channel = String(video.channel || "").trim();
    if (!title || !channel) {
      throw new Error("Video title and channel are required");
    }

    return { title, youtubeId, channel };
  });
}

function sanitizeTopics(topics) {
  if (!Array.isArray(topics) || topics.length === 0) {
    throw new Error("At least one topic is required");
  }

  return topics.map((topic) => {
    const title = String(topic.title || "").trim();
    if (!title) {
      throw new Error("Topic title is required");
    }

    return {
      title,
      practiceTask: String(topic.practiceTask || "").trim(),
      videos: sanitizeVideos(topic.videos || [])
    };
  });
}

module.exports = {
  extractYouTubeId,
  sanitizeTopics
};

