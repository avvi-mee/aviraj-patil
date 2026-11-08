"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const TEXT =
  "I'm the founder of UNMATRIX. I take an idea from a blank screen to a live product, and I build every layer myself.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}{" "}
    </motion.span>
  );
}

// The paragraph lights up word by word as you scroll through it.
export default function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = TEXT.split(" ");

  return (
    <p
      ref={ref}
      className="max-w-[24ch] text-[clamp(1.875rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] sm:max-w-[26ch]"
    >
      {words.map((w, i) => (
        <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}
