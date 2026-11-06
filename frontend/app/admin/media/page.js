"use client";

import { useState, useEffect } from "react";
import {
  getMediaListAction,
  createUploadIntentAction,
  confirmUploadAction,
  requestMediaDeletionAction,
} from "@/lib/actions/media";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Folder,
  X,
  AlertCircle,
} from "lucide-react";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bucketFilter, setBucketFilter] = useState("ALL");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState(null);
  const [folder, setFolder] = useState("projects");
  const [altText, setAltText] = useState("");
  const [isDraft, setIsDraft] = useState(true);

  const loadMedia = async () => {
    setLoading(true);
    const options = {};
    if (bucketFilter !== "ALL") {
      options.bucket = bucketFilter;
    }
    const res = await getMediaListAction(options);
    if (res.success) {
      setMediaList(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, [bucketFilter]);

  const handleCopyUrl = (id, url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      // 1. Get Upload Intent & Signed URL from server
      const intentRes = await createUploadIntentAction({
        filename: selectedFile.name,
        size_bytes: selectedFile.size,
        mime_type: selectedFile.type,
        folder,
        is_draft: isDraft,
      });

      if (!intentRes.success) {
        throw new Error(intentRes.error);
      }

      const { signedUrl, storagePath, bucket } = intentRes.data;

      // 2. Client direct PUT to signed URL
      const uploadHttpRes = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadHttpRes.ok) {
        throw new Error(`Storage upload failed with HTTP status ${uploadHttpRes.status}`);
      }

      // 3. Confirm upload on server
      const confirmRes = await confirmUploadAction({
        storage_path: storagePath,
        bucket,
        folder,
        file_name: selectedFile.name,
        size_bytes: selectedFile.size,
        mime_type: selectedFile.type,
        alt_text: altText,
      });

      if (!confirmRes.success) {
        throw new Error(confirmRes.error);
      }

      setUploadModalOpen(false);
      setSelectedFile(null);
      setAltText("");
      loadMedia();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, fileName) => {
    if (!confirm(`Delete media asset "${fileName}"? This will check for existing references before queuing.`)) return;
    const res = await requestMediaDeletionAction(id);
    if (res.success) {
      loadMedia();
    } else {
      alert(`Deletion rejected: ${res.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-lavender tracking-widest uppercase mb-1">
            <span>STORAGE // 05</span>
            <span>·</span>
            <span>ASSET LEDGER</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-softwhite">
            MEDIA ASSET MANAGER
          </h1>
          <p className="font-sans text-xs text-muted/70 mt-1">
            Dual-bucket security: drafts in portfolio-private, published assets in portfolio-media CDN.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedFile(null);
            setUploadError(null);
            setUploadModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-lavender text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-softwhite transition-all shadow-[0_0_20px_rgba(199,184,255,0.25)]"
        >
          <Upload className="w-4 h-4" />
          <span>UPLOAD ASSET</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { label: "ALL ASSETS", val: "ALL" },
          { label: "PUBLIC (CDN)", val: "portfolio-media" },
          { label: "PRIVATE (DRAFTS / CV)", val: "portfolio-private" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setBucketFilter(tab.val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all ${
              bucketFilter === tab.val
                ? "bg-lavender text-obsidian font-semibold"
                : "bg-surface-100 text-muted hover:text-softwhite border border-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-muted">
          Loading media library...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="py-20 text-center font-mono text-xs text-muted/60 border border-dashed border-white/10 rounded-2xl">
          No media assets found in this bucket.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {mediaList.map((m) => {
            const isImage = m.mime_type.startsWith("image/");
            const isPrivate = m.bucket === "portfolio-private";

            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl border border-white/10 bg-surface-100/50 backdrop-blur-md flex flex-col justify-between group hover:border-lavender/30 transition-all"
              >
                <div>
                  {/* Thumbnail / Placeholder */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-surface-200/80 mb-3 border border-white/5 flex items-center justify-center">
                    {isImage && m.public_url ? (
                      <img
                        src={m.public_url}
                        alt={m.alt_text || m.file_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-muted">
                        {isImage ? (
                          <ImageIcon className="w-6 h-6 text-lavender" />
                        ) : (
                          <FileText className="w-6 h-6 text-lavender" />
                        )}
                        <span className="font-mono text-[9px] uppercase">
                          {isPrivate ? "PRIVATE ASSET" : m.mime_type}
                        </span>
                      </div>
                    )}

                    {/* Bucket Badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase ${
                          isPrivate
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {isPrivate ? "PRIVATE" : "PUBLIC"}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <h4 className="font-sans text-xs font-semibold text-softwhite truncate">
                      {m.file_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-muted">
                      <span>{Math.round(m.size_bytes / 1024)} KB</span>
                      <span>·</span>
                      <span className="capitalize">{m.folder}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  {m.public_url ? (
                    <button
                      onClick={() => handleCopyUrl(m.id, m.public_url)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono text-lavender hover:underline"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY CDN URL</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="font-mono text-[10px] text-muted/60">
                      NO PUBLIC URL
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(m.id, m.file_name)}
                    title="Delete media"
                    className="p-1.5 rounded-lg border border-white/5 bg-surface-200 text-muted hover:text-red-400 hover:border-red-400/30 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-100 border border-white/15 rounded-2xl p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-softwhite"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-lg font-bold text-softwhite mb-1">
              UPLOAD MEDIA ASSET
            </h2>
            <p className="font-sans text-xs text-muted/70 mb-6">
              Files are securely ingested through server-authorized upload intents.
            </p>

            {uploadError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  File Selection * (Images up to 5MB, PDF up to 10MB)
                </label>
                <input
                  type="file"
                  required
                  accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                  className="w-full text-xs text-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-surface-200 file:text-softwhite hover:file:bg-surface-200/80 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Folder Destination *
                </label>
                <select
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs font-sans text-softwhite focus:outline-none focus:border-lavender"
                >
                  <option value="projects">Projects</option>
                  <option value="artworks">Artworks</option>
                  <option value="experience">Experience Logos</option>
                  <option value="education">Education Logos</option>
                  <option value="certifications">Certificates</option>
                  <option value="general">General Assets</option>
                  <option value="documents">Documents (Private)</option>
                  <option value="private_settings">Private Settings (Private)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-muted tracking-wider uppercase mb-1">
                  Accessibility Alt Text
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Descriptive text for screen readers..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-200 border border-white/10 text-xs text-softwhite focus:outline-none focus:border-lavender"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isDraftCheck"
                  checked={isDraft}
                  onChange={(e) => setIsDraft(e.target.checked)}
                  className="rounded border-white/20 bg-surface-200 text-lavender focus:ring-lavender"
                />
                <label htmlFor="isDraftCheck" className="font-mono text-xs text-softwhite">
                  Route to Private Staging (Recommended for Draft Content)
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-mono text-muted"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="px-4 py-2 rounded-lg bg-lavender text-obsidian text-xs font-mono font-semibold uppercase hover:bg-softwhite transition-colors disabled:opacity-50"
                >
                  {uploading ? "UPLOADING..." : "START UPLOAD"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

