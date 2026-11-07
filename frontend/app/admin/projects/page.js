"use client";

import { useState, useEffect } from "react";
import {
  getProjectsAction,
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  toggleProjectPublishAction,
  purgeDemoProjectsAction,
  seedDemoProjectsAction,
} from "@/lib/actions/projects";
import {
  getCreativeWorldsAction,
  getCreativeCategoriesAction,
} from "@/lib/actions/categories";
import {
  getMediaListAction,
  createUploadIntentAction,
  confirmUploadAction,
} from "@/lib/actions/media";
import { parseVideoUrl } from "@/lib/validations/video";
import {
  Plus,
  FolderGit2,
  ExternalLink,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Search,
  X,
  AlertCircle,
  Globe,
  Film,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Play,
  RotateCcw,
  Check,
  Flame,
  Info,
  Upload,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";

const WORLD_OPTIONS = [
  { slug: "graphic-design", label: "Graphic Design", accent: "#F46A45" },
  { slug: "ui-ux-design", label: "UI/UX Design", accent: "#FF8662" },
  { slug: "web-development", label: "Web Development", accent: "#E65A32" },
  { slug: "video-motion", label: "Video & Motion", accent: "#9B3825" },
];

const ASPECT_RATIO_OPTIONS = ["16:9", "9:16", "1:1", "4:5", "21:9", "4:3"];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [worlds, setWorlds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [filter, setFilter] = useState("ALL");
  const [worldFilter, setWorldFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Gallery Sub-form Local State
  const [galleryAddMode, setGalleryAddMode] = useState("url"); // 'url' | 'upload'
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");
  const [newGalleryAlt, setNewGalleryAlt] = useState("");

  // Media Library Picker Modal State
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState("cover"); // 'cover' | 'gallery'
  const [mediaList, setMediaList] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Demo Purge Modal State
  const [purgeModalOpen, setPurgeModalOpen] = useState(false);
  const [purgeConfirmationText, setPurgeConfirmationText] = useState("");
  const [purgeLoading, setPurgeLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  // Toast Feedback State
  const [feedback, setFeedback] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    number: "01",
    world_slug: "web-development",
    world_id: null,
    creative_category_id: null,
    category: "Web Applications",
    client: "",
    tagline: "",
    description: "",
    long_description: "",
    features: "",
    tech: "",
    year: new Date().getFullYear().toString(),
    cover_image_url: "",
    cover_image_id: null,
    live_url: "",
    github_url: "",
    prototype_url: "",
    video_url: "",
    video_provider: "none",
    aspect_ratio: "16:9",
    accent: "#F46A45",
    metrics: "",
    is_featured: false,
    is_demo: false,
    status: "draft",
    gallery_images: [],
  });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4500);
  };

  const loadAllData = async () => {
    setLoading(true);
    const [pRes, wRes, cRes] = await Promise.all([
      getProjectsAction(),
      getCreativeWorldsAction(),
      getCreativeCategoriesAction(),
    ]);

    if (pRes.success) setProjects(pRes.data || []);
    if (wRes.success) setWorlds(wRes.data || []);
    if (cRes.success) setCategories(cRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filter categories dynamically based on selected world
  const currentWorldCategories = categories.filter((c) => {
    if (!formData.world_slug) return true;
    return c.world_slug === formData.world_slug;
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      number: `0${projects.length + 1}`,
      world_slug: "web-development",
      world_id: worlds.find((w) => w.slug === "web-development")?.id || null,
      creative_category_id: null,
      category: "Web Applications",
      client: "",
      tagline: "",
      description: "",
      long_description: "",
      features: "",
      tech: "Next.js, React, Tailwind CSS",
      year: new Date().getFullYear().toString(),
      cover_image_url: "",
      cover_image_id: null,
      live_url: "",
      github_url: "",
      prototype_url: "",
      video_url: "",
      video_provider: "none",
      aspect_ratio: "16:9",
      accent: "#F46A45",
      metrics: "",
      is_featured: false,
      is_demo: false,
      status: "draft",
      gallery_images: [],
    });
    setNewGalleryUrl("");
    setNewGalleryCaption("");
    setNewGalleryAlt("");
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    setFormData({
      title: p.title || "",
      slug: p.slug || "",
      number: p.number || "01",
      world_slug: p.world_slug || "web-development",
      world_id: p.world_id || null,
      creative_category_id: p.creative_category_id || null,
      category: p.category || "",
      client: p.client || "",
      tagline: p.tagline || "",
      description: p.description || "",
      long_description: p.long_description || "",
      features: Array.isArray(p.features) ? p.features.join("\n") : "",
      tech: Array.isArray(p.tech) ? p.tech.join(", ") : "",
      year: p.year || "2025",
      cover_image_url: p.cover_image_url || "",
      cover_image_id: p.cover_image_id || null,
      live_url: p.live_url || "",
      github_url: p.github_url || "",
      prototype_url: p.prototype_url || "",
      video_url: p.video_url || "",
      video_provider: p.video_provider || "none",
      aspect_ratio: p.aspect_ratio || "16:9",
      accent: p.accent || "#F46A45",
      metrics: p.metrics || "",
      is_featured: Boolean(p.is_featured),
      is_demo: Boolean(p.is_demo),
      status: p.status || "draft",
      gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : [],
    });
    setNewGalleryUrl("");
    setNewGalleryCaption("");
    setNewGalleryAlt("");
    setFormError(null);
    setModalOpen(true);
  };

  // -------------------------------------------------------------
  // Media Library Integration
  // -------------------------------------------------------------
  const openMediaPicker = async (target = "cover") => {
    setMediaTarget(target);
    setMediaModalOpen(true);
    setMediaLoading(true);
    const res = await getMediaListAction({ folder: "projects" });
    if (res.success) {
      setMediaList(res.data || []);
    }
    setMediaLoading(false);
  };

  const handleSelectFromLibrary = (item) => {
    const itemUrl = item.public_url || item.storage_path;
    if (mediaTarget === "cover") {
      setFormData((prev) => ({
        ...prev,
        cover_image_url: itemUrl,
        cover_image_id: item.id || null,
      }));
      showFeedback("success", "Cover image selected from media assets.");
    } else {
      const newItem = {
        id: item.id || `img-${Date.now()}`,
        url: itemUrl,
        caption: item.file_name?.replace(/\.[^/.]+$/, "") || "",
        alt_text: item.alt_text || item.file_name || "",
        display_order: formData.gallery_images.length + 1,
      };
      setFormData((prev) => ({
        ...prev,
        gallery_images: [...prev.gallery_images, newItem],
      }));
      showFeedback("success", "Image attached to gallery.");
    }
    setMediaModalOpen(false);
  };

  const handleUploadFileDirect = async (file, target = "gallery") => {
    if (!file) return;
    if (target === "cover") setUploadingCover(true);
    else setUploadingGallery(true);

    try {
      // 1. Get Signed Upload URL from server
      const intentRes = await createUploadIntentAction({
        filename: file.name,
        size_bytes: file.size,
        mime_type: file.type,
        folder: "projects",
        is_draft: false,
      });

      if (!intentRes.success) throw new Error(intentRes.error);

      const { signedUrl, storagePath, bucket } = intentRes.data;

      // 2. Client direct PUT to signed URL
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed with HTTP status ${uploadRes.status}`);
      }

      // 3. Confirm upload on server
      const confirmRes = await confirmUploadAction({
        storage_path: storagePath,
        bucket,
        folder: "projects",
        file_name: file.name,
        size_bytes: file.size,
        mime_type: file.type,
        alt_text: file.name.replace(/\.[^/.]+$/, ""),
      });

      if (!confirmRes.success) throw new Error(confirmRes.error);

      const publicUrl = confirmRes.data?.public_url || storagePath;

      if (target === "cover") {
        setFormData((prev) => ({
          ...prev,
          cover_image_url: publicUrl,
          cover_image_id: confirmRes.data?.id || null,
        }));
        showFeedback("success", "Cover image uploaded and linked.");
      } else {
        const newItem = {
          id: confirmRes.data?.id || `img-${Date.now()}`,
          url: publicUrl,
          caption: file.name.replace(/\.[^/.]+$/, ""),
          alt_text: file.name.replace(/\.[^/.]+$/, ""),
          display_order: formData.gallery_images.length + 1,
        };
        setFormData((prev) => ({
          ...prev,
          gallery_images: [...prev.gallery_images, newItem],
        }));
        showFeedback("success", "File uploaded and added to gallery.");
      }
    } catch (err) {
      showFeedback("error", err.message || "Failed to upload file.");
    } finally {
      if (target === "cover") setUploadingCover(false);
      else setUploadingGallery(false);
    }
  };

  // Add item to local gallery list via URL
  const handleAddGalleryImageUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const newItem = {
      id: `img-${Date.now()}`,
      url: newGalleryUrl.trim(),
      caption: newGalleryCaption.trim(),
      alt_text: newGalleryAlt.trim(),
      display_order: formData.gallery_images.length + 1,
    };
    setFormData({
      ...formData,
      gallery_images: [...formData.gallery_images, newItem],
    });
    setNewGalleryUrl("");
    setNewGalleryCaption("");
    setNewGalleryAlt("");
  };

  const handleRemoveGalleryImage = (index) => {
    const updated = formData.gallery_images.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery_images: updated });
  };

  const handleMoveGalleryImage = (index, direction) => {
    const list = [...formData.gallery_images];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    // Update order numbers
    const reordered = list.map((item, idx) => ({ ...item, display_order: idx + 1 }));
    setFormData({ ...formData, gallery_images: reordered });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    // Prepare payload
    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      number: formData.number.trim(),
      world_slug: formData.world_slug || null,
      world_id: formData.world_id || null,
      creative_category_id: formData.creative_category_id || null,
      category: formData.category.trim(),
      client: formData.client.trim() || undefined,
      tagline: formData.tagline.trim() || undefined,
      description: formData.description.trim(),
      long_description: formData.long_description.trim() || undefined,
      features: formData.features
        ? formData.features
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      tech: formData.tech
        ? formData.tech
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      year: formData.year.trim(),
      cover_image_url: formData.cover_image_url.trim() || undefined,
      cover_image_id: formData.cover_image_id || null,
      live_url: formData.live_url.trim() || undefined,
      github_url: formData.github_url.trim() || undefined,
      prototype_url: formData.prototype_url.trim() || undefined,
      video_url: formData.video_url.trim() || undefined,
      aspect_ratio: formData.aspect_ratio || "16:9",
      accent: formData.accent.trim() || "#F46A45",
      metrics: formData.metrics.trim() || undefined,
      is_featured: Boolean(formData.is_featured),
      is_demo: Boolean(formData.is_demo),
      status: formData.status || "draft",
      gallery_images: formData.gallery_images || [],
    };

    let res;
    if (editingProject) {
      res = await updateProjectAction(editingProject.id, payload);
    } else {
      res = await createProjectAction(payload);
    }

    setFormLoading(false);

    if (!res.success) {
      setFormError(res.error);
      return;
    }

    setModalOpen(false);
    showFeedback("success", res.message || "Work item saved successfully.");
    loadAllData();
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await deleteProjectAction(id);
    if (res.success) {
      showFeedback("success", "Work item deleted successfully.");
      loadAllData();
    } else {
      showFeedback("error", res.error);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    const res = await toggleProjectPublishAction(id, nextStatus);
    if (res.success) {
      showFeedback("success", res.message || "Status updated.");
      loadAllData();
    } else {
      showFeedback("error", res.error);
    }
  };

  // Demo Actions
  const handleSeedDemo = async () => {
    if (
      !confirm(
        "Generate demonstration records across all 4 Creative Worlds? These records are strictly flagged (is_demo = true) and can be purged anytime."
      )
    ) {
      return;
    }
    setSeedLoading(true);
    const res = await seedDemoProjectsAction();
    setSeedLoading(false);
    if (res.success) {
      showFeedback("success", res.message || "Demonstration records seeded.");
      loadAllData();
    } else {
      showFeedback("error", res.error);
    }
  };

  const handlePurgeDemo = async () => {
    if (purgeConfirmationText.trim() !== "DELETE DEMO CONTENT") {
      alert("Please type 'DELETE DEMO CONTENT' exactly to confirm purge.");
      return;
    }
    setPurgeLoading(true);
    const res = await purgeDemoProjectsAction({
      confirmationText: purgeConfirmationText,
    });
    setPurgeLoading(false);
    if (res.success) {
      setPurgeModalOpen(false);
      setPurgeConfirmationText("");
      showFeedback("success", res.message || "Demonstration records purged.");
      loadAllData();
    } else {
      showFeedback("error", res.error);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    // World Filter
    if (worldFilter !== "ALL" && p.world_slug !== worldFilter) {
      return false;
    }
    // Status / Demo Filter
    if (filter === "PUBLISHED" && p.status !== "published") return false;
    if (filter === "DRAFT" && p.status !== "draft") return false;
    if (filter === "DEMO" && !p.is_demo) return false;

    // Search
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.client && p.client.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const demoCount = projects.filter((p) => p.is_demo).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-mono flex items-center justify-between border shadow-lg ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-muted hover:text-softwhite">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-orange tracking-widest uppercase mb-1">
            <span>INDEX // 02</span>
            <span>·</span>
            <span>CREATIVE UNIVERSE WORKITEMS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
            WORK & PROJECT MANAGEMENT
          </h1>
          <p className="font-sans text-xs text-muted/80 mt-1 max-w-2xl">
            Curate multi-disciplinary case studies, design artifacts, web applications, and video showreels across the Creative Universe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Seed Demo Works Button */}
          <button
            onClick={handleSeedDemo}
            disabled={seedLoading}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/10 bg-surface-200/50 text-muted hover:text-orange hover:border-orange/30 font-mono text-xs tracking-wider uppercase transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{seedLoading ? "SEEDING..." : "SEED DEMO WORKS"}</span>
          </button>

          {/* Purge Demo Works Button */}
          {demoCount > 0 && (
            <button
              onClick={() => {
                setPurgeConfirmationText("");
                setPurgeModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-mono text-xs tracking-wider uppercase transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>PURGE DEMOS ({demoCount})</span>
            </button>
          )}

          {/* Add New Project Button */}
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-orange-light transition-all shadow-[0_0_20px_rgba(244,106,69,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW WORK</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4">
        {/* World Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setWorldFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all shrink-0 ${
              worldFilter === "ALL"
                ? "bg-orange text-obsidian font-semibold shadow-[0_0_15px_rgba(244,106,69,0.2)]"
                : "bg-surface-100 text-muted hover:text-softwhite border border-white/5"
            }`}
          >
            ALL WORLDS ({projects.length})
          </button>
          {WORLD_OPTIONS.map((wo) => {
            const count = projects.filter((p) => p.world_slug === wo.slug).length;
            const isSelected = worldFilter === wo.slug;
            return (
              <button
                key={wo.slug}
                onClick={() => setWorldFilter(wo.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-orange text-obsidian font-semibold shadow-[0_0_15px_rgba(244,106,69,0.2)]"
                    : "bg-surface-100 text-muted hover:text-softwhite border border-white/5"
                }`}
              >
                <span>{wo.label}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Status Filter & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {["ALL", "PUBLISHED", "DRAFT", "DEMO"].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all ${
                  filter === st
                    ? "bg-surface-200 text-orange font-semibold border border-orange/30"
                    : "bg-surface-100 text-muted hover:text-softwhite border border-white/5"
                }`}
              >
                {st === "DEMO" ? `DEMO ONLY (${demoCount})` : st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, client, tech..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-100/70 border border-white/10 text-xs font-sans text-softwhite focus:outline-none focus:border-orange transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-muted">
          Loading Creative Universe work items...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-20 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
          No projects match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-white/5 border border-white/10 rounded-2xl bg-surface-100/40 backdrop-blur-xl overflow-hidden">
          {filteredProjects.map((p) => {
            const worldMeta = WORLD_OPTIONS.find((w) => w.slug === p.world_slug);
            const hasVideo = Boolean(p.video_url && p.video_url.trim());
            const galleryCount = Array.isArray(p.gallery_images)
              ? p.gallery_images.length
              : 0;

            return (
              <div
                key={p.id || p.slug}
                className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-200/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs text-orange font-bold mt-1">
                    {p.number || "01"}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-softwhite">
                        {p.title}
                      </h3>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border ${
                          p.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {p.status}
                      </span>

                      {/* World Badge */}
                      {worldMeta && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono border"
                          style={{
                            backgroundColor: `${worldMeta.accent}15`,
                            borderColor: `${worldMeta.accent}30`,
                            color: worldMeta.accent,
                          }}
                        >
                          {worldMeta.label}
                        </span>
                      )}

                      {/* Category Badge */}
                      {p.category && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-200 text-muted border border-white/5">
                          {p.category}
                        </span>
                      )}

                      {/* Demo Content Badge */}
                      {p.is_demo && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          DEMO RECORD
                        </span>
                      )}

                      {/* Featured Badge */}
                      {p.is_featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange/15 text-orange border border-orange/30">
                          FEATURED
                        </span>
                      )}

                      {/* Video Badge */}
                      {hasVideo && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Film className="w-3 h-3" />
                          <span>
                            {p.video_provider !== "none" ? p.video_provider : "video"} · {p.aspect_ratio || "16:9"}
                          </span>
                        </span>
                      )}

                      {/* Gallery Badge */}
                      {galleryCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          <ImageIcon className="w-3 h-3" />
                          <span>{galleryCount} images</span>
                        </span>
                      )}
                    </div>

                    {/* Tagline / Client / Description */}
                    <p className="font-sans text-xs text-muted/80 mt-1 line-clamp-1">
                      {p.client ? <strong className="text-softwhite font-mono">{p.client} — </strong> : null}
                      {p.tagline ? `${p.tagline} — ` : ""}
                      {p.description}
                    </p>

                    {/* Tech & Year */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="font-mono text-[10px] text-muted mr-1">
                        [{p.year || "2025"}]
                      </span>
                      {Array.isArray(p.tech) &&
                        p.tech.map((t) => (
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
                      className="p-2 rounded-lg border border-white/10 bg-surface-200/60 text-muted hover:text-orange transition-colors"
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
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CREATE / EDIT WORK ITEM MODAL */}
      {/* ------------------------------------------------------------- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite hover:bg-surface-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-softwhite mb-1">
              {editingProject ? "EDIT WORK ITEM" : "CREATE NEW WORK ITEM"}
            </h2>
            <p className="font-sans text-xs text-muted/70 mb-6">
              Configure universe assignment, media gallery, video embeds, and architectural narrative.
            </p>

            {formError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto pr-2"
            >
              {/* SECTION A: UNIVERSE & CATEGORY */}
              <div className="p-4 rounded-xl bg-surface-200/40 border border-white/5 flex flex-col gap-4">
                <div className="font-mono text-xs text-orange tracking-widest uppercase flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>1. UNIVERSE & CLASSIFICATION</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Creative World *
                    </label>
                    <select
                      value={formData.world_slug}
                      onChange={(e) => {
                        const nextWorld = e.target.value;
                        const matchedWorld = worlds.find((w) => w.slug === nextWorld);
                        setFormData({
                          ...formData,
                          world_slug: nextWorld,
                          world_id: matchedWorld?.id || null,
                          accent: matchedWorld?.accent_color || formData.accent,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                    >
                      {WORLD_OPTIONS.map((w) => (
                        <option key={w.slug} value={w.slug}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Category Taxonomy *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matchedCat = categories.find((c) => c.name === val);
                        setFormData({
                          ...formData,
                          category: val,
                          creative_category_id: matchedCat?.id || null,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                    >
                      {currentWorldCategories.length > 0 ? (
                        currentWorldCategories.map((c) => (
                          <option key={c.id || c.slug} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <option value={formData.category}>{formData.category}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Work Title *
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
                          slug: !editingProject
                            ? t
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-|-$/g, "")
                            : formData.slug,
                        });
                      }}
                      placeholder="e.g. OsMentor AI"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      URL Slug * (case study route)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="e.g. osmentor-ai"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Index Number
                    </label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Client / Org
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      placeholder="e.g. Acme Corp"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Accent Color Hex
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md border border-white/20 shrink-0"
                        style={{ backgroundColor: formData.accent }}
                      />
                      <input
                        type="text"
                        value={formData.accent}
                        onChange={(e) =>
                          setFormData({ ...formData, accent: e.target.value })
                        }
                        className="w-full px-2.5 py-2 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: NARRATIVE & METRICS */}
              <div className="p-4 rounded-xl bg-surface-200/40 border border-white/5 flex flex-col gap-4">
                <div className="font-mono text-xs text-orange tracking-widest uppercase flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>2. NARRATIVE & DESCRIPTIONS</span>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    placeholder="Short punchy highlight..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Short Summary * (Card display)
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief 1-2 sentence overview shown in universe grids..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Full Architecture Narrative (Case Study Page)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.long_description}
                    onChange={(e) =>
                      setFormData({ ...formData, long_description: e.target.value })
                    }
                    placeholder="Comprehensive case study covering problem statement, system architecture, challenges, and measurable results..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Tech & Tools (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tech}
                      onChange={(e) =>
                        setFormData({ ...formData, tech: e.target.value })
                      }
                      placeholder="Figma, React, Tailwind CSS"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Production Metric
                    </label>
                    <input
                      type="text"
                      value={formData.metrics}
                      onChange={(e) =>
                        setFormData({ ...formData, metrics: e.target.value })
                      }
                      placeholder="e.g. Sub-400ms vector retrieval"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Core Implementations / Features (1 line per item)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.features}
                    onChange={(e) =>
                      setFormData({ ...formData, features: e.target.value })
                    }
                    placeholder="Line 1: High throughput vector embeddings&#10;Line 2: RAG graph visualizer"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              {/* SECTION C: VISUAL MEDIA & GALLERY (INTEGRATED WITH MEDIA LIBRARY & LOCAL UPLOADS) */}
              <div className="p-4 rounded-xl bg-surface-200/40 border border-white/5 flex flex-col gap-4">
                <div className="font-mono text-xs text-orange tracking-widest uppercase flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>3. COVER IMAGE & MULTI-IMAGE GALLERY</span>
                </div>

                {/* Cover Image Controls */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-[10px] text-muted tracking-wider uppercase">
                      Cover Image (Primary Showcase Visual)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openMediaPicker("cover")}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-200 border border-white/10 text-[11px] font-mono text-muted hover:text-softwhite hover:border-orange/30 transition-all"
                      >
                        <FolderOpen className="w-3 h-3 text-orange" />
                        <span>Choose from Media Library</span>
                      </button>

                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-200 border border-white/10 text-[11px] font-mono text-muted hover:text-softwhite hover:border-orange/30 transition-all cursor-pointer">
                        {uploadingCover ? (
                          <Loader2 className="w-3 h-3 animate-spin text-orange" />
                        ) : (
                          <Upload className="w-3 h-3 text-orange" />
                        )}
                        <span>{uploadingCover ? "Uploading..." : "Upload Cover"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingCover}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFileDirect(file, "cover");
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={formData.cover_image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, cover_image_url: e.target.value })
                    }
                    placeholder="https://... or /images/..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                  />
                  {formData.cover_image_url && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 bg-obsidian shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.cover_image_url}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-muted truncate">
                        Linked: {formData.cover_image_url}
                      </span>
                    </div>
                  )}
                </div>

                {/* Multi-Image Gallery Manager */}
                <div className="pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-mono text-[10px] text-muted tracking-wider uppercase">
                      Gallery Images ({formData.gallery_images.length})
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openMediaPicker("gallery")}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-200 border border-white/10 text-[11px] font-mono text-muted hover:text-softwhite hover:border-orange/30 transition-all"
                      >
                        <FolderOpen className="w-3 h-3 text-orange" />
                        <span>Add from Library</span>
                      </button>

                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-200 border border-white/10 text-[11px] font-mono text-muted hover:text-softwhite hover:border-orange/30 transition-all cursor-pointer">
                        {uploadingGallery ? (
                          <Loader2 className="w-3 h-3 animate-spin text-orange" />
                        ) : (
                          <Upload className="w-3 h-3 text-orange" />
                        )}
                        <span>{uploadingGallery ? "Uploading..." : "Upload File"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingGallery}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFileDirect(file, "gallery");
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Attached Gallery List */}
                  {formData.gallery_images.length > 0 && (
                    <div className="flex flex-col gap-2 mb-3">
                      {formData.gallery_images.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="p-2.5 rounded-lg bg-surface-200 border border-white/10 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="font-mono text-orange text-[10px] font-bold">
                              #{idx + 1}
                            </span>
                            <div className="w-10 h-7 rounded border border-white/10 bg-obsidian shrink-0 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.url}
                                alt={item.alt_text || "Thumb"}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-mono text-softwhite truncate max-w-xs text-[11px]">
                                {item.caption || item.url}
                              </div>
                              {item.alt_text && (
                                <div className="text-muted text-[10px] truncate">
                                  Alt: {item.alt_text}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              title="Move up"
                              disabled={idx === 0}
                              onClick={() => handleMoveGalleryImage(idx, "up")}
                              className="p-1 rounded text-muted hover:text-softwhite disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Move down"
                              disabled={idx === formData.gallery_images.length - 1}
                              onClick={() => handleMoveGalleryImage(idx, "down")}
                              className="p-1 rounded text-muted hover:text-softwhite disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Remove image"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="p-1 rounded text-muted hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Gallery Item by Direct URL Sub-Form */}
                  <div className="p-3 rounded-lg border border-dashed border-white/10 bg-surface-100/50 flex flex-col gap-2.5">
                    <div className="text-[10px] font-mono text-muted uppercase flex items-center justify-between">
                      <span>Add External Image by URL:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="Image URL..."
                        className="px-3 py-1.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                      />
                      <input
                        type="text"
                        value={newGalleryCaption}
                        onChange={(e) => setNewGalleryCaption(e.target.value)}
                        placeholder="Caption (optional)..."
                        className="px-3 py-1.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGalleryAlt}
                          onChange={(e) => setNewGalleryAlt(e.target.value)}
                          placeholder="Alt text..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryImageUrl}
                          className="px-3 py-1.5 rounded-lg bg-surface-200 hover:bg-orange hover:text-obsidian text-xs font-mono text-softwhite transition-colors"
                        >
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION D: VIDEO EMBED & ASPECT RATIO */}
              <div className="p-4 rounded-xl bg-surface-200/40 border border-white/5 flex flex-col gap-4">
                <div className="font-mono text-xs text-orange tracking-widest uppercase flex items-center gap-2">
                  <Film className="w-3.5 h-3.5" />
                  <span>4. VIDEO EMBEDDING & ASPECT RATIO</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      External Video URL (YouTube, Vimeo, or Direct MP4/WebM)
                    </label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) =>
                        setFormData({ ...formData, video_url: e.target.value })
                      }
                      placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                    />
                    {formData.video_url && (
                      <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px]">
                        {(() => {
                          const parsed = parseVideoUrl(formData.video_url);
                          return parsed.isValid ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Valid {parsed.provider} stream detected</span>
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{parsed.error || "Unsupported video URL"}</span>
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Aspect Ratio
                    </label>
                    <select
                      value={formData.aspect_ratio}
                      onChange={(e) =>
                        setFormData({ ...formData, aspect_ratio: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                    >
                      {ASPECT_RATIO_OPTIONS.map((ratio) => (
                        <option key={ratio} value={ratio}>
                          {ratio}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION E: EXTERNAL LINKS & DEMO STATUS */}
              <div className="p-4 rounded-xl bg-surface-200/40 border border-white/5 flex flex-col gap-4">
                <div className="font-mono text-xs text-orange tracking-widest uppercase flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>5. LINKS & GOVERNANCE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Live App / Showcase URL
                    </label>
                    <input
                      type="url"
                      value={formData.live_url}
                      onChange={(e) =>
                        setFormData({ ...formData, live_url: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      GitHub Source URL
                    </label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) =>
                        setFormData({ ...formData, github_url: e.target.value })
                      }
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Prototype URL (Figma, etc.)
                    </label>
                    <input
                      type="url"
                      value={formData.prototype_url}
                      onChange={(e) =>
                        setFormData({ ...formData, prototype_url: e.target.value })
                      }
                      placeholder="https://figma.com/..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({ ...formData, is_featured: e.target.checked })
                      }
                      className="rounded border-white/20 bg-surface-200 text-orange focus:ring-orange"
                    />
                    <label htmlFor="is_featured" className="font-mono text-xs text-softwhite">
                      Featured in Showcase
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_demo"
                      checked={formData.is_demo}
                      onChange={(e) =>
                        setFormData({ ...formData, is_demo: e.target.checked })
                      }
                      className="rounded border-white/20 bg-surface-200 text-amber-400 focus:ring-amber-400"
                    />
                    <label htmlFor="is_demo" className="font-mono text-xs text-amber-300">
                      Flag as Demo Item (Disposable)
                    </label>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Publication Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-white/10">
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
                  className="px-5 py-2.5 rounded-xl bg-orange text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-orange-light transition-all shadow-[0_0_15px_rgba(244,106,69,0.25)] disabled:opacity-50"
                >
                  {formLoading
                    ? "SAVING..."
                    : editingProject
                    ? "UPDATE WORK ITEM"
                    : "CREATE WORK ITEM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MEDIA ASSETS PICKER MODAL */}
      {/* ------------------------------------------------------------- */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-surface-100 border border-white/15 rounded-2xl p-6 relative shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-orange" />
                <h3 className="font-display text-base font-bold text-softwhite">
                  SELECT FROM MEDIA ASSETS
                </h3>
              </div>
              <button
                onClick={() => setMediaModalOpen(false)}
                className="p-1 rounded text-muted hover:text-softwhite"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-sans text-xs text-muted/70 mb-4">
              Select an uploaded file to attach as{" "}
              <strong className="text-orange">{mediaTarget === "cover" ? "Cover Image" : "Gallery Asset"}</strong>.
            </p>

            <div className="flex-1 overflow-y-auto pr-1">
              {mediaLoading ? (
                <div className="py-16 text-center font-mono text-xs text-muted">
                  Loading media assets...
                </div>
              ) : mediaList.length === 0 ? (
                <div className="py-16 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
                  No assets uploaded yet in Media Library. Use &quot;Upload File&quot; to upload directly.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectFromLibrary(item)}
                      className="p-2 rounded-xl bg-surface-200 border border-white/10 hover:border-orange/50 transition-all text-left flex flex-col gap-2 group"
                    >
                      <div className="w-full h-24 rounded-lg bg-obsidian overflow-hidden border border-white/5 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.public_url || item.storage_path}
                          alt={item.alt_text || item.file_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                      <div className="font-mono text-[10px] text-softwhite truncate w-full">
                        {item.file_name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 bg-surface-200/50 text-xs font-mono text-muted hover:text-softwhite transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PURGE DEMO RECORDS CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {purgeModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-100 border border-red-500/30 rounded-2xl p-6 relative shadow-2xl">
            <button
              onClick={() => setPurgeModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite hover:bg-surface-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <Trash2 className="w-5 h-5" />
            </div>

            <h2 className="font-display text-lg font-bold text-softwhite mb-2">
              PURGE DEMO RECORDS
            </h2>
            <p className="font-sans text-xs text-muted/80 mb-4 leading-relaxed">
              This action will permanently delete all demonstration work items (flagged with{" "}
              <code className="text-amber-300 font-mono">is_demo = true</code>). Real portfolio records and uploaded media files will remain completely untouched.
            </p>

            <div className="mb-4">
              <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                Type <strong className="text-red-400">DELETE DEMO CONTENT</strong> to confirm:
              </label>
              <input
                type="text"
                value={purgeConfirmationText}
                onChange={(e) => setPurgeConfirmationText(e.target.value)}
                placeholder="DELETE DEMO CONTENT"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPurgeModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 bg-surface-200/50 text-xs font-mono text-muted hover:text-softwhite transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={purgeConfirmationText.trim() !== "DELETE DEMO CONTENT" || purgeLoading}
                onClick={handlePurgeDemo}
                className="px-5 py-2 rounded-xl bg-red-500 text-white font-mono text-xs font-semibold tracking-wider uppercase hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {purgeLoading ? "PURGING..." : "CONFIRM PURGE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
