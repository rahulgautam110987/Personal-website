"use client";
import { motion } from "motion/react";
import { Mail, Phone, Linkedin, MapPin, ExternalLink } from "lucide-react";
import { resumeData } from "@/data/resume";
import SectionHeading from "./SectionHeading";

export default function Contact() {
  const { basics } = resumeData;

  return (
    <section id="contact" className="relative py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Get In Touch"
          subtitle="Open to discussing enterprise architecture, cloud strategy, and technology leadership opportunities"
          icon={<Mail className="w-5 h-5" />}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-10 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={`mailto:${basics.email}`}
              className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-blue-500/20 bg-white/[0.02] hover:bg-blue-500/5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/40 mb-0.5">Email</p>
                <p className="text-sm text-white/70 group-hover:text-white break-all transition-colors">
                  {basics.email}
                </p>
              </div>
            </a>

            <a
              href={`tel:${basics.phone}`}
              className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-green-500/20 bg-white/[0.02] hover:bg-green-500/5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/40 mb-0.5">Phone (Primary)</p>
                <p className="text-sm text-white/70 group-hover:text-white transition-colors">
                  {basics.phone}
                </p>
              </div>
            </a>

            <a
              href={`tel:${basics.phoneSecondary}`}
              className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-emerald-500/20 bg-white/[0.02] hover:bg-emerald-500/5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/40 mb-0.5">Phone (Secondary)</p>
                <p className="text-sm text-white/70 group-hover:text-white transition-colors">
                  {basics.phoneSecondary}
                </p>
              </div>
            </a>

            <a
              href={basics.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-sky-500/20 bg-white/[0.02] hover:bg-sky-500/5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                <Linkedin className="w-5 h-5 text-sky-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/40 mb-0.5">LinkedIn</p>
                <p className="text-sm text-white/70 group-hover:text-white transition-colors flex items-center gap-1">
                  View Profile
                  <ExternalLink className="w-3 h-3" />
                </p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-white/40 mb-0.5">Location</p>
                <p className="text-sm text-white/70">{basics.location}</p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
