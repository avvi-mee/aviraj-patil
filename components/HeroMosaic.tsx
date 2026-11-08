"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { projects } from "@/lib/projects";
import Artifact from "./Artifacts";

const ease = [0.22, 1, 0.36, 1] as const;
// Grid placement (3 x 3) and how far each tile drifts with the cursor.
const SPOTS = [
  { cls: "col-span-2 row-span-2", depth: 0.6 },
  { cls: "", depth: 1.4 },
  { cls: "", depth: 1.0 },
  { cls: "", depth: 1.2 },
  { cls: "col-span-2", depth: 0.8 },
];
const CYCLE_MS = 3200;

function Tile({
  i,
  ready,
  play,
  active,
  mx,
  my,
}: {
  i: number;
  ready: boolean;
  play: boolean;
  active: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const p = projects[i];
  const { cls, depth } = SPOTS[i];
  const x = useTransform(mx, (v) => v * depth * 22);
  const y = useTransform(my, (v) => v * depth * 22);

  return (
    <motion.div
      className={`relative ${cls}`}
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
      animate={ready ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ delay: 0.25 + i * 0.09, duration: 1, ease }}
    >
      <Link
        href={`/work/${p.slug}`}
        aria-label={`${p.name}: ${p.line}`}
        className={`group absolute inset-0 overflow-hidden rounded-[1.5rem] bg-paper-2 outline-offset-4 transition-[box-shadow] duration-700 sm:rounded-[1.75rem] ${
          active ? "shadow-[0_0_0_2px_var(--accent)]" : "shadow-[0_0_0_1px_var(--line)]"
        }`}
      >
        <div className="absolute inset-0 p-[9%] transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <Artifact kind={p.artifact} play={play} />
        </div>
        <span
          className={`absolute bottom-2.5 left-3 text-[0.75rem] font-medium transition-colors duration-500 sm:bottom-3.5 sm:left-4 sm:text-[0.8125rem] ${
            active ? "text-ink" : "text-graphite"
          }`}
        >
          {p.name}
        </span>
      </Link>
    </motion.div>
  );
}

// Five project drawings in one live mosaic: each draws in, then they take turns replaying.
export default function HeroMosaic({ ready }: { ready: boolean }) {
  const [plays, setPlays] = useState<boolean[]>(() => projects.map(() => false));
  const [active, setActive] = useState(-1);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  // First pass: every tile draws in, one after another.
  useEffect(() => {
    if (!ready) return;
    const timers = projects.map((_, i) =>
      window.setTimeout(() => setPlays((s) => s.map((v, k) => (k === i ? true : v))), 450 + i * 260),
    );
    return () => timers.forEach(clearTimeout);
  }, [ready]);

  // Then they take turns: the highlighted tile replays its drawing.
  useEffect(() => {
    if (!ready) return;
    let n = -1;
    let replay = 0;
    const id = window.setInterval(() => {
      n = (n + 1) % projects.length;
      setActive(n);
      setPlays((s) => s.map((v, k) => (k === n ? false : v)));
      replay = window.setTimeout(() => setPlays((s) => s.map((v, k) => (k === n ? true : v))), 320);
    }, CYCLE_MS);
    return () => {
      clearInterval(id);
      clearTimeout(replay);
    };
  }, [ready]);

  // Gentle parallax that follows the cursor (mouse and trackpad only).
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [rawX, rawY]);

  return (
    <div className="grid aspect-square w-full grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3.5">
      {projects.map((p, i) => (
        <Tile key={p.slug} i={i} ready={ready} play={plays[i]} active={active === i} mx={mx} my={my} />
      ))}
    </div>
  );
}
