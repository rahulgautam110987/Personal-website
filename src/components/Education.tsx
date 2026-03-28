"use client";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Star } from "lucide-react";
import { resumeData } from "@/data/resume";
import SectionHeading from "./SectionHeading";

export default function Education() {
  return (
    <section id="education" className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Education"
          subtitle="World-class institutions shaping a global perspective"
          icon={<GraduationCap className="w-5 h-5" />}
        />

        <div className="space-y-4">
          {resumeData.education.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -2 }}
              className="group relative rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all p-6 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white/90">
                    {edu.institution}
                  </h3>
                  <p className="text-sm text-white/60 mt-0.5">{edu.degree}</p>
                  {edu.honors && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-xs rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                      <Star className="w-3 h-3" />
                      {edu.honors}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs text-white/40 shrink-0">
                  <MapPin className="w-3 h-3" />
                  {edu.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
