"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; hx: number; hy: number; vx: number; vy: number; accent: boolean; delay: number };

const REPEL_RADIUS = 110;
const SPRING = 0.055;
const FRICTION = 0.84;

// The name drawn as thousands of particles. They fly in to form the letters,
// scatter away from the cursor (or a finger) and spring back.
export default function ParticleName({ text, ready }: { text: string; ready: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(ready);
  const startRef = useRef(0);

  useEffect(() => {
    readyRef.current = ready;
    if (ready) startRef.current = performance.now();
  }, [ready]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--accent").trim() || "#f26419";
    const ink = css.getPropertyValue("--ink").trim() || "#ecede9";

    let W = 0;
    let H = 0;
    let parts: Particle[] = [];
    let frame = 0;
    let onScreen = true;
    let dot = 2;
    const pointer = { x: -9999, y: -9999 };

    const build = async () => {
      await document.fonts.ready;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.round(rect.width);
      H = Math.round(rect.height);
      if (!W || !H) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw the word off-screen, then put a particle on every few filled pixels.
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      const family = getComputedStyle(canvas).fontFamily;
      let size = H * 0.95;
      o.font = `700 ${size}px ${family}`;
      const measured = o.measureText(text).width;
      if (measured > W * 0.94) {
        size *= (W * 0.94) / measured;
        o.font = `700 ${size}px ${family}`;
      }
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText(text, W / 2, H / 2);
      const data = o.getImageData(0, 0, W, H).data;

      const gap = W < 640 ? 3 : 4;
      dot = W < 640 ? 1.7 : 2.1;
      const homes: [number, number][] = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if (data[(y * W + x) * 4 + 3] > 140) homes.push([x, y]);
        }
      }

      const prev = parts;
      parts = homes.map(([hx, hy], i) => {
        const old = prev[i];
        return {
          hx,
          hy,
          x: old ? old.x : reduced ? hx : Math.random() * W,
          y: old ? old.y : reduced ? hy : Math.random() * H * 1.6 - H * 0.3,
          vx: 0,
          vy: 0,
          accent: Math.random() < 0.24,
          delay: (hx / W) * 700 + Math.random() * 250, // sweep in from the left
        };
      });
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const live = reduced || readyRef.current;
      ctx.globalAlpha = live ? 1 : 0.18;
      for (const pass of [false, true]) {
        ctx.fillStyle = pass ? accent : ink;
        for (const p of parts) if (p.accent === pass) ctx.fillRect(p.x, p.y, dot, dot);
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      frame = requestAnimationFrame(step);
      if (!onScreen) return;
      const live = readyRef.current;
      const t = performance.now() - startRef.current;
      for (const p of parts) {
        if (live && t > p.delay) {
          p.vx += (p.hx - p.x) * SPRING;
          p.vy += (p.hy - p.y) * SPRING;
        } else {
          // Before the intro ends: a slow, faint drift.
          p.vx += (Math.random() - 0.5) * 0.08;
          p.vy += (Math.random() - 0.5) * 0.08;
        }
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / REPEL_RADIUS) * 7;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;
      }
      draw();
    };

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const leave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    build();
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    });
    ro.observe(canvas);

    if (reduced) {
      // No motion: the word is drawn once, already formed (redrawn on resize by build()).
      return () => ro.disconnect();
    }

    // Pause the animation while the hero is scrolled out of view.
    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    io.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointercancel", leave);
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointercancel", leave);
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="block h-[clamp(8rem,27vw,21rem)] w-full touch-pan-y select-none font-sans"
    />
  );
}
