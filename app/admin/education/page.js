"use client";

import { useState, useEffect } from "react";
import {
  getEducationAction,
  createEducationAction,
  updateEducationAction,
  deleteEducationAction,
} from "@/lib/actions/education";
import {
  Plus,
  GraduationCap,
  Trash2,
  Edit,
  X,
  AlertCircle,
} from "lucide-react";

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    department: "Computer Science & Engineering",
    start_year: 2022,
    end_year: 2026,
    current_status: "Undergraduate (Enrolled)",
    description: "",
    display_order: 1,
    status: "published",
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getEducationAction();
    if (res.success) {
      setEducationList(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      institution: "International Islamic University Chittagong (IIUC)",
      degree: "B.Sc. in Computer Science & Engineering",
      department: "Department of Computer Science & Engineering",
      start_year: 2022,
      end_year: 2026,
      current_status: "Undergraduate (Enrolled)",
      description: "",
      display_order: educationList.length + 1,
      status: "published",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      institution: item.institution,
      degree: item.degree,
      department: item.department || "",
      start_year: item.start_year || 2022,
      end_year: item.end_year || 2026,
      current_status: item.current_status || "",
      description: item.description || "",
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
      res = await updateEducationAction(editingItem.id, formData);
    } else {
      res = await createEducationAction(formData);
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

  const handleDelete = async (id, degree) => {
    if (!confirm(`Delete education record "${degree}"?`)) return;
    const res = await deleteEducationAction(id);
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
            <span>INDEX // 08</span>
            <span>·</span>
            <span>ACADEMIC FOUNDATIONS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
            EDUCATION MANAGEMENT
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_20px_rgba(199,184,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>ADD DEGREE</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-muted">
          Loading academic credentials...
        </div>
      ) : educationList.length === 0 ? (
        <div className="py-20 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
          No education records found. Add your degree.
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-white/5 border border-white/10 rounded-2xl bg-surface-100/40 backdrop-blur-xl overflow-hidden">
          {educationList.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-200/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-surface-200 text-lavender border border-white/5 mt-1">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-softwhite">
                    {item.degree}
                  </h3>
                  <div className="font-mono text-xs text-lavender mt-0.5">
                    {item.institution}
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[10px] text-muted mt-1.5">
                    <span>
                      {item.start_year} — {item.end_year || "Present"}
                    </span>
                    <span>·</span>
                    <span className="text-emerald-400">{item.current_status}</span>
                  </div>
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
                  onClick={() => handleDelete(item.id, item.degree)}
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
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-xl font-bold text-softwhite mb-1">
              {editingItem ? "EDIT DEGREE" : "ADD DEGREE"}
            </h2>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Degree Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.Sc. in Computer Science and Engineering"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. International Islamic University Chittagong"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Start Year
                  </label>
                  <input
                    type="number"
                    value={formData.start_year}
                    onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) || 2022 })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    End Year (or Expected)
                  </label>
                  <input
                    type="number"
                    value={formData.end_year}
                    onChange={(e) => setFormData({ ...formData, end_year: parseInt(e.target.value) || 2026 })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
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
                  className="px-4 py-2 rounded-lg bg-lavender text-obsidian text-xs font-mono font-semibold uppercase hover:bg-softwhite transition-colors"
                >
                  {formLoading ? "SAVING..." : "SAVE DEGREE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

