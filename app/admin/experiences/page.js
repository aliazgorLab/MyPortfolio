"use client";

import { useState, useEffect } from "react";
import {
  getExperiencesAction,
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
} from "@/lib/actions/experiences";
import {
  Plus,
  Briefcase,
  Trash2,
  Edit,
  MapPin,
  Calendar,
  X,
  AlertCircle,
} from "lucide-react";

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    slug_id: "",
    role: "",
    company: "",
    employment_type: "Full-time",
    period: "2026 — PRESENT",
    location: "Chittagong, BD",
    description: "",
    points: "",
    is_current: false,
    display_order: 0,
    status: "published",
  });

  const loadExperiences = async () => {
    setLoading(true);
    const res = await getExperiencesAction();
    if (res.success) {
      setExperiences(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      slug_id: "",
      role: "",
      company: "",
      employment_type: "Full-time",
      period: "2026 — PRESENT",
      location: "Chittagong, BD",
      description: "",
      points: "",
      is_current: false,
      display_order: experiences.length + 1,
      status: "published",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      slug_id: item.slug_id,
      role: item.role,
      company: item.company,
      employment_type: item.employment_type || "Full-time",
      period: item.period,
      location: item.location || "",
      description: item.description || "",
      points: Array.isArray(item.points) ? item.points.join("\n") : "",
      is_current: item.is_current,
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

    const payload = {
      ...formData,
      points: formData.points
        ? formData.points.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    let res;
    if (editingItem) {
      res = await updateExperienceAction(editingItem.id, payload);
    } else {
      res = await createExperienceAction(payload);
    }

    if (!res.success) {
      setFormError(res.error);
      setFormLoading(false);
      return;
    }

    setModalOpen(false);
    setFormLoading(false);
    loadExperiences();
  };

  const handleDelete = async (id, role, company) => {
    if (!confirm(`Delete role "${role} at ${company}"?`)) return;
    const res = await deleteExperienceAction(id);
    if (res.success) {
      loadExperiences();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-lavender tracking-widest uppercase mb-1">
            <span>INDEX // 03</span>
            <span>·</span>
            <span>CAREER TRAJECTORY</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
            EXPERIENCE MANAGEMENT
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_20px_rgba(199,184,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>ADD EXPERIENCE</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-muted">
          Loading career positions...
        </div>
      ) : experiences.length === 0 ? (
        <div className="py-20 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
          No experience records found. Add your first position.
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-white/5 border border-white/10 rounded-2xl bg-surface-100/40 backdrop-blur-xl overflow-hidden">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-surface-200/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-surface-200 text-lavender border border-white/5 mt-1">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-base font-bold text-softwhite">
                      {item.role}
                    </h3>
                    <span className="text-lavender font-mono text-xs">@ {item.company}</span>
                    {item.is_current && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        PRESENT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-lavender" />
                      {item.period}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-lavender" />
                        {item.location}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="font-sans text-xs text-muted/80 mt-2">
                      {item.description}
                    </p>
                  )}
                  {item.points && item.points.length > 0 && (
                    <ul className="mt-2.5 flex flex-col gap-1 text-xs font-sans text-muted/70 list-disc list-inside">
                      {item.points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-lg border border-white/10 bg-surface-200/60 text-muted hover:text-softwhite transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.role, item.company)}
                  className="p-2 rounded-lg border border-white/10 bg-surface-200/60 text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite hover:bg-surface-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-softwhite mb-1">
              {editingItem ? "EDIT POSITION" : "ADD NEW POSITION"}
            </h2>
            <p className="font-sans text-xs text-muted/70 mb-6">
              Details for your chronological professional timeline.
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
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => {
                      const r = e.target.value;
                      setFormData({
                        ...formData,
                        role: r,
                        slug_id: !editingItem ? `${r.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${formData.company.toLowerCase().replace(/[^a-z0-9]+/g, "")}`.replace(/^-|-$/g, "") : formData.slug_id,
                      });
                    }}
                    placeholder="Assistant General Secretary"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="IIUC Computer Club"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Unique Slug Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug_id}
                    onChange={(e) => setFormData({ ...formData, slug_id: e.target.value })}
                    placeholder="iiuc-cc-ags"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Period String *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="2026 — PRESENT"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Chittagong, BD"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    placeholder="Full-time / Leadership"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Executive Scope Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Co-leading executive club governance, strategic initiatives..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Deliverable Highlights (1 point per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  placeholder="Spearheaded club administration...&#10;Directing flagship hackathons..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                  className="rounded border-white/20 bg-surface-200 text-lavender focus:ring-lavender"
                />
                <label htmlFor="is_current" className="font-mono text-xs text-softwhite">
                  Mark as Current Active Role
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
                  {formLoading ? "SAVING..." : editingItem ? "UPDATE POSITION" : "CREATE POSITION"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

