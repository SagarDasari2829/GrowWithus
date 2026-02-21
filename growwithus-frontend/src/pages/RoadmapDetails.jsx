import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "../components/common/Alert";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import ProgressBar from "../components/common/ProgressBar";
import ModuleChecklist from "../components/roadmaps/ModuleChecklist";
import { progressApi } from "../services/api/progressApi";
import { roadmapApi } from "../services/api/roadmapApi";
import { calculateCompletionPercent, getErrorMessage } from "../utils/helpers";

export default function RoadmapDetails() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [roadmapRes, progressRes] = await Promise.all([roadmapApi.getRoadmapById(id), progressApi.getMyProgress()]);
        const nextRoadmap = roadmapRes.data;
        setRoadmap(nextRoadmap);

        const progress = (progressRes.data || []).find((item) => item.roadmap?._id === id);
        setCompletedTopics(progress?.completedModules || []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const completionPercent = useMemo(() => {
    const totalTopics = roadmap?.topics?.length || 0;
    return calculateCompletionPercent(totalTopics, completedTopics.length);
  }, [roadmap, completedTopics.length]);

  const toggleTopic = (title) => {
    setCompletedTopics((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const saveProgress = async () => {
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      await progressApi.upsertProgress({
        roadmapId: id,
        completedModules: completedTopics,
        completionPercent
      });
      setSuccess("Progress updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Loader label="Loading roadmap details" />
      </section>
    );
  }

  if (error && !roadmap) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Alert message={error} type="error" />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <Card className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{roadmap.category}</p>
        <h1 className="text-2xl font-bold">{roadmap.title}</h1>
        <p className="text-sm text-slate-500">
          {roadmap.difficulty} | {roadmap.estimatedDuration}
        </p>
        <p className="text-slate-600">{roadmap.description || "No description provided."}</p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Topic Progress</h2>
        <ProgressBar value={completionPercent} />
        <ModuleChecklist
          topics={roadmap.topics || []}
          completedTopicTitles={completedTopics}
          onToggleTopic={toggleTopic}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={saveProgress} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Progress"}
          </Button>
          <Alert message={success} type="success" />
          <Alert message={error} type="error" />
        </div>
      </Card>

      <div className="grid gap-4">
        <Card className="space-y-2">
          <h3 className="text-lg font-semibold">Projects</h3>
          {!roadmap.projects?.length && <p className="text-sm text-slate-500">No projects defined.</p>}
          {roadmap.projects?.map((project, idx) => (
            <div key={`${project.title}-${idx}`} className="rounded-md border border-slate-200 p-3">
              <p className="font-medium">{project.title}</p>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
