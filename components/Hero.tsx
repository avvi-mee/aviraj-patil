"use client";

import { motion } from "motion/react";
import HeroOrbit from "./HeroOrbit";
import { useIntroDone } from "@/lib/intro";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ready = useIntroDone();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16, filter: "blur(6px)" },
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { delay, duration: 1, ease },
  });

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-x-clip px-4 pb-16 pt-24 text-center">
      <h1 className="sr-only">Hi, I&apos;m Aviraj Patil</h1>
      <div className="w-full">
        <HeroOrbit ready={ready} />
      </div>

      <motion.p className="lead relative z-10 mt-12 max-w-[38ch] sm:mt-14" {...rise(1.0)}>
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
        <span className="hidden sm:inline">Hover a planet to pause the orbit, click to open the project</span>
        <span className="sm:hidden">Tap a planet to open the project</span>
      </motion.p>
    </section>
  );
}
