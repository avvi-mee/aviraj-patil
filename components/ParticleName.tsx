"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  accent: boolean;
  delay: number;
  sx: number; // scatter direction used while scrolling away
  sy: number;
};

const REPEL_RADIUS = 110;
const SPRING = 0.07;
const FRICTION = 0.82;
const HOLD_MS = 2200; // how long a fully formed word stays before morphing

// Words drawn as thousands of particles. They fly in, morph from word to word,
// scatter away from the cursor (or a finger), and blow apart as you scroll down.
export default function ParticleName({ words, ready }: { words: string[]; ready: boolean }) {
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
    let wordHomes: [number, number][][] = [];
    let wordIndex = 0;
    let frame = 0;
    let onScreen = true;
    let dot = 2;
    let lastTime = performance.now();
    let settledAt = 0;
    const pointer = { x: -9999, y: -9999 };

    // Point every particle at the current word; particles are matched left-to-right so the morph flows.
    const target = (i: number) => {
      const homes = wordHomes[i];
      if (!homes?.length) return;
      const n = parts.length;
      parts.forEach((p, k) => {
        const [hx, hy] = homes[Math.floor((k * homes.length) / n)];
        p.hx = hx;
        p.hy = hy;
      });
    };

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

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      const family = getComputedStyle(canvas).fontFamily;

      // One size for every word, so the morph keeps the same height: the widest word sets it.
      let size = H * 0.45; // the canvas is twice the word's slot, so the word gets the middle half
      o.font = `700 ${size}px ${family}`;
      const widest = Math.max(...words.map((w) => o.measureText(w).width));
      if (widest > W * 0.94) size *= (W * 0.94) / widest;

      const gap = W < 640 ? 3 : 5;
      dot = W < 640 ? 1.8 : 2.5;
      wordHomes = words.map((w) => {
        o.clearRect(0, 0, W, H);
        o.font = `700 ${size}px ${family}`;
        o.textAlign = "center";
        o.textBaseline = "middle";
        o.fillText(w, W / 2, H / 2);
        const data = o.getImageData(0, 0, W, H).data;
        const homes: [number, number][] = [];
        for (let x = 0; x < W; x += gap) {
          for (let y = 0; y < H; y += gap) {
            if (data[(y * W + x) * 4 + 3] > 140) homes.push([x, y]);
          }
        }
        return homes; // column by column, i.e. sorted left to right
      });

      const count = Math.max(...wordHomes.map((h) => h.length));
      const prev = parts;
      parts = Array.from({ length: count }, (_, k) => {
        const old = prev[k];
        const angle = Math.random() * Math.PI * 2;
        const reach = 0.45 + Math.random() * 0.9;
        return {
          hx: 0,
          hy: 0,
          x: old ? old.x : Math.random() * W,
          y: old ? old.y : Math.random() * H * 1.6 - H * 0.3,
          vx: 0,
          vy: 0,
          accent: Math.random() < 0.24,
          delay: (k / count) * 700 + Math.random() * 250, // sweep in from the left
          sx: Math.cos(angle) * reach,
          sy: Math.sin(angle) * reach - 0.6, // blow apart, drifting upward
        };
      });
      target(wordIndex);
      if (reduced) {
        parts.forEach((p) => {
          p.x = p.hx;
          p.y = p.hy;
        });
        draw(1);
      }
    };

    const draw = (alpha: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = alpha;
      for (const pass of [false, true]) {
        ctx.fillStyle = pass ? accent : ink;
        for (const p of parts) if (p.accent === pass) ctx.fillRect(p.x, p.y, dot, dot);
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      frame = requestAnimationFrame(step);
      const now = performance.now();
      // Physics runs on real time (in 60 fps "frames"), so slow devices settle as fast as quick ones.
      const dt = Math.min(3, (now - lastTime) / 16.67);
      lastTime = now;
      if (!onScreen) return;
      const live = readyRef.current;
      const t = now - startRef.current;
      // 0 at the top of the page, 1 once the hero is mostly scrolled past.
      const s = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.6)));
      const spread = Math.max(W, H) * 0.75 * s * s;
      const damp = Math.pow(FRICTION, dt);
      let error = 0;

      for (const p of parts) {
        if (live && t > p.delay) {
          p.vx += (p.hx + p.sx * spread - p.x) * SPRING * dt;
          p.vy += (p.hy + p.sy * spread - p.y) * SPRING * dt;
        } else {
          p.vx += (Math.random() - 0.5) * 0.08 * dt;
          p.vy += (Math.random() - 0.5) * 0.08 * dt;
        }
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / REPEL_RADIUS) * 7 * dt;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        error += Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y);
      }

      // Morph only once the current word has fully formed and stayed readable for HOLD_MS,
      // and only while the hero sits at the top of the page.
      const settled = live && t > 1500 && s < 0.05 && error / (parts.length || 1) < 1.2;
      if (!settled) settledAt = 0;
      else if (!settledAt) settledAt = now;
      else if (now - settledAt > HOLD_MS) {
        settledAt = 0;
        wordIndex = (wordIndex + 1) % words.length;
        target(wordIndex);
        for (const p of parts) {
          p.vx += (Math.random() - 0.5) * 2.5;
          p.vy += (Math.random() - 0.5) * 2.5;
        }
      }
      draw(live ? 1 - s * 0.95 : 0.18);
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
      // No motion: the first word is drawn once, already formed (redrawn on resize by build()).
      return () => ro.disconnect();
    }

    // Pause the animation while the hero is scrolled out of view.
    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    io.observe(canvas);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [words]);

  // The slot keeps the layout height; the canvas spills over it above and below so scattering dots aren't cut off.
  return (
    <div className="relative h-[clamp(8rem,27vw,21rem)] w-full">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-1/2 h-[200%] w-full select-none font-sans"
      />
    </div>
  );
}
