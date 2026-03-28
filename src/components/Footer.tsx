"use client";
import { Mail, Linkedin } from "lucide-react";
import { resumeData } from "@/data/resume";

const FOOTER_LINKS = [
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="relative border-t border-white/5 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              RG
            </span>
            <span className="text-xs text-white/30">
              {resumeData.basics.name}
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${resumeData.basics.email}`}
              className="p-2 rounded-lg text-white/30 hover:text-blue-400 hover:bg-white/5 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={resumeData.basics.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-white/30 hover:text-blue-400 hover:bg-white/5 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} {resumeData.basics.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
