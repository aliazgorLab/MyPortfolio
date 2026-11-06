"use client";

import { useState, useEffect } from "react";
import {
  getProjectsAction,
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  toggleProjectPublishAction,
} from "@/lib/actions/projects";
import {
  Plus,
  FolderGit2,
  ExternalLink,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Search,
  X,
  AlertCircle,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    number: "01",
    category: "",
    tagline: "",
    description: "",
    long_description: "",
    features: "",
    tech: "",
    year: "2024",
    cover_image_url: "",
    live_url: "",
    github_url: "",
    accent: "#C7B8FF",
    metrics: "",
    is_featured: false,
    status: "draft",
  });

  const loadProjects = async () => {
    setLoading(true);
    const res = await getProjectsAction();
    if (res.success) {
      setProjects(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      number: `0${projects.length + 1}`,
      category: "Product Design / Frontend Development",
      tagline: "",
      description: "",
      long_description: "",
      features: "",
      tech: "React, Tailwind CSS, Next.js",
      year: new Date().getFullYear().toString(),
      cover_image_url: "",
      live_url: "",
      github_url: "",
      accent: "#C7B8FF",
      metrics: "",
      is_featured: false,
      status: "draft",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      number: p.number,
      category: p.category,
      tagline: p.tagline || "",
      description: p.description,
      long_description: p.long_description || "",
      features: Array.isArray(p.features) ? p.features.join("\n") : "",
      tech: Array.isArray(p.tech) ? p.tech.join(", ") : "",
      year: p.year,
      cover_image_url: p.cover_image_url || "",
      live_url: p.live_url || "",
      github_url: p.github_url || "",
      accent: p.accent || "#C7B8FF",
      metrics: p.metrics || "",
      is_featured: p.is_featured,
      status: p.status,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const payload = {
      ...formData,
      features: formData.features
        ? formData.features.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      tech: formData.tech
        ? formData.tech.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    let res;
    if (editingProject) {
      res = await updateProjectAction(editingProject.id, payload);
    } else {
      res = await createProjectAction(payload);
    }

    if (!res.success) {
      setFormError(res.error);
      setFormLoading(false);
      return;
    }

    setModalOpen(false);
    setFormLoading(false);
    loadProjects();
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await deleteProjectAction(id);
    if (res.success) {
      loadProjects();
    } else {
      alert(res.error);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    const res = await toggleProjectPublishAction(id, nextStatus);
    if (res.success) {
      loadProjects();
    } else {
      alert(res.error);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filter !== "ALL" && p.status !== filter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-lavender tracking-widest uppercase mb-1">
            <span>INDEX // 02</span>
            <span>·</span>
            <span>CASE STUDIES</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
            PROJECT MANAGEMENT
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_20px_rgba(199,184,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PROJECT</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "PUBLISHED", "DRAFT"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all ${
                filter === st
                  ? "bg-lavender text-obsidian font-semibold"
                  : "bg-surface-100 text-muted hover:text-softwhite border border-white/5"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-100/70 border border-white/10 text-xs font-sans text-softwhite focus:outline-none focus:border-lavender transition-colors"
          />
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-muted">
          Loading portfolio projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
          No projects match the current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-white/5 border border-white/10 rounded-2xl bg-surface-100/40 backdrop-blur-xl overflow-hidden">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-200/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-lavender font-bold mt-1">
                  {p.number}
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-base font-bold text-softwhite">
                      {p.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase ${
                        p.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-muted/80 mt-1 line-clamp-1">
                    {p.tagline ? `${p.tagline} — ` : ""}{p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.tech && p.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-200/80 text-muted border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleTogglePublish(p.id, p.status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all border ${
                    p.status === "published"
                      ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  }`}
                >
                  {p.status === "published" ? "UNPUBLISH" : "PUBLISH"}
                </button>

                {p.status === "published" && (
                  <a
                    href={`/work/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View case study page"
                    className="p-2 rounded-lg border border-white/10 bg-surface-200/60 text-muted hover:text-lavender transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => openEditModal(p)}
                  title="Edit project"
                  className="p-2 rounded-lg border border-white/10 bg-surface-200/60 text-muted hover:text-softwhite transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  title="Delete project"
                  className="p-2 rounded-lg border border-white/10 bg-surface-200/60 text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite hover:bg-surface-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-softwhite mb-1">
              {editingProject ? "EDIT PROJECT" : "CREATE NEW PROJECT"}
            </h2>
            <p className="font-sans text-xs text-muted/70 mb-6">
              Configure metadata, architecture notes, and case study links.
            </p>

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setFormData({
                        ...formData,
                        title: t,
                        slug: !editingProject ? t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : formData.slug,
                      });
                    }}
                    placeholder="e.g. OsMentor AI"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    URL Slug * (lowercase-alphanumeric-hyphens)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. osmentor-ai"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Index Number
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Accent Color Hex
                  </label>
                  <input
                    type="text"
                    value={formData.accent}
                    onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Product Design / Frontend Development"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Intelligent RAG Learning Platform"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Short Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview shown on cards..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Full Architecture Narrative (Case Study Page)
                </label>
                <textarea
                  rows={4}
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  placeholder="Deep dive into system challenges, architecture decisions..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Core Implementations (1 feature per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Line 1: High throughput vector embeddings&#10;Line 2: RAG graph visualizer"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tech}
                    onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                    placeholder="React, Next.js, FastAPI"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Production Metric
                  </label>
                  <input
                    type="text"
                    value={formData.metrics}
                    onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                    placeholder="Sub-400ms vector retrieval"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-sans text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Live Demo / App URL
                  </label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    GitHub Source URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-white/20 bg-surface-200 text-lavender focus:ring-lavender"
                />
                <label htmlFor="is_featured" className="font-mono text-xs text-softwhite">
                  Mark as Featured Project on Landing Showcase
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-surface-200/50 text-xs font-mono text-muted hover:text-softwhite transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_15px_rgba(199,184,255,0.25)] disabled:opacity-50"
                >
                  {formLoading ? "SAVING..." : editingProject ? "UPDATE PROJECT" : "CREATE PROJECT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

