"use client";

import { motion } from "motion/react";
import SplitReveal from "./SplitReveal";
import HeroMosaic from "./HeroMosaic";
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
    <section className="wrap grid min-h-svh items-center gap-12 pb-16 pt-24 lg:grid-cols-12 lg:gap-10 lg:pb-10">
      <div className="lg:col-span-6">
        <h1 className="text-[clamp(3.25rem,8.2vw,7rem)] font-bold leading-[0.92] tracking-[-0.055em]">
          <SplitReveal lines={["Hi, I'm", "Aviraj."]} play={ready} delay={0.15} stagger={0.04} />
        </h1>

        <motion.p className="lead mt-8 max-w-[30ch]" {...rise(0.75)}>
          I build apps, AI tools and the systems behind them, from the database to the deploy.
        </motion.p>
        <motion.p className="mt-4 text-[0.9375rem] text-graphite" {...rise(0.85)}>
          Second-year B.Tech CSE (AI &amp; ML) at JSPM, Pune
        </motion.p>

        <motion.div className="mt-10 flex flex-wrap gap-3" {...rise(1.0)}>
          <a
            href="#work"
            className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-[0.9375rem] font-semibold text-[#1b1d22] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            See my projects
          </a>
          <a
            href="/aviraj-patil-resume.pdf"
            download
            className="inline-flex h-12 items-center rounded-full border border-line px-6 text-[0.9375rem] font-medium transition-colors duration-300 hover:border-ink"
          >
            Download resume
          </a>
        </motion.div>
      </div>

      <div className="mx-auto w-full max-w-[34rem] lg:col-span-6 lg:max-w-none">
        <HeroMosaic ready={ready} />
      </div>
    </section>
  );
}
