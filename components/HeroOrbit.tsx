"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/lib/projects";
import { GithubIcon } from "./Icons";

// The dot word in the middle (add more words here and it morphs between them).
const WORDS = ["Portfolio"];
// How flat the rings look (1 = seen from straight above). Phones get rounder rings to fill the taller screen.
const tiltFor = (w: number) => (w < 560 ? 0.66 : 0.38);
const heightFor = (w: number) => w * (w < 560 ? 0.88 : 0.56);
const RINGS = [0.2, 0.31, 0.43]; // ring radius as a share of the orbit's width
const RING_SPEED = [0.38, 0.26, -0.17]; // radians per second; dots and planets on a ring move together

// Where each project orbits: ring and starting angle.
const ORBITS: Record<string, { ring: number; phase: number }> = {
  sukyoo: { ring: 0, phase: 0.6 },
  katori: { ring: 1, phase: 1.9 },
  "interior-studio-os": { ring: 1, phase: 1.9 + Math.PI },
  "vasp-trace": { ring: 2, phase: 0.2 },
  "peer-review-arena": { ring: 2, phase: 0.2 + Math.PI },
  github: { ring: 0, phase: 0.6 + Math.PI },
};

// Everything that orbits: the five projects, plus one planet that sends people to GitHub for the rest.
type Planet = { key: string; name: string; context: string; line: string; href: string; external: boolean; cta: string; kind: Project["artifact"] | "github" };
const PLANETS: Planet[] = [
  ...projects.map((p) => ({
    key: p.slug,
    name: p.name,
    context: p.context,
    line: p.line,
    href: `/work/${p.slug}`,
    external: false,
    cta: "Click to open the project",
    kind: p.artifact,
  })),
  {
    key: "github",
    name: "More on GitHub",
    context: "20+ more projects",
    line: "Want to see more? A Hindi cartoon studio, a podcast-to-Shorts tool and plenty more are on my GitHub.",
    href: "https://github.com/avvi-mee",
    external: true,
    cta: "Click to open my GitHub",
    kind: "github",
  },
];

const SPRING = 0.07;
const FRICTION = 0.82;
const REPEL_RADIUS = 100;
const HOLD_MS = 2200; // how long a fully formed word stays before morphing

type Dot = { x: number; y: number; hx: number; hy: number; vx: number; vy: number; accent: boolean; delay: number; sx: number; sy: number };

// Small line icons, one per project.
function PlanetIcon({ kind }: { kind: Planet["kind"] }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const a = "var(--accent)";
  switch (kind) {
    case "github":
      return <GithubIcon className="h-[46%] w-[46%]" />;
    case "katori":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" aria-hidden>
          <path d="M7 12h10" {...s} />
          <rect x="3.5" y="8" width="3" height="8" rx="1" fill={a} />
          <rect x="17.5" y="8" width="3" height="8" rx="1" fill={a} />
          <path d="M2 10.5v3M22 10.5v3" {...s} />
        </svg>
      );
    case "vasp":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" aria-hidden>
          <path d="M5 18l5-6 4 3 5-9" {...s} />
          <circle cx="5" cy="18" r="2.2" fill={a} />
          <circle cx="10" cy="12" r="1.6" {...s} />
          <circle cx="14" cy="15" r="1.6" {...s} />
          <rect x="17" y="3.5" width="4.5" height="4.5" rx="1.2" fill="currentColor" />
        </svg>
      );
    case "sukyoo":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" aria-hidden>
          <rect x="6" y="2.5" width="12" height="19" rx="3" {...s} />
          <rect x="8.5" y="15" width="7" height="3.5" rx="1.2" fill={a} />
          <path d="M9 7h2M13 7h2M9 10.5h2M13 10.5h2" {...s} />
        </svg>
      );
    case "arena":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" aria-hidden>
          <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" {...s} />
          <path d="M13.5 5l-3 14" stroke={a} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "interior":
      return (
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" aria-hidden>
          <path d="M8 3.5H20.5V20.5H3.5V3.5H5M12 3.5v8M3.5 13H9M12 15v5.5" {...s} />
          <rect x="14.5" y="6" width="4" height="4" rx="1" fill={a} />
        </svg>
      );
  }
}

// Everything in dots: a particle word in the middle that morphs (Aviraj, AI Tools, Apps), rings of
// flowing dots around it, and the five projects orbiting as glass planets you can hover and click.
// It launches when the intro ends and blows apart as you scroll away.
export default function HeroOrbit({ ready }: { ready: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planetRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tipRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(ready);
  const readyAt = useRef(0);
  const hoveredRef = useRef<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    readyRef.current = ready;
    if (ready) readyAt.current = performance.now();
  }, [ready]);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!box || !canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--accent").trim() || "#ff7a2f";
    const ink = css.getPropertyValue("--ink").trim() || "#f2f2ef";

    let W = 0; // orbit box width
    let H = 0; // orbit box height
    let CH = 0; // canvas height: the box plus 25% above and below, so scattering dots aren't cut off
    let dots: Dot[] = [];
    let wordHomes: [number, number][][] = [];
    let ringDots: number[][] = []; // per ring: the base angle of each dot
    let wordIndex = 0;
    let settledAt = 0;
    let dot = 2;
    let frame = 0;
    let last = performance.now();
    let clock = 0;
    let speed = 1;
    let touchHold = 0;
    let onScreen = true;
    const pointer = { x: -9999, y: -9999 };

    const target = (i: number) => {
      const homes = wordHomes[i];
      if (!homes?.length) return;
      dots.forEach((d, k) => {
        const [hx, hy] = homes[Math.floor((k * homes.length) / dots.length)];
        d.hx = hx;
        d.hy = hy;
      });
    };

    const build = async () => {
      await document.fonts.ready;
      W = box.clientWidth;
      H = heightFor(W);
      CH = H * 1.5;
      if (!W) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr;
      canvas.height = CH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Sample each word into dot positions (same size for all, set by the widest word).
      const off = document.createElement("canvas");
      off.width = Math.ceil(W);
      off.height = Math.ceil(CH);
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      const family = getComputedStyle(canvas).fontFamily;
      let size = H * 0.34;
      o.font = `700 ${size}px ${family}`;
      const widest = Math.max(...WORDS.map((w) => o.measureText(w).width));
      if (widest > W * 0.58) size *= (W * 0.58) / widest;
      const gap = W < 560 ? 3 : 4;
      dot = W < 560 ? 1.7 : 2.2;
      wordHomes = WORDS.map((w) => {
        o.clearRect(0, 0, off.width, off.height);
        o.font = `700 ${size}px ${family}`;
        o.textAlign = "center";
        o.textBaseline = "middle";
        o.fillText(w, W / 2, CH / 2);
        const data = o.getImageData(0, 0, off.width, off.height).data;
        const homes: [number, number][] = [];
        for (let x = 0; x < off.width; x += gap) {
          for (let y = 0; y < off.height; y += gap) {
            if (data[(y * off.width + x) * 4 + 3] > 140) homes.push([x, y]);
          }
        }
        return homes;
      });

      const count = Math.max(...wordHomes.map((h) => h.length));
      const prev = dots;
      dots = Array.from({ length: count }, (_, k) => {
        const old = prev[k];
        const angle = Math.random() * Math.PI * 2;
        const reach = 0.45 + Math.random() * 0.9;
        return {
          hx: 0,
          hy: 0,
          x: old ? old.x : W / 2 + (Math.random() - 0.5) * 40,
          y: old ? old.y : CH / 2 + (Math.random() - 0.5) * 40,
          vx: 0,
          vy: 0,
          accent: Math.random() < 0.24,
          delay: 300 + (k / count) * 600 + Math.random() * 200,
          sx: Math.cos(angle) * reach,
          sy: Math.sin(angle) * reach - 0.6,
        };
      });
      target(wordIndex);

      // Rings: dots spaced evenly along each ellipse.
      const tilt = tiltFor(W);
      const spacing = W < 560 ? 6 : 7;
      ringDots = RINGS.map((r) => {
        const R = r * W;
        const perimeter = 2 * Math.PI * Math.sqrt((R * R + (R * tilt) ** 2) / 2);
        const n = Math.floor(perimeter / spacing);
        return Array.from({ length: n }, (_, i) => (i / n) * Math.PI * 2);
      });

      if (reduced) {
        dots.forEach((d) => {
          d.x = d.hx;
          d.y = d.hy;
        });
        render(performance.now(), 0);
      }
    };

    const drawRing = (front: boolean, s: number, launch: number) => {
      const cx = W / 2;
      const cy = CH / 2;
      const tilt = tiltFor(W);
      ringDots.forEach((angles, r) => {
        const R = RINGS[r] * W * (1 + s * 0.9);
        const shown = Math.floor(angles.length * launch);
        for (let i = 0; i < shown; i++) {
          const a = angles[i] + RING_SPEED[r] * clock;
          const sin = Math.sin(a);
          if (sin > 0 !== front) continue;
          const depth = (sin + 1) / 2;
          ctx.globalAlpha = (front ? 0.22 + 0.5 * depth : 0.08 + 0.18 * depth) * (1 - s);
          ctx.fillStyle = i % 9 === 0 ? accent : ink;
          ctx.fillRect(cx + R * Math.cos(a), cy + R * sin * tilt, 1.6, 1.6);
        }
      });
      ctx.globalAlpha = 1;
    };

    // Draw one frame and place the planets.
    const render = (now: number, dt: number) => {
      const live = reduced || readyRef.current;
      const sinceReady = reduced ? 9999 : now - readyAt.current;
      const s = reduced ? 0 : Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.6)));
      const k = live ? Math.min(1, Math.max(0, (sinceReady - 150) / 1400)) : 0;
      const launch = 1 - Math.pow(1 - k, 3);

      // Word dots: spring to their letter, get pushed by the pointer, blow apart on scroll.
      const spread = Math.max(W, CH) * 0.75 * s * s;
      const damp = Math.pow(FRICTION, dt);
      let error = 0;
      if (!reduced) {
        for (const d of dots) {
          if (live && sinceReady > d.delay) {
            d.vx += (d.hx + d.sx * spread - d.x) * SPRING * dt;
            d.vy += (d.hy + d.sy * spread - d.y) * SPRING * dt;
          }
          const px = d.x - pointer.x;
          const py = d.y - pointer.y;
          const p2 = px * px + py * py;
          // While a planet is hovered the word stays still, so the card reads cleanly over it.
          if (hoveredRef.current === null && p2 < REPEL_RADIUS * REPEL_RADIUS) {
            const dist = Math.sqrt(p2) || 1;
            const force = (1 - dist / REPEL_RADIUS) * 7 * dt;
            d.vx += (px / dist) * force;
            d.vy += (py / dist) * force;
          }
          d.vx *= damp;
          d.vy *= damp;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          error += Math.abs(d.hx - d.x) + Math.abs(d.hy - d.y);
        }
        // Morph once the word has fully formed and stayed readable for a moment.
        const settled = WORDS.length > 1 && live && sinceReady > 1500 && s < 0.05 && error / (dots.length || 1) < 1.2;
        if (!settled) settledAt = 0;
        else if (!settledAt) settledAt = now;
        else if (now - settledAt > HOLD_MS) {
          settledAt = 0;
          wordIndex = (wordIndex + 1) % WORDS.length;
          target(wordIndex);
          for (const d of dots) {
            d.vx += (Math.random() - 0.5) * 2.5;
            d.vy += (Math.random() - 0.5) * 2.5;
          }
        }
      }

      ctx.clearRect(0, 0, W, CH);
      drawRing(false, s, launch); // back half of the rings, behind the word
      ctx.globalAlpha = live ? 1 - s * 0.95 : 0;
      for (const pass of [false, true]) {
        ctx.fillStyle = pass ? accent : ink;
        for (const d of dots) if (d.accent === pass) ctx.fillRect(d.x, d.y, dot, dot);
      }
      ctx.globalAlpha = 1;
      drawRing(true, s, launch); // front half, over the word

      // Planets ride the rings: bigger and on top in front, smaller and behind the word at the back.
      const cx = W / 2;
      const cy = H / 2;
      const tilt = tiltFor(W);
      const size = Math.max(44, Math.min(74, W * 0.09));
      PLANETS.forEach((p, i) => {
        const el = planetRefs.current[i];
        const label = labelRefs.current[i];
        const o = ORBITS[p.key];
        if (!el || !o) return;
        const pk = live ? Math.min(1, Math.max(0, (sinceReady - 500 - i * 140) / 1100)) : 0;
        const pl = 1 - Math.pow(1 - pk, 3);
        const R = RINGS[o.ring] * W * pl * (1 + s * 0.9);
        const a = o.phase + RING_SPEED[o.ring] * clock;
        const depth = (Math.sin(a) + 1) / 2;
        const isHover = hoveredRef.current === p.key;
        const scale = (0.7 + 0.42 * depth) * (isHover ? 1.25 : 1) * (0.4 + 0.6 * pl);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = `translate3d(${cx + R * Math.cos(a) - size / 2}px, ${cy + R * Math.sin(a) * tilt - size / 2}px, 0) scale(${scale})`;
        el.style.zIndex = isHover ? "40" : depth > 0.5 ? "30" : "5";
        el.style.opacity = String((0.45 + 0.55 * depth) * (pl > 0 ? 1 : 0) * (1 - s * 0.9));
        if (label) label.style.opacity = isHover || depth > 0.62 ? "1" : "0";
        const tip = tipRef.current;
        if (isHover && tip) {
          const px = cx + R * Math.cos(a);
          const py = cy + R * Math.sin(a) * tilt;
          const gapX = (size * scale) / 2 + 14;
          const tw = tip.offsetWidth;
          const th = tip.offsetHeight;
          // Card goes on the side with more room, vertically centred on the planet, kept inside the orbit box.
          let tx = px < cx ? px + gapX : px - gapX - tw;
          tx = Math.min(Math.max(tx, 0), W - tw);
          const ty = Math.min(Math.max(py - th / 2, 0), H - th);
          tip.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        }
      });
    };

    const step = () => {
      frame = requestAnimationFrame(step);
      const now = performance.now();
      const dt = Math.min(3, (now - last) / 16.67); // in 60 fps frames, so slow devices move at the same speed
      last = now;
      if (!onScreen) return;
      const s = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.6)));
      const paused = hoveredRef.current !== null || now < touchHold;
      const goal = paused ? 0 : 1 + s * 5; // spins faster as you scroll away
      speed += (goal - speed) * Math.min(1, dt * 0.07);
      clock += (dt / 60) * speed;
      render(now, dt);
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
    // Touching the orbit on a phone pauses it for a moment so a planet is easy to tap.
    const onTouch = () => (touchHold = performance.now() + 2500);

    build();
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    });
    ro.observe(box);
    box.addEventListener("pointerdown", onTouch);

    if (reduced) {
      const onReady = () => render(performance.now(), 0);
      window.addEventListener("intro:done", onReady);
      return () => {
        ro.disconnect();
        box.removeEventListener("pointerdown", onTouch);
        window.removeEventListener("intro:done", onReady);
      };
    }

    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    io.observe(box);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      box.removeEventListener("pointerdown", onTouch);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, []);

  return (
    <div ref={boxRef} className="relative mx-auto aspect-[1/0.88] w-full max-w-[min(92vw,860px,120svh)] min-[560px]:aspect-[1/0.56]">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-1/4 z-10 h-[150%] w-full select-none font-sans"
      />

      {PLANETS.map((p, i) => {
        const props = {
          ref: (el: HTMLAnchorElement | null) => {
            planetRefs.current[i] = el;
          },
          "aria-label": `${p.name}: ${p.line}`,
          onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setHovered(p.key),
          onPointerLeave: () => setHovered(null),
          onFocus: () => setHovered(p.key),
          onBlur: () => setHovered(null),
          // The GitHub planet gets an orange edge so it reads as "something different"
          style: p.external ? { borderColor: "rgb(255 122 47 / 0.65)" } : undefined,
          className: `glass absolute left-0 top-0 flex items-center justify-center rounded-full text-ink opacity-0 transition-[box-shadow] duration-300 will-change-transform ${
            hovered === p.key ? "shadow-[0_0_0_2px_var(--accent),0_0_40px_rgb(255_122_47/0.45)]" : ""
          }`,
        };
        const inner = (
          <>
            <PlanetIcon kind={p.kind} />
            <span
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-300"
            >
              <span
                className={`inline-flex rounded-full border bg-[#282725] px-2.5 py-0.5 text-[0.7rem] font-semibold sm:text-[0.75rem] ${
                  hovered === p.key || p.external ? "border-accent text-ink" : "border-[var(--glass-border)] text-graphite"
                }`}
              >
                {p.name}
              </span>
            </span>
          </>
        );
        return p.external ? (
          <a key={p.key} href={p.href} target="_blank" rel="noreferrer" {...props}>
            {inner}
          </a>
        ) : (
          <Link key={p.key} href={p.href} {...props}>
            {inner}
          </Link>
        );
      })}

      {/* Hover card: opaque so the text behind never shows through; placed beside the hovered planet */}
      <div
        ref={tipRef}
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 z-50 w-[15rem] rounded-2xl border border-[var(--glass-border)] bg-[#282725]/95 p-4 text-left shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl transition-opacity duration-200 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        {(() => {
          const p = PLANETS.find((x) => x.key === hovered);
          if (!p) return null;
          return (
            <>
              <p className="text-[0.75rem] text-graphite">{p.context}</p>
              <p className="mt-1 text-[1rem] font-semibold tracking-tight">{p.name}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-snug text-[#d6d7d2]">{p.line}</p>
              <p className="mt-3 text-[0.8125rem] font-semibold text-accent-ink">{p.cta}</p>
            </>
          );
        })()}
      </div>
    </div>
  );
}
