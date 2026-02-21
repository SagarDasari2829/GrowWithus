import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import ProgressBar from "../components/common/ProgressBar";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { progressApi } from "../services/api/progressApi";
import { getErrorMessage } from "../utils/helpers";

function StatCard({ title, value, subtext }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{subtext}</p>
    </article>
  );
}

function formatRelativeDate(dateValue) {
  if (!dateValue) return "Recently";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return parsed.toLocaleDateString();
}

export default function Dashboard() {
  const { user } = useAuth();
  const [progressItems, setProgressItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await progressApi.getMyProgress();
        setProgressItems(res.data || []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  const metrics = useMemo(() => {
    const totalRoadmaps = progressItems.length;
    const completedRoadmaps = progressItems.filter((item) => (item.completionPercent || 0) >= 100).length;
    const activeRoadmaps = progressItems.filter((item) => {
      const value = item.completionPercent || 0;
      return value > 0 && value < 100;
    }).length;
    const averageProgress =
      totalRoadmaps > 0
        ? Math.round(
            progressItems.reduce((sum, item) => sum + (item.completionPercent || 0), 0) / totalRoadmaps
          )
        : 0;

    return { totalRoadmaps, completedRoadmaps, activeRoadmaps, averageProgress };
  }, [progressItems]);

  const recentActivity = useMemo(
    () =>
      [...progressItems]
        .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
        .slice(0, 5),
    [progressItems]
  );

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr]">
      <Sidebar isAdmin={user?.role === "admin"} />

      <main className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-sm">
          <p className="text-sm text-indigo-100">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{user?.name || "Learner Dashboard"}</h1>
          <p className="mt-2 text-sm text-indigo-100">
            Role: <span className="font-semibold text-white">{user?.role || "student"}</span>
            {user?.year ? ` | Year: ${user.year}` : ""}
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Roadmaps" value={metrics.totalRoadmaps} subtext="Tracks started" />
          <StatCard title="Active Progress" value={metrics.activeRoadmaps} subtext="Currently in progress" />
          <StatCard title="Completed" value={metrics.completedRoadmaps} subtext="Finished tracks" />
          <StatCard title="Avg Completion" value={`${metrics.averageProgress}%`} subtext="Across all tracks" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Progress Overview</h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {metrics.averageProgress}% avg
              </span>
            </div>

            {isLoading && <Loader label="Loading your dashboard" />}
            {!isLoading && error && <p className="text-sm text-red-600">{error}</p>}

            {!isLoading && !error && !progressItems.length && (
              <EmptyState
                title="No progress yet"
                description="Start a roadmap to unlock progress tracking, activity insights, and completion stats."
              />
            )}

            {!isLoading && !error && progressItems.length > 0 && (
              <div className="space-y-4">
                {progressItems.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:bg-white hover:shadow-sm"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-slate-800">{item.roadmap?.title || "Roadmap"}</p>
                      <p className="text-sm font-semibold text-slate-600">{item.completionPercent || 0}%</p>
                    </div>
                    <ProgressBar value={item.completionPercent || 0} />
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <p className="mt-1 text-sm text-slate-500">Latest updates from your learning journey</p>

            <div className="mt-5 space-y-4">
              {!isLoading && !error && recentActivity.length === 0 && (
                <EmptyState
                  title="No recent activity"
                  description="Your activity feed will appear once you begin completing roadmap modules."
                />
              )}

              {recentActivity.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-200 p-4 transition-all duration-300 hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.roadmap?.title || "Roadmap"}</p>
                      <p className="mt-1 text-xs text-slate-500">Progress updated to {item.completionPercent || 0}%</p>
                    </div>
                    <span className="text-xs text-slate-400">{formatRelativeDate(item.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        {user?.role === "admin" && (
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-indigo-900">Admin Controls</h2>
                <p className="mt-1 text-sm text-indigo-700">
                  Manage roadmap quality, review learner progress trends, and maintain platform standards.
                </p>
              </div>
              <Link
                to="/admin"
                className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl"
              >
                Open Admin Panel
              </Link>
            </div>
          </section>
        )}
      </main>
    </section>
  );
}
