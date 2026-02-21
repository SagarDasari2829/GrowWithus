import { Link } from "react-router-dom";

function Badge({ children, tone = "slate" }) {
  const toneClass =
    tone === "indigo"
      ? "border-indigo-100 bg-indigo-50 text-indigo-700"
      : "border-slate-200 bg-slate-50 text-slate-600";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass}`}>{children}</span>;
}

export default function RoadmapCard({ roadmap, progressPercent = 0 }) {
  const safeProgress = Math.max(0, Math.min(100, Number(progressPercent) || 0));

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <Badge tone="indigo">{roadmap.category || "General"}</Badge>
        <Badge>{roadmap.difficulty || "Beginner"}</Badge>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">{roadmap.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
        {roadmap.description || "No description available yet for this roadmap."}
      </p>

      <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
        <span>{roadmap.topics?.length || 0} topics</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span>{roadmap.estimatedDuration || "Self-paced"}</span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Progress</span>
          <span>{safeProgress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-100">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-300"
            style={{ width: `${safeProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/roadmaps/${roadmap._id}`}
          className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700"
        >
          Track Progress
        </Link>
        <Link
          to={`/learn/${roadmap.slug}`}
          className="inline-flex rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition-all duration-300 hover:bg-indigo-50"
        >
          Open Content
        </Link>
      </div>
    </article>
  );
}
