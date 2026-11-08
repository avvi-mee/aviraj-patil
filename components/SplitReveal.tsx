"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

// Letters rise out of a mask, one after another. Used once per page, for the main title.
export default function SplitReveal({
  lines,
  className = "",
  delay = 0.15,
  stagger = 0.035,
  play = true,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  stagger?: number;
  play?: boolean;
}) {
  let i = 0;
  return (
    <span className={className} aria-label={lines.join(" ")} role="text">
      {lines.map((line) => (
        <span key={line} aria-hidden className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
          {Array.from(line).map((ch) => {
            const d = delay + i++ * stagger;
            return (
              <motion.span
                key={`${line}-${d}`}
                className="inline-block will-change-transform"
                initial={{ y: "105%", rotate: 4 }}
                animate={play ? { y: "0%", rotate: 0 } : { y: "105%", rotate: 4 }}
                transition={{ delay: d, duration: 1.1, ease }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
