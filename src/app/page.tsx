"use client";
import { useState, useCallback, useEffect, useRef } from "react";
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
import { useWeather } from "@/hooks/useWeather";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const { weather, loading, fetchWeather, fetchWeatherByCity, clearWeather } = useWeather();
  const savedThemeRef = useRef<boolean>(true);
  const weatherWasActive = useRef(false);

  useEffect(() => {
    if (weather) {
      if (!weatherWasActive.current) {
        savedThemeRef.current = document.documentElement.classList.contains("dark");
        weatherWasActive.current = true;
      }
      if (weather.isDay) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    } else {
      weatherWasActive.current = false;
    }
  }, [weather]);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  const handleEnableWeather = useCallback(
    (lat: number, lon: number) => {
      fetchWeather(lat, lon);
    },
    [fetchWeather]
  );

  const handleEnableWeatherByCity = useCallback(
    (city: string) => {
      fetchWeatherByCity(city);
    },
    [fetchWeatherByCity]
  );

  const handleDisableWeather = useCallback(() => {
    clearWeather();
    if (savedThemeRef.current) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [clearWeather]);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      <AnimatedBackground
        condition={weather?.condition ?? null}
        isDay={weather?.isDay ?? true}
      />
      <ScrollProgress />

      <div
        className="relative z-10"
        style={{
          opacity: splashDone ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
        }}
      >
        <Navbar
          weatherActive={!!weather}
          weatherCity={weather?.city ?? null}
          weatherLoading={loading}
          onEnableWeather={handleEnableWeather}
          onEnableWeatherByCity={handleEnableWeatherByCity}
          onDisableWeather={handleDisableWeather}
        />
        <main>
          <Hero
            city={weather?.city ?? null}
            country={weather?.country ?? null}
            condition={weather?.condition ?? null}
            temp={weather?.temp ?? null}
          />
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
