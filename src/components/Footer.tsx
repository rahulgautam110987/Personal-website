"use client";
import { resumeData } from "@/data/resume";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] text-white/20">
          &copy; {new Date().getFullYear()} {resumeData.basics.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
