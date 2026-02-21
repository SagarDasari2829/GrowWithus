import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import { roadmapApi } from "../services/api/roadmapApi";
import { getErrorMessage } from "../utils/helpers";
import { toYouTubeEmbedUrl } from "../utils/youtube";

export default function RoadmapBySlug() {
  const { slug } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoadmap = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await roadmapApi.getRoadmapBySlug(slug);
        setRoadmap(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadmap();
  }, [slug]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Loader label="Loading roadmap..." />
      </section>
    );
  }

  if (error || !roadmap) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-red-600">{error || "Roadmap not found"}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <Card className="space-y-2">
        <h1 className="text-2xl font-bold">{roadmap.title}</h1>
        <p className="text-sm text-slate-500">
          {roadmap.category} | {roadmap.difficulty}
        </p>
      </Card>

      {roadmap.topics?.map((topic, idx) => (
        <Card key={`${topic.title}-${idx}`} className="space-y-4">
          <h2 className="text-xl font-semibold">{topic.title}</h2>
          {topic.practiceTask && <p className="text-sm text-slate-600">{topic.practiceTask}</p>}

          <div className="grid gap-3 md:grid-cols-2">
            {topic.videos?.map((video) => (
              <div key={`${video.youtubeId}-${video.title}`} className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-medium">{video.title}</p>
                <p className="text-xs text-slate-500">{video.channel}</p>
                <iframe
                  width="100%"
                  height="220"
                  src={toYouTubeEmbedUrl(video.youtubeId)}
                  title={video.title}
                  className="rounded-md"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </section>
  );
}
