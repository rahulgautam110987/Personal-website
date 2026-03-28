"use client";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setDark(!dark)}
      className="relative p-2 rounded-full transition-colors"
      style={{
        backgroundColor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      }}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <Sun className="w-4 h-4 text-yellow-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600" />
      )}
    </motion.button>
  );
}
