"use client";
import { motion } from "motion/react";
import { BadgeCheck, Shield, Cloud, Database } from "lucide-react";
import { resumeData } from "@/data/resume";
import SectionHeading from "./SectionHeading";

function getCertIcon(cert: string) {
  if (cert.toLowerCase().includes("aws")) return <Cloud className="w-3.5 h-3.5" />;
  if (cert.toLowerCase().includes("azure")) return <Cloud className="w-3.5 h-3.5" />;
  if (cert.toLowerCase().includes("salesforce")) return <Database className="w-3.5 h-3.5" />;
  return <Shield className="w-3.5 h-3.5" />;
}

function getCertColor(cert: string): string {
  if (cert.toLowerCase().includes("aws"))
    return "border-orange-500/20 bg-orange-500/5 text-orange-400";
  if (cert.toLowerCase().includes("azure"))
    return "border-blue-500/20 bg-blue-500/5 text-blue-400";
  if (cert.toLowerCase().includes("salesforce"))
    return "border-sky-500/20 bg-sky-500/5 text-sky-400";
  return "border-purple-500/20 bg-purple-500/5 text-purple-400";
}

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Certifications"
          subtitle={`${resumeData.certifications.length}+ professional certifications across cloud, architecture, and enterprise platforms`}
          icon={<BadgeCheck className="w-5 h-5" />}
        />

        <div className="flex flex-wrap justify-center gap-3">
          {resumeData.certifications.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-all ${getCertColor(
                cert
              )}`}
            >
              {getCertIcon(cert)}
              {cert}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
