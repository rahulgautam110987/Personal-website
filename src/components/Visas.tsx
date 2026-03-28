"use client";
import { motion } from "framer-motion";
import { Globe, Plane } from "lucide-react";
import { resumeData } from "@/data/resume";
import SectionHeading from "./SectionHeading";

const FLAG_EMOJI: Record<string, string> = {
  USA: "🇺🇸",
  Japan: "🇯🇵",
  "Saudi Arabia": "🇸🇦",
};

export default function Visas() {
  return (
    <section id="visas" className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Valid Visas"
          subtitle="Active travel documents enabling global engagement"
          icon={<Globe className="w-5 h-5" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {resumeData.visas.map((visa, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="group relative rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all p-6 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <span className="text-4xl mb-3 block">
                  {FLAG_EMOJI[visa.country] || "🌐"}
                </span>
                <h3 className="text-lg font-bold text-white/90 mb-1">
                  {visa.country}
                </h3>
                <p className="text-sm text-white/50 mb-3">{visa.type}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Plane className="w-3 h-3" />
                  {visa.validity}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
