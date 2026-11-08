"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { projects, type Project } from "@/lib/projects";

const ease = [0.22, 1, 0.36, 1] as const;
// How flat the rings look (1 = seen from straight above). Phones get rounder rings to fill the taller screen.
const tiltFor = (w: number) => (w < 560 ? 0.66 : 0.38);
const heightFor = (w: number) => w * (w < 560 ? 0.88 : 0.56);
const RINGS = [0.2, 0.31, 0.43]; // ring radius as a share of the orbit's width

// Where each project orbits: ring, starting angle, speed (radians per second; negative = other way).
const ORBITS: Record<string, { ring: number; phase: number; speed: number }> = {
  sukyoo: { ring: 0, phase: 0.6, speed: 0.38 },
  katori: { ring: 1, phase: 1.9, speed: 0.26 },
  "interior-studio-os": { ring: 1, phase: 1.9 + Math.PI, speed: 0.26 },
  "vasp-trace": { ring: 2, phase: 0.2, speed: -0.17 },
  "peer-review-arena": { ring: 2, phase: 0.2 + Math.PI, speed: -0.17 },
};

// Small line icons, one per project.
function PlanetIcon({ kind }: { kind: Project["artifact"] }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const a = "var(--accent)";
  switch (kind) {
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

// Five projects orbiting a glowing core. Hover (or touch) pauses them; click opens the project.
// The orbit launches when the intro ends, and speeds up, spreads and fades as you scroll away.
export default function HeroOrbit({ ready }: { ready: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const readyRef = useRef(ready);
  const readyAt = useRef(0);
  const hoveredRef = useRef<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    readyRef.current = ready;
    if (ready) readyAt.current = performance.now();
  }, [ready]);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const setWidthSafe = (w: number) => requestAnimationFrame(() => setWidth(w));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = box.clientWidth;
    setWidthSafe(W);
    let frame = 0;
    let last = performance.now();
    let clock = 0; // orbit time, slowed or stopped while paused
    let speed = 1;
    let touchHold = 0;

    const ro = new ResizeObserver(() => {
      W = box.clientWidth;
      setWidthSafe(W);
    });
    ro.observe(box);

    const place = (now: number) => {
      const cx = W / 2;
      const cy = heightFor(W) / 2;
      const tilt = tiltFor(W);
      const size = Math.max(44, Math.min(76, W * 0.1));
      const s = reduced ? 0 : Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.6)));
      box.style.opacity = String(1 - s * 0.9);

      projects.forEach((p, i) => {
        const el = planetRefs.current[i];
        const label = labelRefs.current[i];
        const o = ORBITS[p.slug];
        if (!el || !o) return;
        // Launch from the core one after another once the intro is done.
        const since = readyRef.current ? (now - readyAt.current) / 1000 - 0.25 - i * 0.14 : -1;
        const k = reduced ? 1 : Math.min(1, Math.max(0, since / 1.1));
        const launch = k === 0 ? 0 : 1 - Math.pow(1 - k, 3);
        const R = RINGS[o.ring] * W * launch * (1 + s * 0.9);
        const a = o.phase + o.speed * clock;
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a) * tilt;
        const depth = (Math.sin(a) + 1) / 2; // 1 = in front of the core, 0 = behind it
        const isHover = hoveredRef.current === p.slug;
        const scale = (0.7 + 0.42 * depth) * (isHover ? 1.25 : 1) * (0.4 + 0.6 * launch);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) scale(${scale})`;
        el.style.zIndex = isHover ? "40" : depth > 0.5 ? "30" : "10";
        el.style.opacity = String((0.45 + 0.55 * depth) * (launch > 0 ? 1 : 0));
        if (label) label.style.opacity = isHover || depth > 0.62 ? "1" : "0";
      });
    };

    const step = () => {
      frame = requestAnimationFrame(step);
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.6)));
      const paused = hoveredRef.current !== null || now < touchHold;
      const target = paused ? 0 : 1 + s * 5; // spins faster as you scroll away
      speed += (target - speed) * Math.min(1, dt * 4);
      clock += dt * speed;
      place(now);
    };

    // Touching the orbit on a phone pauses it for a moment so a planet is easy to tap.
    const onTouch = () => (touchHold = performance.now() + 2500);
    box.addEventListener("pointerdown", onTouch);

    if (reduced) {
      place(performance.now());
      const onReady = () => place(performance.now());
      window.addEventListener("intro:done", onReady);
      return () => {
        ro.disconnect();
        box.removeEventListener("pointerdown", onTouch);
        window.removeEventListener("intro:done", onReady);
      };
    }
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      box.removeEventListener("pointerdown", onTouch);
    };
  }, []);

  return (
    <div ref={boxRef} className="relative mx-auto aspect-[1/0.88] w-full max-w-[min(92vw,820px,118svh)] min-[560px]:aspect-[1/0.56]">
      {/* Rings */}
      {width > 0 && (
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${width} ${heightFor(width)}`} aria-hidden>
          {RINGS.map((r, i) => (
            <motion.ellipse
              key={r}
              cx={width / 2}
              cy={heightFor(width) / 2}
              rx={r * width}
              ry={r * width * tiltFor(width)}
              fill="none"
              stroke="rgb(255 255 255 / 0.12)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={ready ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.15, duration: 1.4, ease }}
            />
          ))}
        </svg>
      )}

      {/* Core */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-20 flex aspect-square w-[19%] min-w-[78px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, #ffd1a8 0%, #ff8a3d 38%, #e2531a 70%, #9a2f0c 100%)",
          boxShadow: "0 0 60px 8px rgb(255 122 47 / 0.45), 0 0 140px 40px rgb(255 122 47 / 0.18), inset 0 -10px 30px rgb(0 0 0 / 0.35)",
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={ready ? { scale: [0.6, 1.08, 1], opacity: 1 } : {}}
        transition={{ duration: 1.1, ease }}
      >
        <span className="text-[clamp(0.75rem,1.9vw,1.25rem)] font-bold tracking-[-0.03em] text-[#1b1d22]">Portfolio</span>
      </motion.div>

      {/* Planets */}
      {projects.map((p, i) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          ref={(el) => {
            planetRefs.current[i] = el;
          }}
          aria-label={`${p.name}: ${p.line}`}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(p.slug)}
          onPointerLeave={() => setHovered(null)}
          onFocus={() => setHovered(p.slug)}
          onBlur={() => setHovered(null)}
          className={`glass absolute left-0 top-0 flex items-center justify-center rounded-full text-ink opacity-0 transition-[box-shadow] duration-300 will-change-transform ${
            hovered === p.slug ? "shadow-[0_0_0_2px_var(--accent),0_0_40px_rgb(255_122_47/0.45)]" : ""
          }`}
        >
          <PlanetIcon kind={p.artifact} />
          <span
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-center opacity-0 transition-opacity duration-300"
          >
            <span className={`chip px-2.5 py-0.5 text-[0.7rem] font-semibold sm:text-[0.75rem] ${hovered === p.slug ? "border-accent text-ink" : "text-graphite"}`}>
              {p.name}
            </span>
            {hovered === p.slug && (
              <span className="glass mt-2 block max-w-[15rem] whitespace-normal rounded-2xl px-3 py-2 text-[0.75rem] leading-snug text-ink">
                {p.line}
                <span className="mt-1 block font-semibold text-accent-ink">Open the project</span>
              </span>
            )}
          </span>
        </Link>
      ))}
    </div>
  );
}
