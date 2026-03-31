"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import { resumeData } from "@/data/resume";
import { cn } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

const METRIC_RE =
  /(\$[\d,.]+[KMB]?\+?(?:[–-]\$?[\d,.]+[KMB])?|[\d,]+[–-][\d,]+%|\d+%|\d+x|[\d,]+\s*TPS|p\d+|[\d,]+\+|\d+M\+?)/gi;

function extractMetrics(text: string): string[] {
  const matches = text.match(METRIC_RE);
  return matches ? [...new Set(matches)] : [];
}

function highlightMetrics(text: string): React.ReactNode {
  const parts = text.split(METRIC_RE);
  return parts.map((part, i) => {
    if (METRIC_RE.test(part)) {
      METRIC_RE.lastIndex = 0;
      return (
        <span
          key={i}
          className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold text-xs border border-blue-500/20"
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const scrollToCompany = (companyName: string) => {
    const expIdx = resumeData.experience.findIndex((e) =>
      e.company.toLowerCase().includes(companyName.toLowerCase().split(" ")[0])
    );
    if (expIdx !== -1) {
      setExpandedIndex(expIdx);
      setTimeout(() => {
        document
          .getElementById(`exp-${expIdx}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  return (
    <section id="experience" className="relative py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Professional Experience"
          subtitle=""
          icon={<Briefcase className="w-5 h-5" />}
        />

        {/* Trusted By strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-center mb-4 font-medium" style={{ color: "var(--text-5)" }}>
            Trusted By
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-x-10">
            {resumeData.companies.map((name) => (
              <button
                key={name}
                onClick={() => scrollToCompany(name)}
                className="text-sm sm:text-base font-semibold tracking-wide hover:text-blue-400 transition-colors cursor-pointer"
                style={{ color: "var(--text-4)" }}
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-transparent" />

          <div className="space-y-6">
            {resumeData.experience.map((exp, idx) => {
              const isExpanded = expandedIndex === idx;
              const allMetrics = exp.bullets.flatMap((b) =>
                b.subbullets.flatMap(extractMetrics)
              );
              const uniqueMetrics = [...new Set(allMetrics)].slice(0, 5);

              return (
                <motion.div
                  key={idx}
                  id={`exp-${idx}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative md:pl-20"
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-6 top-6 w-5 h-5 items-center justify-center">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full border-2 transition-colors",
                        isExpanded
                          ? "border-blue-400 bg-blue-400 shadow-lg shadow-blue-400/30"
                          : "border-white/20 bg-[var(--bg)]"
                      )}
                    />
                  </div>

                  <motion.div
                    className={cn(
                      "group rounded-2xl border transition-all duration-300 overflow-hidden",
                      isExpanded
                        ? "border-white/15 bg-white/[0.04] shadow-2xl shadow-blue-500/5"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]"
                    )}
                  >
                    {/* Header - always visible */}
                    <button
                      onClick={() =>
                        setExpandedIndex(isExpanded ? -1 : idx)
                      }
                      className="w-full text-left p-5 sm:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                            <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                              {exp.company}
                            </h3>
                          </div>
                          <p className="text-sm sm:text-base font-medium text-white/70 mb-2">
                            {exp.role}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {exp.dates}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {exp.locations}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Metric chips preview */}
                          {!isExpanded && uniqueMetrics.length > 0 && (
                            <div className="hidden lg:flex flex-wrap gap-1.5">
                              {uniqueMetrics.slice(0, 3).map((m, mi) => (
                                <span
                                  key={mi}
                                  className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          )}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-white/30" />
                          </motion.div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 space-y-4">
                            <div className="h-px bg-white/5" />
                            {"description" in exp && exp.description && (
                              <p className="text-sm text-white/50 leading-relaxed italic">
                                {highlightMetrics(exp.description as string)}
                              </p>
                            )}
                            {exp.bullets.map((bullet, bi) => (
                              <div key={bi} className="space-y-2">
                                <h4 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                                  {bullet.title}
                                </h4>
                                <ul className="space-y-2 pl-4">
                                  {bullet.subbullets.map((sub, si) => (
                                    <li
                                      key={si}
                                      className="text-sm text-white/55 leading-relaxed"
                                    >
                                      {highlightMetrics(sub)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
