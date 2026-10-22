"use client";

import { useState } from "react";
import { personalInfo } from "@/data/portfolioData";
import { copyTextToClipboard } from "@/lib/utils";
import { Mail, ArrowUpRight, Copy, Check, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");

  const handleCopyEmail = async () => {
    const success = await copyTextToClipboard(personalInfo.email);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDirectEmail = (e) => {
    e.preventDefault();
    const mailSubject = encodeURIComponent(
      subject ? `[Project Inquiry] ${subject}` : `Collaboration Inquiry from Portfolio`
    );
    const mailBody = encodeURIComponent(
      `Hello Ali,\n\n${message || "I would like to discuss a project with you."}\n\nBest regards,\n${senderName || "Visitor"}`
    );
    window.location.href = `mailto:${personalInfo.email}?subject=${mailSubject}&body=${mailBody}`;
  };

  return (
    <section id="contact" className="py-32 md:py-44 px-6 bg-obsidian relative border-t border-white/5 noise-bg overflow-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-lavender/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-lavender tracking-widest uppercase mb-6">
          <span>08 //</span>
          <span>INITIATE COLLABORATION</span>
        </div>

        {/* Dramatic Final Frame Heading */}
        <div className="max-w-5xl mb-16">
          <h2 className="font-display-hero text-softwhite tracking-tighter">
            HAVE AN IDEA?
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-softwhite via-mist to-lavender">
              LET&apos;S MAKE IT REAL.
            </span>
          </h2>
          <p className="font-sans text-muted/90 text-lg sm:text-xl md:text-2xl mt-6 max-w-2xl leading-relaxed font-light">
            Interested in collaborating on a thoughtful digital product, interface, or creative development project? Let&apos;s talk.
          </p>
        </div>

        {/* Contact Action Center (Dual Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Direct Inquiries & Quick Messenger (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <span className="font-mono text-xs text-lavender uppercase tracking-widest">
                // DIRECT DISPATCH CHANNEL
              </span>
              <span className="font-mono text-[10px] text-muted uppercase">
                ENCRYPTED & DIRECT
              </span>
            </div>

            <form onSubmit={handleDirectEmail} className="flex flex-col gap-5">
              <div>
                <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-surface-200/80 border border-white/10 text-softwhite font-sans text-sm focus:outline-none focus:border-lavender transition-colors placeholder:text-muted/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                  SUBJECT / TOPIC
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design System & Frontend Architecture"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-surface-200/80 border border-white/10 text-softwhite font-sans text-sm focus:outline-none focus:border-lavender transition-colors placeholder:text-muted/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                  PROJECT BRIEF / MESSAGE
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your goals, timelines, or role opportunities..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-surface-200/80 border border-white/10 text-softwhite font-sans text-sm focus:outline-none focus:border-lavender transition-colors placeholder:text-muted/40 resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-softwhite text-obsidian font-mono text-xs font-semibold tracking-wider uppercase hover:bg-lavender transition-all duration-300 shadow-[0_0_20px_rgba(243,242,239,0.15)] hover:shadow-[0_0_25px_rgba(199,184,255,0.4)]"
              >
                <span>OPEN TRANSMISSION IN EMAIL CLIENT</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Verified Profiles & Copy Email (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Direct Email Card with Copy button */}
            <div className="p-8 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-xl">
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-2">
                OFFICIAL PRIMARY INBOX
              </span>
              <a
                href={`mailto:${personalInfo.email}`}
                className="font-display text-xl sm:text-2xl font-bold text-softwhite hover:text-lavender transition-colors break-all"
              >
                {personalInfo.email}
              </a>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 bg-surface-200 text-xs font-mono tracking-wider uppercase text-softwhite hover:border-lavender hover:text-lavender transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-lavender" />
                      <span>COPY EMAIL ADDRESS</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lavender text-obsidian text-xs font-mono font-semibold tracking-wider uppercase hover:bg-softwhite transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>MAILTO</span>
                </a>
              </div>
            </div>

            {/* Social / Professional Networks */}
            <div className="p-8 rounded-2xl border border-white/10 bg-surface-100/40 backdrop-blur-xl flex flex-col gap-4">
              <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
                VERIFIED PROFESSIONAL CHANNELS
              </span>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-surface-200/50 border border-white/5 hover:border-lavender/40 hover:bg-surface-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <LinkedinIcon className="w-5 h-5 text-lavender" />
                  <div>
                    <span className="font-display text-sm font-semibold text-softwhite block">
                      LinkedIn Profile
                    </span>
                    <span className="font-mono text-xs text-muted">
                      /in/ali-azgor
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-lavender group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-surface-200/50 border border-white/5 hover:border-lavender/40 hover:bg-surface-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <GithubIcon className="w-5 h-5 text-lavender" />
                  <div>
                    <span className="font-display text-sm font-semibold text-softwhite block">
                      GitHub Workspaces
                    </span>
                    <span className="font-mono text-xs text-muted">
                      @aliazgorLab
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-lavender group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
