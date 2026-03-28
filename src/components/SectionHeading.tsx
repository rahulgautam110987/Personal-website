"use client";
import { motion } from "motion/react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function SectionHeading({
  title,
  subtitle,
  icon,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      {icon && (
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 mb-4">
          <span className="text-blue-400">{icon}</span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-20 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </motion.div>
  );
}
