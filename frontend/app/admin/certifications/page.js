"use client";

import { useState, useEffect } from "react";
import {
  getCertificationsAction,
  createCertificationAction,
  updateCertificationAction,
  deleteCertificationAction,
} from "@/lib/actions/certifications";
import {
  Plus,
  Award,
  ExternalLink,
  Trash2,
  Edit,
  X,
  AlertCircle,
} from "lucide-react";

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    issuing_organization: "",
    issue_date: "",
    credential_url: "",
    credential_id: "",
    description: "",
    display_order: 1,
    status: "published",
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getCertificationsAction();
    if (res.success) {
      setCertifications(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      issuing_organization: "",
      issue_date: new Date().toISOString().split("T")[0],
      credential_url: "",
      credential_id: "",
      description: "",
      display_order: certifications.length + 1,
      status: "published",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      issuing_organization: item.issuing_organization,
      issue_date: item.issue_date || "",
      credential_url: item.credential_url || "",
      credential_id: item.credential_id || "",
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
      res = await updateCertificationAction(editingItem.id, formData);
    } else {
      res = await createCertificationAction(formData);
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
    if (!confirm(`Delete certification "${title}"?`)) return;
    const res = await deleteCertificationAction(id);
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
            <span>INDEX // 09</span>
            <span>·</span>
            <span>VERIFIED HONORS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
            CERTIFICATIONS & AWARDS
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_20px_rgba(199,184,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>ADD CERTIFICATION</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-muted">
          Loading certifications...
        </div>
      ) : certifications.length === 0 ? (
        <div className="py-20 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
          No certification records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-white/5 border border-white/10 rounded-2xl bg-surface-100/40 backdrop-blur-xl overflow-hidden">
          {certifications.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-200/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-surface-200 text-lavender border border-white/5 mt-1">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-softwhite">
                    {item.title}
                  </h3>
                  <div className="font-mono text-xs text-lavender mt-0.5">
                    {item.issuing_organization}
                  </div>
                  {item.credential_id && (
                    <div className="font-mono text-[10px] text-muted mt-1">
                      ID: {item.credential_id}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {item.credential_url && (
                  <a
                    href={item.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border border-white/10 bg-surface-200 text-muted hover:text-lavender transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-lg border border-white/10 bg-surface-200 text-muted hover:text-softwhite transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 rounded-lg border border-white/10 bg-surface-200 text-muted hover:text-red-400 hover:border-red-400/30 transition-colors"
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
              {editingItem ? "EDIT CERTIFICATION" : "ADD CERTIFICATION"}
            </h2>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Certification Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Meta Frontend Developer Professional Certificate"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuing_organization}
                  onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
                  placeholder="e.g. Coursera / Meta"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={formData.credential_id}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono text-softwhite focus:outline-none focus:border-lavender"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                    Verification URL
                  </label>
                  <input
                    type="url"
                    value={formData.credential_url}
                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
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
                  {formLoading ? "SAVING..." : "SAVE CERTIFICATION"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

