"use client";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Download,
  MapPin,
  Mail,
  Phone,
  Linkedin,
} from "lucide-react";
import { resumeData } from "@/data/resume";

export default function Hero() {
  const { basics } = resumeData;

  const scrollToExperience = () => {
    document
      .getElementById("experience")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Credential chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {["MBA – IIM Calcutta", "MIT Sloan", "17+ Years"].map(
            (chip) => (
              <span
                key={chip}
                className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 border border-white/10 text-white/60"
              >
                {chip}
              </span>
            )
          )}
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
        >
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-white dark:to-white/70 bg-clip-text text-transparent">
            {basics.name}
          </span>
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl font-medium mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent light-subtitle"
        >
          {basics.title}
        </motion.p>

        {/* Header certs */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-xs sm:text-sm font-mono mb-8 max-w-3xl mx-auto"
          style={{ color: "var(--text-3)" }}
        >
          {basics.headerCerts}
        </motion.p>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-3xl mx-auto mb-10 space-y-3 text-center dark:text-center light-left"
        >
          {basics.summary.map((line, i) => (
            <p key={i} className="text-sm sm:text-base leading-relaxed light-black-text" style={{ color: "var(--text-2)" }}>
              {line}
            </p>
          ))}
        </motion.div>

        {/* Contact chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <a
            href={`mailto:${basics.email}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            {basics.email}
          </a>
          <a
            href={`tel:${basics.phone}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            {basics.phone}
          </a>
          <a
            href={`tel:${basics.phoneSecondary}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            {basics.phoneSecondary}
          </a>
          <a
            href={basics.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
            LinkedIn
          </a>
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs rounded-full bg-white/5 border border-white/10 text-white/60">
            <MapPin className="w-3.5 h-3.5" />
            {basics.location}
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToExperience}
            className="group relative px-8 py-3.5 rounded-xl text-sm font-semibold overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 transition-all group-hover:opacity-90" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
            <span className="relative flex items-center gap-2" style={{ color: "#ffffff" }}>
              View Experience
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group px-8 py-3.5 rounded-xl text-sm font-semibold text-white/70 border border-white/10 hover:border-white/20 hover:text-white bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: "1px solid var(--border-hover)" }}
          >
            <div className="w-1 h-2 rounded-full" style={{ backgroundColor: "var(--text-4)" }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
