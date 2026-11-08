"use client";

import { motion } from "motion/react";
import { skills, type Level } from "@/lib/skills";

const ease = [0.22, 1, 0.36, 1] as const;

const badge: Record<Level, string> = {
  Strong: "bg-accent text-[#1b1d22]",
  Proficient: "border border-accent/50 text-accent-ink",
  Familiar: "border border-[var(--glass-border)] text-graphite",
};

// Glass cards with each tool's logo and how much I've used it. They rise in once, as the grid scrolls into view.
export default function Skills() {
  return (
    <motion.ul
      className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
      initial="hide"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hide: {}, show: { transition: { staggerChildren: 0.035 } } }}
    >
      {skills.map((s) => (
        <motion.li
          key={s.name}
          variants={{
            hide: { opacity: 0, y: 24, filter: "blur(8px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
          }}
          className="glass group relative flex flex-col items-center gap-3 overflow-hidden rounded-[1.5rem] px-3 pb-5 pt-6 text-center transition-transform duration-500 hover:-translate-y-1.5"
        >
          {/* Soft glow in the tool's own colour, shown on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
            style={{ background: s.color }}
          />
          <svg viewBox="0 0 24 24" className="relative h-9 w-9" aria-hidden>
            <path d={s.path} fill={s.color} />
          </svg>
          <span className="relative text-[0.9375rem] font-semibold leading-tight">{s.name}</span>
          <span className={`relative rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${badge[s.level]}`}>
            {s.level}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
