"use client";

import { motion } from "motion/react";
import ParticleName from "./ParticleName";
import { useIntroDone } from "@/lib/intro";

const ease = [0.22, 1, 0.36, 1] as const;
// The particles morph through these, matching the line below them.
const WORDS = ["Apps", "AI Tools", "Systems"];

export default function Hero() {
  const ready = useIntroDone();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16, filter: "blur(6px)" },
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { delay, duration: 1, ease },
  });

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-4 pb-24 pt-28 text-center">
      <motion.p className="glass relative z-10 flex items-center gap-2.5 rounded-full px-4 py-2 text-[0.875rem] text-graphite" {...rise(0.2)}>
        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
        B.Tech CSE (AI &amp; ML) student in Pune
      </motion.p>

      <h1 className="sr-only">Hi, I&apos;m Aviraj Patil</h1>
      <div className="mt-6 w-full max-w-[76rem] sm:mt-8">
        <ParticleName words={WORDS} ready={ready} />
      </div>

      <motion.p className="lead relative z-10 mt-4 max-w-[38ch] sm:mt-6" {...rise(1.0)}>
        Hi, I&apos;m Aviraj Patil. I build apps, AI tools and the systems behind them, from the database to the deploy.
      </motion.p>

      <motion.div className="relative z-10 mt-9 flex flex-wrap justify-center gap-3" {...rise(1.15)}>
        <a
          href="#work"
          className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-[0.9375rem] font-semibold text-[#1b1d22] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          See my projects
        </a>
        <a
          href="/resume"
          className="glass inline-flex h-12 items-center rounded-full px-6 text-[0.9375rem] font-semibold transition-transform duration-300 hover:scale-[1.03]"
        >
          View resume
        </a>
      </motion.div>

      <motion.p className="mt-6 text-[0.8125rem] text-graphite" {...rise(1.3)}>
        <span className="hidden sm:inline">Move your cursor through the words</span>
        <span className="sm:hidden">Drag your finger across the words</span>
      </motion.p>

      {/* Scroll cue: a small glass capsule with a dot sliding down */}
      <motion.a
        href="#work"
        aria-label="Scroll to projects"
        className="glass absolute bottom-8 left-1/2 hidden h-11 w-7 -translate-x-1/2 justify-center rounded-full pt-2 sm:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <motion.span
          className="h-2 w-1 rounded-full bg-accent"
          animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.a>
    </section>
  );
}
