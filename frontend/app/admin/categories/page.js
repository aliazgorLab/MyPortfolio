"use client";

import { useState, useEffect } from "react";
import {
  getCreativeWorldsAction,
  updateCreativeWorldAction,
  getCreativeCategoriesAction,
  createCreativeCategoryAction,
  updateCreativeCategoryAction,
  deleteCreativeCategoryAction,
  toggleCategoryActiveAction,
} from "@/lib/actions/categories";
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  X,
  AlertCircle,
  Layers,
  Sparkles,
  Palette,
  Layout,
  Code,
  Film,
} from "lucide-react";

const WORLD_ICONS = {
  "graphic-design": Palette,
  "ui-ux-design": Layout,
  "web-development": Code,
  "video-motion": Film,
};

export default function CreativeUniverseAdminPage() {
  const [worlds, setWorlds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorldTab, setSelectedWorldTab] = useState("ALL");
  const [categorySearch, setCategorySearch] = useState("");

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    world_id: "",
    name: "",
    slug: "",
    description: "",
    display_order: 1,
    is_active: true,
  });
  const [categoryFormLoading, setCategoryFormLoading] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState(null);

  // World Modal State
  const [worldModalOpen, setWorldModalOpen] = useState(false);
  const [editingWorld, setEditingWorld] = useState(null);
  const [worldFormData, setWorldFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    accent_color: "#F46A45",
    display_order: 1,
    is_active: true,
  });
  const [worldFormLoading, setWorldFormLoading] = useState(false);
  const [worldFormError, setWorldFormError] = useState(null);

  // Toast / Status Message
  const [feedback, setFeedback] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const [wRes, cRes] = await Promise.all([
      getCreativeWorldsAction(),
      getCreativeCategoriesAction(),
    ]);

    if (wRes.success) setWorlds(wRes.data || []);
    if (cRes.success) setCategories(cRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4500);
  };

  // -------------------------------------------------------------
  // Category Actions
  // -------------------------------------------------------------
  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    const defaultWorldId = worlds[0]?.id || "";
    setCategoryFormData({
      world_id: defaultWorldId,
      name: "",
      slug: "",
      description: "",
      display_order: (categories.length + 1),
      is_active: true,
    });
    setCategoryFormError(null);
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      world_id: cat.world_id || (worlds.find((w) => w.slug === cat.world_slug)?.id || ""),
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      display_order: cat.display_order ?? 0,
      is_active: cat.is_active !== false,
    });
    setCategoryFormError(null);
    setCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategoryFormLoading(true);
    setCategoryFormError(null);

    const payload = {
      world_id: categoryFormData.world_id,
      name: categoryFormData.name.trim(),
      slug: categoryFormData.slug.trim(),
      description: categoryFormData.description.trim() || "",
      display_order: Number(categoryFormData.display_order) || 0,
      is_active: Boolean(categoryFormData.is_active),
    };

    let res;
    if (editingCategory) {
      res = await updateCreativeCategoryAction(editingCategory.id, payload);
    } else {
      res = await createCreativeCategoryAction(payload);
    }

    setCategoryFormLoading(false);

    if (!res.success) {
      setCategoryFormError(res.error);
      return;
    }

    setCategoryModalOpen(false);
    showFeedback("success", res.message || "Category saved successfully.");
    loadData();
  };

  const handleToggleCategoryActive = async (cat) => {
    const res = await toggleCategoryActiveAction(cat.id, cat.is_active);
    if (res.success) {
      showFeedback("success", res.message || "Status updated.");
      loadData();
    } else {
      showFeedback("error", res.error);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"? This action cannot be undone.`)) {
      return;
    }
    const res = await deleteCreativeCategoryAction(cat.id);
    if (res.success) {
      showFeedback("success", "Category deleted successfully.");
      loadData();
    } else {
      showFeedback("error", res.error);
    }
  };

  // -------------------------------------------------------------
  // World Actions
  // -------------------------------------------------------------
  const openEditWorldModal = (w) => {
    setEditingWorld(w);
    setWorldFormData({
      title: w.title,
      slug: w.slug,
      subtitle: w.subtitle || "",
      description: w.description || "",
      accent_color: w.accent_color || "#F46A45",
      display_order: w.display_order ?? 0,
      is_active: w.is_active !== false,
    });
    setWorldFormError(null);
    setWorldModalOpen(true);
  };

  const handleWorldSubmit = async (e) => {
    e.preventDefault();
    setWorldFormLoading(true);
    setWorldFormError(null);

    const payload = {
      title: worldFormData.title.trim(),
      slug: worldFormData.slug.trim(),
      subtitle: worldFormData.subtitle.trim() || "",
      description: worldFormData.description.trim() || "",
      accent_color: worldFormData.accent_color.trim(),
      display_order: Number(worldFormData.display_order) || 0,
      is_active: Boolean(worldFormData.is_active),
    };

    const res = await updateCreativeWorldAction(editingWorld.id, payload);
    setWorldFormLoading(false);

    if (!res.success) {
      setWorldFormError(res.error);
      return;
    }

    setWorldModalOpen(false);
    showFeedback("success", res.message || "Creative World updated successfully.");
    loadData();
  };

  // -------------------------------------------------------------
  // Filtered Categories
  // -------------------------------------------------------------
  const filteredCategories = categories.filter((cat) => {
    // Find world slug
    const world = worlds.find((w) => w.id === cat.world_id) || { slug: cat.world_slug };
    if (selectedWorldTab !== "ALL" && world?.slug !== selectedWorldTab) {
      return false;
    }
    if (categorySearch) {
      const q = categorySearch.toLowerCase();
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-10">
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

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-orange tracking-widest uppercase mb-1">
            <span>INDEX // 01</span>
            <span>·</span>
            <span>CREATIVE UNIVERSE ARCHITECTURE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
            UNIVERSE & CATEGORY MANAGER
          </h1>
          <p className="font-sans text-xs text-muted/80 mt-1 max-w-2xl">
            Configure the 4 Creative Worlds, taxonomies, and navigation tags powering your portfolio ecosystem.
          </p>
        </div>

        <button
          onClick={openCreateCategoryModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-orange-light transition-all shadow-[0_0_20px_rgba(244,106,69,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>ADD CATEGORY</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: THE 4 CREATIVE WORLDS */}
      {/* ------------------------------------------------------------- */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-orange" />
            <h2 className="font-display text-lg font-bold text-softwhite">
              CREATIVE WORLDS (CANONICAL QUADRANTS)
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            {worlds.length} Primary Universes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {worlds.map((w) => {
            const Icon = WORLD_ICONS[w.slug] || Globe;
            const categoryCount = categories.filter(
              (c) => c.world_id === w.id || c.world_slug === w.slug
            ).length;

            return (
              <div
                key={w.id || w.slug}
                className="p-5 rounded-2xl bg-surface-100/60 border border-white/10 flex flex-col justify-between gap-4 hover:border-orange/30 transition-all group backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${w.accent_color}15`,
                        borderColor: `${w.accent_color}40`,
                        color: w.accent_color,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border ${
                        w.is_active !== false
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-muted/10 text-muted border-white/10"
                      }`}
                    >
                      {w.is_active !== false ? "ACTIVE" : "DISABLED"}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-softwhite group-hover:text-orange transition-colors">
                    {w.title}
                  </h3>
                  <div className="font-mono text-[10px] text-muted tracking-widest uppercase mt-0.5">
                    Order #{w.display_order} · {w.slug}
                  </div>
                  <p className="font-sans text-xs text-muted/80 mt-2 line-clamp-2">
                    {w.description || w.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted">
                    {categoryCount} {categoryCount === 1 ? "category" : "categories"}
                  </span>
                  <button
                    onClick={() => openEditWorldModal(w)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-muted hover:text-softwhite hover:bg-surface-200 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-orange" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: CATEGORY TAXONOMY MANAGER */}
      {/* ------------------------------------------------------------- */}
      <section className="flex flex-col gap-4 pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-orange" />
            <h2 className="font-display text-lg font-bold text-softwhite">
              CATEGORY TAXONOMIES
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-100/70 border border-white/10 text-xs font-sans text-softwhite focus:outline-none focus:border-orange transition-colors"
            />
          </div>
        </div>

        {/* World Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedWorldTab("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all shrink-0 ${
              selectedWorldTab === "ALL"
                ? "bg-orange text-obsidian font-semibold shadow-[0_0_15px_rgba(244,106,69,0.2)]"
                : "bg-surface-100 text-muted hover:text-softwhite border border-white/5"
            }`}
          >
            ALL WORLDS ({categories.length})
          </button>
          {worlds.map((w) => {
            const count = categories.filter(
              (c) => c.world_id === w.id || c.world_slug === w.slug
            ).length;
            const isSelected = selectedWorldTab === w.slug;

            return (
              <button
                key={w.slug}
                onClick={() => setSelectedWorldTab(w.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-orange text-obsidian font-semibold shadow-[0_0_15px_rgba(244,106,69,0.2)]"
                    : "bg-surface-100 text-muted hover:text-softwhite border border-white/5"
                }`}
              >
                <span>{w.title}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-muted">
            Loading universe categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
            No categories found matching this filter.
          </div>
        ) : (
          <div className="border border-white/10 rounded-2xl bg-surface-100/40 backdrop-blur-xl overflow-hidden divide-y divide-white/5">
            {filteredCategories.map((cat) => {
              const parentWorld = worlds.find(
                (w) => w.id === cat.world_id || w.slug === cat.world_slug
              );

              return (
                <div
                  key={cat.id || cat.slug}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-200/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-xs text-orange font-bold mt-1">
                      #{cat.display_order}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display text-sm font-bold text-softwhite">
                          {cat.name}
                        </h4>
                        <span className="font-mono text-[10px] text-muted">
                          ({cat.slug})
                        </span>
                        {parentWorld && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono border"
                            style={{
                              backgroundColor: `${parentWorld.accent_color}10`,
                              borderColor: `${parentWorld.accent_color}30`,
                              color: parentWorld.accent_color,
                            }}
                          >
                            {parentWorld.title}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border ${
                            cat.is_active !== false
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-muted/10 text-muted border-white/10"
                          }`}
                        >
                          {cat.is_active !== false ? "Active" : "Disabled"}
                        </span>
                      </div>
                      {cat.description && (
                        <p className="font-sans text-xs text-muted/80 mt-1 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleToggleCategoryActive(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all border ${
                        cat.is_active !== false
                          ? "border-muted/30 text-muted hover:text-softwhite"
                          : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                    >
                      {cat.is_active !== false ? "DISABLE" : "ENABLE"}
                    </button>

                    <button
                      onClick={() => openEditCategoryModal(cat)}
                      title="Edit Category"
                      className="p-2 rounded-lg border border-white/10 bg-surface-200/60 text-muted hover:text-softwhite transition-colors"
                    >
                      <Edit className="w-4 h-4 text-orange" />
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      title="Delete Category"
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
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY CREATE / EDIT MODAL */}
      {/* ------------------------------------------------------------- */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl my-8">
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite hover:bg-surface-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-softwhite mb-1">
              {editingCategory ? "EDIT CATEGORY" : "CREATE NEW CATEGORY"}
            </h2>
            <p className="font-sans text-xs text-muted/70 mb-6">
              Define the taxonomy name, slug, display order, and parent universe.
            </p>

            {categoryFormError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{categoryFormError}</span>
              </div>
            )}

            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Parent Creative World *
                </label>
                <select
                  required
                  value={categoryFormData.world_id}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, world_id: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                >
                  <option value="" disabled>
                    Select parent universe...
                  </option>
                  {worlds.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) => {
                    const n = e.target.value;
                    setCategoryFormData({
                      ...categoryFormData,
                      name: n,
                      slug: !editingCategory
                        ? n
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "")
                        : categoryFormData.slug,
                    });
                  }}
                  placeholder="e.g. Brand Identity"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  URL Slug * (lowercase-hyphenated)
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormData.slug}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, slug: e.target.value })
                  }
                  placeholder="e.g. brand-identity"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={categoryFormData.description}
                  onChange={(e) =>
                    setCategoryFormData({ ...categoryFormData, description: e.target.value })
                  }
                  placeholder="Brief description of work items in this category..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={categoryFormData.display_order}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        display_order: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="cat_active"
                    checked={categoryFormData.is_active}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        is_active: e.target.checked,
                      })
                    }
                    className="rounded border-white/20 bg-surface-200 text-orange focus:ring-orange"
                  />
                  <label htmlFor="cat_active" className="font-mono text-xs text-softwhite">
                    Active / Enabled
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-surface-200/50 text-xs font-mono text-muted hover:text-softwhite transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={categoryFormLoading}
                  className="px-5 py-2.5 rounded-xl bg-orange text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-orange-light transition-all shadow-[0_0_15px_rgba(244,106,69,0.25)] disabled:opacity-50"
                >
                  {categoryFormLoading
                    ? "SAVING..."
                    : editingCategory
                    ? "UPDATE CATEGORY"
                    : "CREATE CATEGORY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* WORLD EDIT MODAL */}
      {/* ------------------------------------------------------------- */}
      {worldModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl my-8">
            <button
              onClick={() => setWorldModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite hover:bg-surface-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-softwhite mb-1">
              CONFIGURE CREATIVE WORLD
            </h2>
            <p className="font-sans text-xs text-muted/70 mb-6">
              Update universe narrative, accent color, and navigation order.
            </p>

            {worldFormError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{worldFormError}</span>
              </div>
            )}

            <form onSubmit={handleWorldSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  World Title *
                </label>
                <input
                  type="text"
                  required
                  value={worldFormData.title}
                  onChange={(e) =>
                    setWorldFormData({ ...worldFormData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  URL Slug * (read-only system identifier)
                </label>
                <input
                  type="text"
                  readOnly
                  value={worldFormData.slug}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200/50 border border-white/5 text-xs font-mono text-muted cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Subtitle / Specialization Focus
                </label>
                <input
                  type="text"
                  value={worldFormData.subtitle}
                  onChange={(e) =>
                    setWorldFormData({ ...worldFormData, subtitle: e.target.value })
                  }
                  placeholder="e.g. Brand Identity, Visual Communications & Editorial"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Description / Storyline
                </label>
                <textarea
                  rows={3}
                  value={worldFormData.description}
                  onChange={(e) =>
                    setWorldFormData({ ...worldFormData, description: e.target.value })
                  }
                  placeholder="Exploration of logo design, brand identities, and editorial craft..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Accent Color Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg border border-white/20 shrink-0"
                      style={{ backgroundColor: worldFormData.accent_color }}
                    />
                    <input
                      type="text"
                      value={worldFormData.accent_color}
                      onChange={(e) =>
                        setWorldFormData({ ...worldFormData, accent_color: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={worldFormData.display_order}
                    onChange={(e) =>
                      setWorldFormData({ ...worldFormData, display_order: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="world_active"
                  checked={worldFormData.is_active}
                  onChange={(e) =>
                    setWorldFormData({ ...worldFormData, is_active: e.target.checked })
                  }
                  className="rounded border-white/20 bg-surface-200 text-orange focus:ring-orange"
                />
                <label htmlFor="world_active" className="font-mono text-xs text-softwhite">
                  Active Universe (Visible to visitors)
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setWorldModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-surface-200/50 text-xs font-mono text-muted hover:text-softwhite transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={worldFormLoading}
                  className="px-5 py-2.5 rounded-xl bg-orange text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-orange-light transition-all shadow-[0_0_15px_rgba(244,106,69,0.25)] disabled:opacity-50"
                >
                  {worldFormLoading ? "SAVING..." : "SAVE WORLD"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

