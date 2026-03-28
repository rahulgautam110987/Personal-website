"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { WeatherCondition } from "@/hooks/useWeather";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  length?: number;
  drift?: number;
  wobble?: number;
}

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  phase: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface AnimatedBackgroundProps {
  condition?: WeatherCondition | null;
  isDay?: boolean;
}

export default function AnimatedBackground({
  condition,
  isDay = true,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const blobsRef = useRef<Blob[]>([]);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const flashRef = useRef<number>(0);
  const prefersReduced = useReducedMotion();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const effectiveCondition = condition || (isDark ? "clear" : "clear");
  const effectiveIsDay = condition ? isDay : !isDark;

  const initParticles = useCallback(
    (w: number, h: number, type: string) => {
      const isMobile = w < 768;
      let count: number;
      const particles: Particle[] = [];

      switch (type) {
        case "rain":
        case "thunderstorm":
          count = isMobile ? 60 : 140;
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              vx: -0.5 + Math.random() * -1,
              vy: 4 + Math.random() * 5,
              radius: 1,
              opacity: 0.15 + Math.random() * 0.25,
              length: 12 + Math.random() * 18,
            });
          }
          break;

        case "snow":
          count = isMobile ? 40 : 80;
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              vx: (Math.random() - 0.5) * 0.4,
              vy: 0.4 + Math.random() * 1.2,
              radius: 1.5 + Math.random() * 3,
              opacity: 0.2 + Math.random() * 0.35,
              drift: Math.random() * Math.PI * 2,
              wobble: 0.3 + Math.random() * 0.6,
            });
          }
          break;

        default:
          count = isMobile ? 30 : 60;
          for (let i = 0; i < count; i++) {
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              radius: Math.random() * 1.5 + 0.5,
              opacity: Math.random() * 0.4 + 0.1,
            });
          }
      }

      particlesRef.current = particles;
    },
    []
  );

  const initStars = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const count = isMobile ? 80 : 180;
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      const isBright = Math.random() < 0.15;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: isBright ? 1.2 + Math.random() * 1.0 : 0.4 + Math.random() * 0.8,
        baseOpacity: isBright ? 0.6 + Math.random() * 0.4 : 0.15 + Math.random() * 0.35,
        twinkleSpeed: 0.3 + Math.random() * 1.5,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, []);

  const initBlobs = useCallback((w: number, h: number, type: string) => {
    const isMobile = w < 768;
    const blobs: Blob[] = [];

    let hues: number[];
    let count: number;
    let baseRadius: number;

    switch (type) {
      case "clear":
        hues = [35, 45, 25, 55, 40];
        count = isMobile ? 3 : 5;
        baseRadius = isMobile ? 150 : 250;
        break;
      case "clouds":
        hues = [210, 220, 200, 215, 225];
        count = isMobile ? 4 : 7;
        baseRadius = isMobile ? 180 : 300;
        break;
      case "mist":
        hues = [200, 210, 195, 205, 215];
        count = isMobile ? 3 : 6;
        baseRadius = isMobile ? 200 : 350;
        break;
      default:
        hues = [210, 240, 190, 260, 200];
        count = isMobile ? 3 : 5;
        baseRadius = isMobile ? 150 : 250;
    }

    for (let i = 0; i < count; i++) {
      blobs.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        radius: baseRadius + Math.random() * 150,
        hue: hues[i % hues.length],
        phase: Math.random() * Math.PI * 2,
      });
    }

    blobsRef.current = blobs;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(window.innerWidth, window.innerHeight, effectiveCondition);
      initBlobs(window.innerWidth, window.innerHeight, effectiveCondition);
      if (starsRef.current.length === 0) {
        initStars(window.innerWidth, window.innerHeight);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (prefersReduced) {
      drawStaticFallback(ctx, window.innerWidth, window.innerHeight, isDark);
      return () => window.removeEventListener("resize", resize);
    }

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      timeRef.current += 0.005;
      ctx.clearRect(0, 0, w, h);

      if (isDark && !condition) {
        drawDarkDefault(ctx, w, h, particlesRef.current, starsRef.current, timeRef.current);
      } else {
        switch (effectiveCondition) {
          case "clear":
            if (effectiveIsDay) {
              drawClearDay(ctx, w, h, blobsRef.current, timeRef.current);
            } else {
              drawDarkDefault(ctx, w, h, particlesRef.current, starsRef.current, timeRef.current);
            }
            break;
          case "clouds":
            drawClouds(ctx, w, h, blobsRef.current, timeRef.current, effectiveIsDay);
            break;
          case "rain":
            drawRain(ctx, w, h, particlesRef.current, timeRef.current, effectiveIsDay);
            break;
          case "thunderstorm":
            drawThunderstorm(ctx, w, h, particlesRef.current, timeRef.current, effectiveIsDay, flashRef);
            break;
          case "snow":
            drawSnow(ctx, w, h, particlesRef.current, timeRef.current, effectiveIsDay);
            break;
          case "mist":
            drawMist(ctx, w, h, blobsRef.current, timeRef.current, effectiveIsDay);
            break;
          default:
            if (effectiveIsDay) {
              drawClearDay(ctx, w, h, blobsRef.current, timeRef.current);
            } else {
              drawDarkDefault(ctx, w, h, particlesRef.current, starsRef.current, timeRef.current);
            }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReduced, initParticles, initBlobs, initStars, isDark, effectiveCondition, effectiveIsDay, condition]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════
   DARK DEFAULT — particles + connecting lines (original)
   ═══════════════════════════════════════════════════════ */
function drawDarkDefault(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  particles: Particle[],
  stars: Star[],
  time: number
) {
  const g1 = ctx.createRadialGradient(w * 0.2, h * 0.3, 0, w * 0.2, h * 0.3, w * 0.5);
  g1.addColorStop(0, "rgba(59, 130, 246, 0.04)");
  g1.addColorStop(1, "transparent");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, w, h);

  const g2 = ctx.createRadialGradient(w * 0.8, h * 0.7, 0, w * 0.8, h * 0.7, w * 0.5);
  g2.addColorStop(0, "rgba(139, 92, 246, 0.03)");
  g2.addColorStop(1, "transparent");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, w, h);

  for (const s of stars) {
    const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
    const opacity = s.baseOpacity * (0.4 + twinkle * 0.6);

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 230, 255, ${opacity})`;
    ctx.fill();

    if (s.radius > 1.2) {
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 4);
      glow.addColorStop(0, `rgba(180, 200, 255, ${opacity * 0.15})`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(s.x - s.radius * 4, s.y - s.radius * 4, s.radius * 8, s.radius * 8);
    }
  }

  const CONN = 120;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONN) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / CONN) * 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

/* ═══════════════════════════════════════════════════════
   CLEAR DAY — warm golden blobs + soft light rays
   ═══════════════════════════════════════════════════════ */
function drawClearDay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  blobs: Blob[],
  time: number
) {
  const sunGlow = ctx.createRadialGradient(w * 0.8, h * 0.1, 0, w * 0.8, h * 0.1, w * 0.4);
  sunGlow.addColorStop(0, "rgba(251, 191, 36, 0.08)");
  sunGlow.addColorStop(0.5, "rgba(251, 146, 60, 0.04)");
  sunGlow.addColorStop(1, "transparent");
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, w, h);

  for (const b of blobs) {
    b.x += b.vx;
    b.y += b.vy;
    if (b.x - b.radius > w) b.x = -b.radius;
    if (b.x + b.radius < 0) b.x = w + b.radius;
    if (b.y - b.radius > h) b.y = -b.radius;
    if (b.y + b.radius < 0) b.y = h + b.radius;

    const breathe = 1 + Math.sin(time * 2 + b.phase) * 0.15;
    const r = b.radius * breathe;
    const alpha = 0.05 + Math.sin(time + b.phase) * 0.02;

    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    grad.addColorStop(0, `hsla(${b.hue}, 80%, 65%, ${alpha})`);
    grad.addColorStop(0.5, `hsla(${b.hue}, 70%, 70%, ${alpha * 0.4})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(b.x - r, b.y - r, r * 2, r * 2);
  }
}

/* ═══════════════════════════════════════════════════════
   CLOUDS — drifting grey/silver blobs
   ═══════════════════════════════════════════════════════ */
function drawClouds(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  blobs: Blob[],
  time: number,
  isDay: boolean
) {
  const baseSat = isDay ? 15 : 25;
  const baseLight = isDay ? 80 : 45;
  const baseAlpha = isDay ? 0.1 : 0.1;

  for (const b of blobs) {
    b.x += b.vx * 1.5;
    b.y += b.vy * 0.3;
    if (b.x - b.radius > w) b.x = -b.radius;
    if (b.x + b.radius < 0) b.x = w + b.radius;
    if (b.y - b.radius > h) b.y = -b.radius * 0.5;
    if (b.y + b.radius < 0) b.y = h + b.radius * 0.5;

    const breathe = 1 + Math.sin(time * 1.5 + b.phase) * 0.1;
    const r = b.radius * breathe;
    const alpha = baseAlpha + Math.sin(time * 0.8 + b.phase) * 0.03;

    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    grad.addColorStop(0, `hsla(${b.hue}, ${baseSat}%, ${baseLight}%, ${alpha})`);
    grad.addColorStop(0.6, `hsla(${b.hue}, ${baseSat}%, ${baseLight + 5}%, ${alpha * 0.3})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(b.x - r, b.y - r, r * 2, r * 2);
  }
}

/* ═══════════════════════════════════════════════════════
   RAIN — falling streaks + moody wash
   Visible but not distracting from resume content
   ═══════════════════════════════════════════════════════ */
function drawRain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  particles: Particle[],
  time: number,
  isDay: boolean
) {
  const wash = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, w * 0.7);
  if (isDay) {
    wash.addColorStop(0, "rgba(80, 110, 170, 0.07)");
    wash.addColorStop(1, "transparent");
  } else {
    wash.addColorStop(0, "rgba(50, 80, 150, 0.10)");
    wash.addColorStop(1, "transparent");
  }
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);

  void time;

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y > h) {
      p.y = -20;
      p.x = Math.random() * w;
    }
    if (p.x < 0) p.x = w;

    const len = p.length || 15;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.vx * 2, p.y + len);

    if (isDay) {
      ctx.strokeStyle = `rgba(80, 120, 180, ${p.opacity})`;
    } else {
      ctx.strokeStyle = `rgba(140, 180, 255, ${p.opacity})`;
    }
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/* ═══════════════════════════════════════════════════════
   THUNDERSTORM — rain + periodic flash
   ═══════════════════════════════════════════════════════ */
function drawThunderstorm(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  particles: Particle[],
  time: number,
  isDay: boolean,
  flashRef: React.MutableRefObject<number>
) {
  drawRain(ctx, w, h, particles, time, isDay);

  if (Math.random() < 0.004) {
    flashRef.current = 1.0;
  }

  if (flashRef.current > 0) {
    ctx.fillStyle = `rgba(200, 215, 255, ${flashRef.current * 0.12})`;
    ctx.fillRect(0, 0, w, h);
    flashRef.current *= 0.85;
    if (flashRef.current < 0.01) flashRef.current = 0;
  }
}

/* ═══════════════════════════════════════════════════════
   SNOW — gentle falling flakes with horizontal drift
   Clearly visible but soft enough to keep text readable
   ═══════════════════════════════════════════════════════ */
function drawSnow(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  particles: Particle[],
  time: number,
  isDay: boolean
) {
  const wash = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.7);
  if (isDay) {
    wash.addColorStop(0, "rgba(170, 190, 220, 0.06)");
    wash.addColorStop(1, "transparent");
  } else {
    wash.addColorStop(0, "rgba(80, 110, 170, 0.08)");
    wash.addColorStop(1, "transparent");
  }
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, w, h);

  for (const p of particles) {
    const horizontalDrift = Math.sin(time * 2.5 + (p.drift || 0)) * (p.wobble || 0.4);
    p.x += p.vx + horizontalDrift;
    p.y += p.vy;

    if (p.y > h) {
      p.y = -5;
      p.x = Math.random() * w;
    }
    if (p.x > w) p.x = 0;
    if (p.x < 0) p.x = w;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    if (isDay) {
      ctx.fillStyle = `rgba(90, 115, 160, ${p.opacity})`;
    } else {
      ctx.fillStyle = `rgba(200, 215, 245, ${p.opacity})`;
    }
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════════
   MIST / FOG — layered horizontal haze bands
   ═══════════════════════════════════════════════════════ */
function drawMist(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  blobs: Blob[],
  time: number,
  isDay: boolean
) {
  const baseSat = isDay ? 10 : 15;
  const baseLight = isDay ? 82 : 35;
  const baseAlpha = isDay ? 0.08 : 0.07;

  for (let i = 0; i < 4; i++) {
    const y = (h * (i + 1)) / 5 + Math.sin(time * 0.5 + i) * 30;
    const grad = ctx.createLinearGradient(0, y - 80, 0, y + 80);
    const a = baseAlpha * (0.5 + Math.sin(time * 0.3 + i * 1.5) * 0.3);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.5, `hsla(210, ${baseSat}%, ${baseLight}%, ${a})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, y - 80, w, 160);
  }

  for (const b of blobs) {
    b.x += b.vx * 2;
    b.y += Math.sin(time + b.phase) * 0.2;
    if (b.x - b.radius > w) b.x = -b.radius;
    if (b.x + b.radius < 0) b.x = w + b.radius;

    const r = b.radius * (1 + Math.sin(time * 1.2 + b.phase) * 0.08);
    const alpha = baseAlpha * 0.7;
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    grad.addColorStop(0, `hsla(${b.hue}, ${baseSat}%, ${baseLight}%, ${alpha})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(b.x - r, b.y - r, r * 2, r * 2);
  }
}

/* ═══════════════════════════════════════════════════════
   STATIC FALLBACK (prefers-reduced-motion)
   ═══════════════════════════════════════════════════════ */
function drawStaticFallback(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dark: boolean
) {
  if (dark) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "rgba(59, 130, 246, 0.03)");
    g.addColorStop(0.5, "rgba(139, 92, 246, 0.02)");
    g.addColorStop(1, "rgba(6, 182, 212, 0.02)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  } else {
    const g1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.4);
    g1.addColorStop(0, "hsla(210, 70%, 70%, 0.08)");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);
  }
}
