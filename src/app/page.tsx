"use client";
import { useState, useCallback } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import SplashScreen from "@/components/SplashScreen";
import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Visas from "@/components/Visas";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <AnimatedBackground />
      <ScrollProgress />

      <div
        className="relative z-10"
        style={{
          opacity: splashDone ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <Experience />
          <Achievements />
          <Skills />
          <Education />
          <Certifications />
          <Visas />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
