"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
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

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const blobsRef = useRef<Blob[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
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

  const initParticles = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const count = isMobile ? 30 : 60;
    const particles: Particle[] = [];
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
    particlesRef.current = particles;
  }, []);

  const initBlobs = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const count = isMobile ? 3 : 5;
    const blobs: Blob[] = [];
    const hues = [210, 240, 190, 260, 200];
    for (let i = 0; i < count; i++) {
      blobs.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: (isMobile ? 150 : 250) + Math.random() * 150,
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
      initParticles(window.innerWidth, window.innerHeight);
      initBlobs(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    if (prefersReduced) {
      if (isDark) {
        drawStaticDark(ctx, window.innerWidth, window.innerHeight);
      } else {
        drawStaticLight(ctx, window.innerWidth, window.innerHeight);
      }
      return () => window.removeEventListener("resize", resize);
    }

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      timeRef.current += 0.005;
      ctx.clearRect(0, 0, w, h);

      if (isDark) {
        drawDarkMode(ctx, w, h, particlesRef.current, timeRef.current);
      } else {
        drawLightMode(ctx, w, h, blobsRef.current, timeRef.current);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReduced, initParticles, initBlobs, isDark]);

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
   DARK MODE — particles + connecting lines + gradient mesh
   (original deep-space look)
   ═══════════════════════════════════════════════════════ */
function drawDarkMode(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  particles: Particle[],
  _time: number
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

  const g3 = ctx.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.1, w * 0.4);
  g3.addColorStop(0, "rgba(6, 182, 212, 0.025)");
  g3.addColorStop(1, "transparent");
  ctx.fillStyle = g3;
  ctx.fillRect(0, 0, w, h);

  const CONNECTION_DIST = 120;

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
      if (dist < CONNECTION_DIST) {
        const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

/* ═══════════════════════════════════════════════════════
   LIGHT MODE — soft drifting gradient blobs (clear sky)
   No particles, no dots, no stars.
   Just large, slow-moving color washes.
   ═══════════════════════════════════════════════════════ */
function drawLightMode(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  blobs: Blob[],
  time: number
) {
  for (const b of blobs) {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x - b.radius > w) b.x = -b.radius;
    if (b.x + b.radius < 0) b.x = w + b.radius;
    if (b.y - b.radius > h) b.y = -b.radius;
    if (b.y + b.radius < 0) b.y = h + b.radius;

    const breathe = 1 + Math.sin(time * 2 + b.phase) * 0.15;
    const r = b.radius * breathe;
    const alpha = 0.06 + Math.sin(time + b.phase) * 0.02;

    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
    grad.addColorStop(0, `hsla(${b.hue}, 70%, 70%, ${alpha})`);
    grad.addColorStop(0.5, `hsla(${b.hue}, 60%, 75%, ${alpha * 0.5})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(b.x - r, b.y - r, r * 2, r * 2);
  }
}

/* ═══════════════════════════════════════════════════════
   STATIC FALLBACKS (prefers-reduced-motion)
   ═══════════════════════════════════════════════════════ */
function drawStaticDark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "rgba(59, 130, 246, 0.03)");
  g.addColorStop(0.5, "rgba(139, 92, 246, 0.02)");
  g.addColorStop(1, "rgba(6, 182, 212, 0.02)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawStaticLight(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.4);
  g1.addColorStop(0, "hsla(210, 70%, 70%, 0.08)");
  g1.addColorStop(1, "transparent");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, w, h);

  const g2 = ctx.createRadialGradient(w * 0.7, h * 0.6, 0, w * 0.7, h * 0.6, w * 0.35);
  g2.addColorStop(0, "hsla(260, 60%, 75%, 0.06)");
  g2.addColorStop(1, "transparent");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, w, h);
}
