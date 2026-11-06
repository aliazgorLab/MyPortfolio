"use client";

import { useState, useEffect } from "react";
import {
  getSiteSettingsAction,
  updateSiteSettingAction,
} from "@/lib/actions/settings";
import {
  createUploadIntentAction,
  confirmUploadAction,
} from "@/lib/actions/media";
import {
  Settings,
  User,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  BookOpen,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Editable Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: "Md Ali Azgor",
    title: "UI/UX DESIGNER · CREATIVE DEVELOPER · SOFTWARE ENGINEERING STUDENT",
    bio: "I'm Md Ali Azgor — a CSE student at International Islamic University Chittagong and creative developer...",
    location: "CHITTAGONG, BANGLADESH",
    status: "OPEN FOR COLLABORATION & INTERNSHIPS",
    email: "ali.azgor.0810@gmail.com",
    linkedin: "https://linkedin.com/in/ali-azgor",
    github: "https://github.com/aliazgorLab",
  });

  // Principles State
  const [principles, setPrinciples] = useState([
    {
      number: "01",
      title: "INTENTION",
      subtitle: "Every interface choice should have a reason.",
      detail: "No superfluous decoration. Every typographic scale, padding token, and visual hierarchy choice exists to serve user comprehension and emotional resonance.",
    },
    {
      number: "02",
      title: "CLARITY",
      subtitle: "Visual quality must improve usability, not compete with it.",
      detail: "Atmosphere and cinematic contrast must never sacrifice readability, accessibility, or core interaction speed. Form elevates function.",
    },
    {
      number: "03",
      title: "CRAFT",
      subtitle: "The small details matter: spacing, timing, transitions, responsiveness, and performance.",
      detail: "From 120fps motion choreography and sub-millisecond layout shifts to clean semantic markup and fluid viewport adaptations, true polish lives in the nuances.",
    },
  ]);

  // Resume State
  const [resumeSetting, setResumeSetting] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    const res = await getSiteSettingsAction();
    if (res.success && res.data) {
      const map = {};
      res.data.forEach((s) => {
        map[s.key] = s;
      });
      setSettings(map);
      if (map.personal_info?.value) {
        setPersonalInfo({ ...personalInfo, ...map.personal_info.value });
      }
      if (map.principles?.value) {
        setPrinciples(map.principles.value);
      }
      if (map.resume_pdf) {
        setResumeSetting(map.resume_pdf);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const res = await updateSiteSettingAction({
      key: "personal_info",
      value: personalInfo,
      description: "Main personal identity and verified contact channels",
      is_public: true,
    });

    if (res.success) {
      setStatusMessage({ type: "success", text: "Personal information updated successfully." });
    } else {
      setStatusMessage({ type: "error", text: res.error });
    }
    setSaving(false);
  };

  const handleSavePrinciples = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const res = await updateSiteSettingAction({
      key: "principles",
      value: principles,
      description: "Guiding design principles",
      is_public: true,
    });

    if (res.success) {
      setStatusMessage({ type: "success", text: "Working principles updated successfully." });
    } else {
      setStatusMessage({ type: "error", text: res.error });
    }
    setSaving(false);
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setUploadingResume(true);
    setStatusMessage(null);

    try {
      // 1. Upload intent for private documents
      const intentRes = await createUploadIntentAction({
        filename: resumeFile.name,
        size_bytes: resumeFile.size,
        mime_type: "application/pdf",
        folder: "documents",
        is_draft: false,
      });

      if (!intentRes.success) throw new Error(intentRes.error);

      // 2. Direct PUT to signed URL
      const { signedUrl, storagePath, bucket } = intentRes.data;
      const uploadHttpRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        body: resumeFile,
      });

      if (!uploadHttpRes.ok) throw new Error("Resume upload failed");

      // 3. Confirm upload
      const confirmRes = await confirmUploadAction({
        storage_path: storagePath,
        bucket,
        folder: "documents",
        file_name: resumeFile.name,
        size_bytes: resumeFile.size,
        mime_type: "application/pdf",
        alt_text: "Md Ali Azgor Resume PDF",
      });

      if (!confirmRes.success) throw new Error(confirmRes.error);

      // 4. Update site_settings for resume_pdf
      const settingRes = await updateSiteSettingAction({
        key: "resume_pdf",
        value: {
          file_name: resumeFile.name,
          updated_at: new Date().toISOString(),
        },
        description: "Official Curriculum Vitae (stored in portfolio-private)",
        is_public: false,
        media_id: confirmRes.data.id,
      });

      if (!settingRes.success) throw new Error(settingRes.error);

      setStatusMessage({ type: "success", text: "Resume PDF securely uploaded and linked to settings." });
      setResumeFile(null);
      loadSettings();
    } catch (err) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-mono text-xs text-lavender tracking-widest uppercase mb-1">
          <span>CONFIG // 06</span>
          <span>·</span>
          <span>SYSTEM ATTRIBUTES</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
          SITE SETTINGS & IDENTITY
        </h1>
        <p className="font-sans text-xs text-muted/70 mt-1">
          Modify your global identity, working principles, and private resume document.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2 border ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-muted">
          Loading site configurations...
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Personal Info Form */}
          <form onSubmit={handleSavePersonalInfo} className="p-6 md:p-8 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-xl flex flex-col gap-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
              <User className="w-4 h-4 text-lavender" />
              <h2 className="font-display text-base font-bold text-softwhite">
                PERSONAL IDENTITY & CONTACT
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Professional Title *
                </label>
                <input
                  type="text"
                  required
                  value={personalInfo.title}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                Executive Biography *
              </label>
              <textarea
                rows={3}
                required
                value={personalInfo.bio}
                onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Geographic Location
                </label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Availability Status
                </label>
                <input
                  type="text"
                  value={personalInfo.status}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={personalInfo.github}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_15px_rgba(199,184,255,0.25)] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "SAVING..." : "SAVE PROFILE IDENTITY"}</span>
              </button>
            </div>
          </form>

          {/* Resume / CV Private Document Manager */}
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-xl flex flex-col gap-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-lavender" />
                <h2 className="font-display text-base font-bold text-softwhite">
                  CURRICULUM VITAE (PRIVATE STORAGE)
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                portfolio-private
              </span>
            </div>

            <p className="font-sans text-xs text-muted/80">
              The resume PDF is stored securely in the private bucket and protected by Row Level Security.
            </p>

            {resumeSetting?.media && (
              <div className="p-4 rounded-xl bg-surface-200/50 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-sans text-xs font-semibold text-softwhite block">
                    {resumeSetting.media.file_name}
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    {Math.round(resumeSetting.media.size_bytes / 1024)} KB · Updated {new Date(resumeSetting.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ACTIVE RESUME LINKED</span>
                </span>
              </div>
            )}

            <form onSubmit={handleUploadResume} className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <input
                type="file"
                required
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0] || null)}
                className="w-full text-xs text-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-surface-200 file:text-softwhite hover:file:bg-surface-200/80 cursor-pointer"
              />
              <button
                type="submit"
                disabled={uploadingResume || !resumeFile}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_15px_rgba(199,184,255,0.25)] disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploadingResume ? "UPLOADING..." : "UPLOAD RESUME PDF"}</span>
              </button>
            </form>
          </div>

          {/* Working Principles Form */}
          <form onSubmit={handleSavePrinciples} className="p-6 md:p-8 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-xl flex flex-col gap-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
              <BookOpen className="w-4 h-4 text-lavender" />
              <h2 className="font-display text-base font-bold text-softwhite">
                DESIGN MANIFESTO & PRINCIPLES
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {principles.map((p, idx) => (
                <div key={p.number} className="p-4 rounded-xl bg-surface-200/40 border border-white/5 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-lavender">
                      {p.number} //
                    </span>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => {
                        const next = [...principles];
                        next[idx].title = e.target.value;
                        setPrinciples(next);
                      }}
                      className="flex-1 px-3 py-1.5 rounded bg-surface-200 border border-white/10 text-xs font-display font-bold text-softwhite"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={p.subtitle}
                      onChange={(e) => {
                        const next = [...principles];
                        next[idx].subtitle = e.target.value;
                        setPrinciples(next);
                      }}
                      className="w-full px-3 py-1.5 rounded bg-surface-200 border border-white/10 text-xs font-sans text-softwhite"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                      Philosophical Detail
                    </label>
                    <textarea
                      rows={2}
                      value={p.detail}
                      onChange={(e) => {
                        const next = [...principles];
                        next[idx].detail = e.target.value;
                        setPrinciples(next);
                      }}
                      className="w-full px-3 py-1.5 rounded bg-surface-200 border border-white/10 text-xs font-sans text-muted/90"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_15px_rgba(199,184,255,0.25)] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "SAVING..." : "SAVE MANIFESTO"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
