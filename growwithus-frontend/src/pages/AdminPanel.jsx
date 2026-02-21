import { useEffect, useState } from "react";
import Alert from "../components/common/Alert";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import { CATEGORY_OPTIONS, DIFFICULTY_OPTIONS } from "../constants/roadmapMeta";
import { roadmapApi } from "../services/api/roadmapApi";
import { userApi } from "../services/api/userApi";
import { getErrorMessage } from "../utils/helpers";

function createVideo() {
  return { title: "", youtubeId: "", channel: "" };
}

function createTopic() {
  return { title: "", practiceTask: "", videos: [createVideo()] };
}

function createProject() {
  return { title: "" };
}

function createInitialForm() {
  return {
    slug: "",
    title: "",
    description: "",
    category: CATEGORY_OPTIONS[0],
    difficulty: DIFFICULTY_OPTIONS[0],
    estimatedDuration: "",
    topics: [createTopic()],
    projects: []
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toEditableForm(roadmap) {
  return {
    slug: roadmap.slug || "",
    title: roadmap.title || "",
    description: roadmap.description || "",
    category: roadmap.category || CATEGORY_OPTIONS[0],
    difficulty: roadmap.difficulty || DIFFICULTY_OPTIONS[0],
    estimatedDuration: roadmap.estimatedDuration || "",
    topics: (roadmap.topics || []).length
      ? roadmap.topics.map((topic) => ({
          title: topic.title || "",
          practiceTask: topic.practiceTask || "",
          videos: (topic.videos || []).length
            ? topic.videos.map((video) => ({
                title: video.title || "",
                youtubeId: video.youtubeId || "",
                channel: video.channel || ""
              }))
            : [createVideo()]
        }))
      : [createTopic()],
    projects: (roadmap.projects || []).map((project) => ({ title: project.title || "" }))
  };
}

function buildPayload(form) {
  const payload = {
    slug: slugify(form.slug || form.title),
    title: String(form.title || "").trim(),
    description: String(form.description || "").trim(),
    category: String(form.category || "").trim(),
    difficulty: String(form.difficulty || "").trim(),
    estimatedDuration: String(form.estimatedDuration || "").trim(),
    topics: (form.topics || []).map((topic) => ({
      title: String(topic.title || "").trim(),
      practiceTask: String(topic.practiceTask || "").trim(),
      videos: (topic.videos || [])
        .map((video) => ({
          title: String(video.title || "").trim(),
          youtubeId: String(video.youtubeId || "").trim(),
          channel: String(video.channel || "").trim()
        }))
        .filter((video) => video.title && video.youtubeId && video.channel)
    })),
    projects: (form.projects || [])
      .map((project) => ({ title: String(project.title || "").trim() }))
      .filter((project) => project.title)
  };

  if (!payload.slug || !payload.title || !payload.category || !payload.difficulty) {
    throw new Error("Please fill roadmap title, URL name, category, and difficulty.");
  }

  if (!payload.topics.length) {
    throw new Error("Please add at least one topic.");
  }

  for (const topic of payload.topics) {
    if (!topic.title) {
      throw new Error("Each topic needs a title.");
    }
    if (!topic.videos.length) {
      throw new Error("Each topic needs at least one valid video.");
    }
  }

  return payload;
}

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingRoadmaps, setIsLoadingRoadmaps] = useState(true);
  const [form, setForm] = useState(createInitialForm());
  const [editingRoadmapId, setEditingRoadmapId] = useState("");
  const [deletingRoadmapId, setDeletingRoadmapId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await userApi.getAllUsers();
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          setUsers([]);
          setError("Invalid users response from server.");
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const loadRoadmaps = async () => {
      try {
        const res = await roadmapApi.getRoadmaps();
        if (Array.isArray(res.data)) {
          setRoadmaps(res.data);
        } else {
          setRoadmaps([]);
          setError("Invalid roadmaps response from server.");
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoadingRoadmaps(false);
      }
    };

    loadRoadmaps();
  }, []);

  const refreshRoadmaps = async () => {
    const res = await roadmapApi.getRoadmaps();
    if (Array.isArray(res.data)) {
      setRoadmaps(res.data);
      return;
    }
    setRoadmaps([]);
    setError("Invalid roadmaps response from server.");
  };

  const updateForm = (updater) => {
    setForm((prev) => {
      const next = clone(prev);
      updater(next);
      return next;
    });
  };

  const startCreate = () => {
    setEditingRoadmapId("");
    setForm(createInitialForm());
    setError("");
    setSuccess("");
  };

  const startEdit = (roadmap) => {
    setEditingRoadmapId(roadmap._id);
    setForm(toEditableForm(roadmap));
    setError("");
    setSuccess("");
  };

  const handleDeleteRoadmap = async (roadmap) => {
    const confirmed = window.confirm(`Delete roadmap "${roadmap.title}"?`);
    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingRoadmapId(roadmap._id);

    try {
      await roadmapApi.deleteRoadmap(roadmap._id);
      await refreshRoadmaps();
      if (editingRoadmapId === roadmap._id) {
        startCreate();
      }
      setSuccess("Roadmap deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingRoadmapId("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload = buildPayload(form);
      if (editingRoadmapId) {
        await roadmapApi.updateRoadmap(editingRoadmapId, payload);
        setSuccess("Roadmap updated successfully.");
      } else {
        await roadmapApi.createRoadmap(payload);
        setSuccess("Roadmap created successfully.");
      }

      await refreshRoadmaps();
      startCreate();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add roadmap with simple structure: Roadmap to Topics to Videos.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Roadmap Title</label>
              <input
                value={form.title}
                onChange={(e) =>
                  updateForm((d) => {
                    d.title = e.target.value;
                    if (!d.slug) d.slug = slugify(e.target.value);
                  })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">URL Name</label>
              <input
                value={form.slug}
                onChange={(e) =>
                  updateForm((d) => {
                    d.slug = slugify(e.target.value);
                  })
                }
                placeholder="python-programming"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                updateForm((d) => {
                  d.description = e.target.value;
                })
              }
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  updateForm((d) => {
                    d.category = e.target.value;
                  })
                }
              >
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) =>
                  updateForm((d) => {
                    d.difficulty = e.target.value;
                  })
                }
              >
                {DIFFICULTY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Estimated Duration</label>
              <input
                value={form.estimatedDuration}
                onChange={(e) =>
                  updateForm((d) => {
                    d.estimatedDuration = e.target.value;
                  })
                }
                placeholder="e.g. 6 weeks"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Topics</h2>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  updateForm((d) => {
                    d.topics.push(createTopic());
                  })
                }
              >
                Add Topic
              </Button>
            </div>

            {form.topics.map((topic, tIdx) => (
              <div key={`topic-${tIdx}`} className="space-y-3 rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={topic.title}
                    onChange={(e) =>
                      updateForm((d) => {
                        d.topics[tIdx].title = e.target.value;
                      })
                    }
                    placeholder="Topic title"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={form.topics.length === 1}
                    onClick={() =>
                      updateForm((d) => {
                        d.topics.splice(tIdx, 1);
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>

                <textarea
                  rows={2}
                  value={topic.practiceTask}
                  onChange={(e) =>
                    updateForm((d) => {
                      d.topics[tIdx].practiceTask = e.target.value;
                    })
                  }
                  placeholder="Practice task / notes"
                />

                <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Videos</p>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        updateForm((d) => {
                          d.topics[tIdx].videos.push(createVideo());
                        })
                      }
                    >
                      Add Video
                    </Button>
                  </div>

                  {topic.videos.map((video, vIdx) => (
                    <div key={`video-${tIdx}-${vIdx}`} className="grid gap-2 md:grid-cols-4">
                      <input
                        value={video.title}
                        onChange={(e) =>
                          updateForm((d) => {
                            d.topics[tIdx].videos[vIdx].title = e.target.value;
                          })
                        }
                        placeholder="Video title"
                      />
                      <input
                        value={video.youtubeId}
                        onChange={(e) =>
                          updateForm((d) => {
                            d.topics[tIdx].videos[vIdx].youtubeId = e.target.value;
                          })
                        }
                        placeholder="YouTube URL or ID"
                      />
                      <input
                        value={video.channel}
                        onChange={(e) =>
                          updateForm((d) => {
                            d.topics[tIdx].videos[vIdx].channel = e.target.value;
                          })
                        }
                        placeholder="Channel name"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={topic.videos.length === 1}
                        onClick={() =>
                          updateForm((d) => {
                            d.topics[tIdx].videos.splice(vIdx, 1);
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Projects (Optional)</h2>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  updateForm((d) => {
                    d.projects.push(createProject());
                  })
                }
              >
                Add Project
              </Button>
            </div>
            {form.projects.map((project, pIdx) => (
              <div key={`project-${pIdx}`} className="grid gap-2 md:grid-cols-2">
                <input
                  value={project.title}
                  onChange={(e) =>
                    updateForm((d) => {
                      d.projects[pIdx].title = e.target.value;
                    })
                  }
                  placeholder="Project title"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    updateForm((d) => {
                      d.projects.splice(pIdx, 1);
                    })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Alert message={error} type="error" />
          <Alert message={success} type="success" />

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingRoadmapId ? "Update Roadmap" : "Create Roadmap"}
            </Button>
            <Button type="button" variant="secondary" onClick={startCreate}>
              Reset Form
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        <Card>
          <h2 className="text-xl font-semibold">Existing Roadmaps</h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">Edit or delete existing roadmaps.</p>

          {isLoadingRoadmaps && <Loader label="Loading roadmaps" />}
          {!isLoadingRoadmaps && !roadmaps.length && (
            <EmptyState title="No roadmaps yet" description="Create your first roadmap using the form." />
          )}
          <div className="space-y-2">
            {roadmaps.map((roadmap) => (
              <div key={roadmap._id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
                <div>
                  <p className="font-medium">{roadmap.title}</p>
                  <p className="text-xs text-slate-500">URL Name: {roadmap.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => startEdit(roadmap)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    disabled={deletingRoadmapId === roadmap._id}
                    onClick={() => handleDeleteRoadmap(roadmap)}
                  >
                    {deletingRoadmapId === roadmap._id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Registered Users</h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">Admin-only view of platform users.</p>

          {isLoadingUsers && <Loader label="Loading users" />}
          {!isLoadingUsers && !users.length && (
            <EmptyState title="No users yet" description="User records will appear here after sign-up." />
          )}
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user._id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {user.role} | Year {user.year || "-"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
