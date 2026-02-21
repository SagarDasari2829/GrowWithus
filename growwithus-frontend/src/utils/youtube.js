export function extractYouTubeId(input) {
  if (!input) return "";
  const value = String(input).trim();

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

export function toYouTubeWatchUrl(input) {
  const id = extractYouTubeId(input);
  return id ? `https://www.youtube.com/watch?v=${id}` : "";
}

export function toYouTubeEmbedUrl(input) {
  const id = extractYouTubeId(input);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

export function normalizeRoadmapVideos(payload) {
  const copy = JSON.parse(JSON.stringify(payload));
  const topics = copy.topics || [];

  topics.forEach((topic) => {
    topic.videos = (topic.videos || []).map((video) => ({
      ...video,
      youtubeId: extractYouTubeId(video.youtubeId || video.url || "")
    }));
  });

  return copy;
}
