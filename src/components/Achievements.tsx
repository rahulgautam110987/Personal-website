"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Trophy, TrendingUp, Award } from "lucide-react";
import { resumeData } from "@/data/resume";
import SectionHeading from "./SectionHeading";

const TYPE_LABELS: Record<string, string> = {
  thought_leadership: "Thought Leadership",
  client_impact: "Client Impact",
  business_building: "Business Building",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  thought_leadership: <Award className="w-4 h-4" />,
  client_impact: <TrendingUp className="w-4 h-4" />,
  business_building: <Trophy className="w-4 h-4" />,
};

const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  thought_leadership: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
  },
  client_impact: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  business_building: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
  },
};

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) {
      setDisplay(value);
      return;
    }

    const target = parseFloat(numMatch[0]);
    const prefix = value.slice(0, value.indexOf(numMatch[0]));
    const suffix = value.slice(
      value.indexOf(numMatch[0]) + numMatch[0].length
    );

    if (isNaN(target)) {
      setDisplay(value);
      return;
    }

    const duration = 1200;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const formatted =
        target % 1 === 0 ? Math.round(current).toString() : current.toFixed(1);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

export default function Achievements() {
  const grouped = {
    thought_leadership: resumeData.achievements.filter((a) => a.type === "thought_leadership"),
    client_impact: resumeData.achievements.filter((a) => a.type === "client_impact"),
    business_building: resumeData.achievements.filter((a) => a.type === "business_building"),
  };

  return (
    <section id="achievements" className="relative py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Key Achievements"
          subtitle="Measurable impact across industries and geographies"
          icon={<Trophy className="w-5 h-5" />}
        />

        {Object.entries(grouped).map(([type, items]) => {
          const colors = TYPE_COLORS[type] || TYPE_COLORS.metrics;
          const icon = TYPE_ICONS[type];

          return (
            <div key={type} className="mb-12 last:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 mb-6"
              >
                <span className={`${colors.text}`}>{icon}</span>
                <h3 className="text-lg font-semibold text-white/80">
                  {TYPE_LABELS[type] || type}
                </h3>
                <span className="text-xs text-white/30 font-mono">
                  ({items.length})
                </span>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((achievement, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`group relative rounded-xl border ${colors.border} bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden`}
                  >
                    {/* Spotlight glow on hover */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${colors.bg}`}
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${
                          type === "business_building"
                            ? "rgba(234,179,8,0.08)"
                            : type === "thought_leadership"
                            ? "rgba(139,92,246,0.08)"
                            : "rgba(59,130,246,0.08)"
                        }, transparent 70%)`,
                      }}
                    />

                    <div className="relative">
                      <div className="text-3xl sm:text-4xl font-bold mb-2">
                        <span
                          className={`bg-gradient-to-r ${
                            type === "business_building"
                              ? "from-yellow-400 to-amber-400"
                              : type === "thought_leadership"
                              ? "from-purple-400 to-pink-400"
                              : "from-blue-400 to-cyan-400"
                          } bg-clip-text text-transparent`}
                        >
                          <AnimatedCounter value={achievement.metric} />
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white/80 mb-1">
                        {achievement.label}
                      </p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        {achievement.context}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
