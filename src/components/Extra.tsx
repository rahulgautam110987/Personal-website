"use client";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { resumeData } from "@/data/resume";
import SectionHeading from "./SectionHeading";

export default function Extra() {
  if (!resumeData.extra || resumeData.extra.length === 0) return null;

  return (
    <section id="additional" className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Additional Information"
          icon={<Info className="w-5 h-5" />}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {resumeData.extra.map((item, idx) => (
            <span
              key={idx}
              className="px-4 py-2 text-sm rounded-lg bg-white/[0.02] border border-white/5 text-white/50"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
