"use client";

import { useState, useEffect } from "react";
import {
  getSkillCategoriesWithSkillsAction,
  createSkillCategoryAction,
  deleteSkillCategoryAction,
  createSkillAction,
  deleteSkillAction,
} from "@/lib/actions/skills";
import {
  Plus,
  Sparkles,
  Trash2,
  FolderPlus,
  X,
  AlertCircle,
  Tag,
} from "lucide-react";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [error, setError] = useState(null);

  const [catFormData, setCatFormData] = useState({ name: "", index_label: "01", display_order: 1 });
  const [skillFormData, setSkillFormData] = useState({ name: "", category_id: "", display_order: 1 });

  const loadData = async () => {
    setLoading(true);
    const res = await getSkillCategoriesWithSkillsAction();
    if (res.success) {
      setCategories(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await createSkillCategoryAction(catFormData);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setCatModalOpen(false);
    loadData();
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await createSkillAction({
      ...skillFormData,
      category_id: selectedCatId,
    });
    if (!res.success) {
      setError(res.error);
      return;
    }
    setSkillModalOpen(false);
    setSkillFormData({ name: "", category_id: "", display_order: 1 });
    loadData();
  };

  const handleDeleteCategory = async (id, name) => {
    if (!confirm(`Delete category "${name}" and all skills inside it?`)) return;
    const res = await deleteSkillCategoryAction(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
  };

  const handleDeleteSkill = async (id) => {
    const res = await deleteSkillAction(id);
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
            <span>INDEX // 04</span>
            <span>·</span>
            <span>CAPABILITIES</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
            SKILLS & CAPABILITY MATRIX
          </h1>
        </div>

        <button
          onClick={() => {
            setCatFormData({
              name: "",
              index_label: `0${categories.length + 1}`,
              display_order: categories.length + 1,
            });
            setError(null);
            setCatModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_20px_rgba(199,184,255,0.25)]"
        >
          <FolderPlus className="w-4 h-4" />
          <span>NEW CATEGORY</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-muted">
          Loading capability matrix...
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
          No skill categories configured. Create a category to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-lavender font-bold">
                      {cat.index_label} //
                    </span>
                    <h3 className="font-display text-base font-bold text-softwhite">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCatId(cat.id);
                        setError(null);
                        setSkillModalOpen(true);
                      }}
                      title="Add skill to this category"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 bg-surface-200 text-[10px] font-mono text-lavender hover:bg-surface-200/80 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>SKILL</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      title="Delete category"
                      className="p-1.5 rounded-lg border border-white/10 bg-surface-200 text-muted hover:text-red-400 hover:border-red-400/30 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {cat.skills && cat.skills.length > 0 ? (
                    cat.skills.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-surface-200/80 text-softwhite border border-white/5 group"
                      >
                        <span>{s.name}</span>
                        <button
                          onClick={() => handleDeleteSkill(s.id)}
                          className="text-muted hover:text-red-400 transition-colors ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="font-mono text-xs text-muted/50 italic">
                      No skills added to this category yet.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setCatModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-lg font-bold text-softwhite mb-1">
              NEW SKILL CATEGORY
            </h2>
            <p className="font-sans text-xs text-muted/70 mb-6">
              Group related skills (e.g. FRONTEND, BACKEND & SYSTEMS).
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catFormData.name}
                  onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                  placeholder="e.g. AI & EXPERIMENTATION"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Index Label
                </label>
                <input
                  type="text"
                  value={catFormData.index_label}
                  onChange={(e) => setCatFormData({ ...catFormData, index_label: e.target.value })}
                  placeholder="01"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-mono text-muted"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-lavender text-obsidian text-xs font-mono font-semibold uppercase hover:bg-softwhite transition-colors"
                >
                  CREATE CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setSkillModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-lg font-bold text-softwhite mb-1">
              ADD SKILL TAG
            </h2>
            <p className="font-sans text-xs text-muted/70 mb-6">
              Add a new technology, framework, or methodology tag.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateSkill} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={skillFormData.name}
                  onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                  placeholder="e.g. Next.js"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-mono text-muted"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-lavender text-obsidian text-xs font-mono font-semibold uppercase hover:bg-softwhite transition-colors"
                >
                  ADD SKILL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

