"use client";
import { resumeData } from "@/data/resume";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              RG
            </span>
            <span className="text-xs text-white/30">
              {resumeData.basics.name}
            </span>
          </div>
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} {resumeData.basics.name}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
