"use client";

import { useState, useEffect } from "react";
import {
  getArtworksAction,
  getArtworkCategoriesAction,
  createArtworkAction,
  updateArtworkAction,
  deleteArtworkAction,
} from "@/lib/actions/artworks";
import {
  Plus,
  Palette,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  X,
  AlertCircle,
} from "lucide-react";

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category_id: "",
    primary_image_url: "",
    thumbnail_image_url: "",
    year: "2024",
    project_context: "",
    aspect_ratio: "1:1",
    is_featured: false,
    display_order: 1,
    status: "published",
  });

  const loadData = async () => {
    setLoading(true);
    const [artsRes, catsRes] = await Promise.all([
      getArtworksAction(),
      getArtworkCategoriesAction(),
    ]);

    if (artsRes.success) setArtworks(artsRes.data || []);
    if (catsRes.success) setCategories(catsRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      category_id: categories[0]?.id || "",
      primary_image_url: "",
      thumbnail_image_url: "",
      year: new Date().getFullYear().toString(),
      project_context: "",
      aspect_ratio: "1:1",
      is_featured: false,
      display_order: artworks.length + 1,
      status: "published",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description || "",
      category_id: item.category_id,
      primary_image_url: item.primary_image_url || "",
      thumbnail_image_url: item.thumbnail_image_url || "",
      year: item.year || "2024",
      project_context: item.project_context || "",
      aspect_ratio: item.aspect_ratio || "1:1",
      is_featured: item.is_featured,
      display_order: item.display_order,
      status: item.status,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    let res;
    if (editingItem) {
      res = await updateArtworkAction(editingItem.id, formData);
    } else {
      res = await createArtworkAction(formData);
    }

    if (!res.success) {
      setFormError(res.error);
      setFormLoading(false);
      return;
    }

    setModalOpen(false);
    setFormLoading(false);
    loadData();
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete artwork "${title}"?`)) return;
    const res = await deleteArtworkAction(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-lavender tracking-widest uppercase mb-1">
            <span>INDEX // 07</span>
            <span>·</span>
            <span>VISUAL PORTFOLIO</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
            ARTWORK & DESIGN MANAGEMENT
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_20px_rgba(199,184,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>NEW ARTWORK</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-muted">
          Loading artworks...
        </div>
      ) : artworks.length === 0 ? (
        <div className="py-20 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
          No artwork records found. Add your first visual piece.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-xl flex flex-col justify-between group hover:border-lavender/30 transition-all"
            >
              <div>
                {item.primary_image_url ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-surface-200 mb-3 border border-white/5">
                    <img
                      src={item.primary_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full rounded-xl bg-surface-200/80 mb-3 border border-white/5 flex items-center justify-center text-muted">
                    <Palette className="w-8 h-8 text-lavender" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-lavender uppercase tracking-wider">
                    {item.category?.name || "Design"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase ${
                      item.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-softwhite">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="font-sans text-xs text-muted/80 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted">
                  Year {item.year || "2024"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg border border-white/5 bg-surface-200 text-muted hover:text-softwhite transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg border border-white/5 bg-surface-200 text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-softwhite mb-1">
              {editingItem ? "EDIT ARTWORK" : "ADD ARTWORK"}
            </h2>
            <p className="font-sans text-xs text-muted/70 mb-6">
              Visual art piece details and presentation metadata.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Title *
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
                      slug: !editingItem ? t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : formData.slug,
                    });
                  }}
                  placeholder="e.g. Kinetic Brand Geometry"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="kinetic-brand-geometry"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Image Public URL
                </label>
                <input
                  type="text"
                  value={formData.primary_image_url}
                  onChange={(e) => setFormData({ ...formData, primary_image_url: e.target.value })}
                  placeholder="https://... or copy from Media Assets"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-mono text-muted"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 rounded-lg bg-lavender text-obsidian text-xs font-mono font-semibold uppercase hover:bg-softwhite transition-colors disabled:opacity-50"
                >
                  {formLoading ? "SAVING..." : "SAVE ARTWORK"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

