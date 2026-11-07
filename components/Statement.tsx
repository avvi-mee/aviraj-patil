"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const TEXT =
  "Since starting college I've built a calorie tracker that understands Indian food, a tool that traces crypto for cybercrime investigators, an app for grandparents and the families who look after them, an arena where AI agents review each other's code, and the software an interior design studio runs on.";

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
