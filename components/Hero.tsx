"use client";

import { motion } from "motion/react";
import SplitReveal from "./SplitReveal";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="wrap flex min-h-svh flex-col justify-end pb-14 pt-28 sm:pb-20">
      <h1 className="display">
        <SplitReveal lines={["Aviraj", "Patil"]} />
      </h1>

      <motion.div
        aria-hidden
        className="mt-8 h-px origin-left bg-neel sm:mt-12"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.75, duration: 1.4, ease }}
      />

      <div className="mt-8 grid gap-8 sm:mt-10 md:grid-cols-12 md:items-end">
        <motion.p
          className="lead max-w-[34ch] text-graphite md:col-span-7"
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.0, duration: 1.0, ease }}
        >
          Second-year B.Tech student in Computer Science (AI &amp; ML) at JSPM, Pune.{" "}
          <span className="text-ink">I build complete products: the database, the backend, the app and the deploy.</span>
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 md:col-span-5 md:justify-end"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.0, ease }}
        >
          <a
            href="#work"
            className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-paper transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            See my work
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
    </section>
  );
}
