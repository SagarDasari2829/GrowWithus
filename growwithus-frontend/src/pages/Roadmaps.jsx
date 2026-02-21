import { useEffect, useMemo, useState } from "react";
import Loader from "../components/common/Loader";
import RoadmapCard from "../components/roadmaps/RoadmapCard";
import { CATEGORY_OPTIONS, DIFFICULTY_OPTIONS } from "../constants/roadmapMeta";
import { progressApi } from "../services/api/progressApi";
import { roadmapApi } from "../services/api/roadmapApi";
import { getErrorMessage } from "../utils/helpers";

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [filters, setFilters] = useState({ category: "", difficulty: "", q: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRoadmaps = async (nextFilters = filters) => {
    setIsLoading(true);
    setError("");

    try {
      const params = {};
      if (nextFilters.category) params.category = nextFilters.category;
      if (nextFilters.difficulty) params.difficulty = nextFilters.difficulty;
      if (nextFilters.q?.trim()) params.q = nextFilters.q.trim();

      const [roadmapsRes, progressRes] = await Promise.all([roadmapApi.getRoadmaps(params), progressApi.getMyProgress()]);

      const nextRoadmaps = Array.isArray(roadmapsRes.data) ? roadmapsRes.data : [];
      setRoadmaps(nextRoadmaps);

      const nextProgress = Array.isArray(progressRes.data) ? progressRes.data : [];
      const map = nextProgress.reduce((acc, item) => {
        const roadmapId = item.roadmap?._id;
        if (roadmapId) {
          acc[roadmapId] = item.completionPercent || 0;
        }
        return acc;
      }, {});
      setProgressMap(map);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const filteredCountText = useMemo(() => `${roadmaps.length} roadmap${roadmaps.length === 1 ? "" : "s"} found`, [roadmaps.length]);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-20">
      <header className="mb-10">
        <div className="mb-4 h-1 w-20 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600" />
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Explore Career Roadmaps</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Discover curated, role-based learning paths built to help you develop practical IT skills and track measurable progress.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</span>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Difficulty</option>
              {DIFFICULTY_OPTIONS.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2 lg:col-span-1">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search</span>
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              >
                <path d="M21 21l-4.3-4.3m1.8-4.2a6 6 0 1 1-12 0 6 6 0 0 1 12 0z" />
              </svg>
              <input
                value={filters.q}
                onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
                placeholder="Search title or description"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => loadRoadmaps(filters)}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{filteredCountText}</p>
      </div>

      {isLoading && (
        <div className="mt-8">
          <Loader label="Loading roadmaps" />
        </div>
      )}

      {!isLoading && error && <p className="mt-8 text-sm font-medium text-red-600">{error}</p>}

      {!isLoading && !error && !roadmaps.length && (
        <section className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
              <path d="M21 21l-4.3-4.3m1.8-4.2a6 6 0 1 1-12 0 6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900">No roadmaps found</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Try changing category, difficulty, or search terms to discover more learning tracks.
          </p>
          <button
            type="button"
            onClick={() => {
              const reset = { category: "", difficulty: "", q: "" };
              setFilters(reset);
              loadRoadmaps(reset);
            }}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl"
          >
            Clear Filters
          </button>
        </section>
      )}

      {!isLoading && !error && roadmaps.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap._id} roadmap={roadmap} progressPercent={progressMap[roadmap._id] || 0} />
          ))}
        </div>
      )}
    </section>
  );
}
