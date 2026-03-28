"use client";
import { motion } from "motion/react";
import { Code2 } from "lucide-react";
import { resumeData } from "@/data/resume";
import SectionHeading from "./SectionHeading";

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Cloud & Infrastructure": "from-blue-500/20 to-cyan-500/20",
  "AI & Data": "from-purple-500/20 to-pink-500/20",
  "Salesforce Ecosystem": "from-sky-500/20 to-blue-500/20",
  "Integration & APIs": "from-green-500/20 to-emerald-500/20",
  "Frontend & Mobile": "from-orange-500/20 to-yellow-500/20",
  "Enterprise & CRM": "from-red-500/20 to-rose-500/20",
  "Observability & DevOps": "from-indigo-500/20 to-violet-500/20",
  "MarTech & Analytics": "from-pink-500/20 to-fuchsia-500/20",
  "Architecture & Governance": "from-teal-500/20 to-cyan-500/20",
  "Strategy & Consulting": "from-amber-500/20 to-yellow-500/20",
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="Full-stack expertise across cloud, AI, enterprise platforms, and consulting"
          icon={<Code2 className="w-5 h-5" />}
        />

        {/* Specialties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">
            Specialties
          </h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.specialtiesList.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white/60 border border-white/5 hover:border-white/15 hover:text-white/80 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumeData.skills.map((group, idx) => {
            const gradient =
              CATEGORY_GRADIENTS[group.category] ||
              "from-blue-500/20 to-purple-500/20";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ y: -2 }}
                className="group rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all p-5 overflow-hidden relative"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradient}`}
                />
                <h3 className="text-sm font-semibold text-white/70 mb-3">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((skill, si) => (
                    <span
                      key={si}
                      className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-white/50 border border-white/5 hover:border-white/15 hover:text-white/70 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
