"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { projects, type Project } from "@/lib/projects";
import Artifact from "./Artifacts";
import { GithubIcon } from "./Icons";

const ease = [0.22, 1, 0.36, 1] as const;

const pill =
  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-[0.875rem] font-semibold transition-transform duration-300 hover:-translate-y-0.5";

function Links({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Link href={`/work/${p.slug}`} className={`${pill} bg-accent text-[#1b1d22]`}>
        Read the case study
      </Link>
      {p.live && (
        <a href={p.live.href} target="_blank" rel="noreferrer" className={`${pill} glass`}>
          Live demo
        </a>
      )}
      <a href={p.github} target="_blank" rel="noreferrer" className={`${pill} glass`}>
        <GithubIcon className="h-4 w-4" />
        Code
      </a>
    </div>
  );
}

// The section pins to the screen and scrolling moves through the projects one by one (phones and desktop).
// Desktop: text on the left, drawing on the right. Phones: drawing on top, text below, progress bar above.
export default function WorkStage() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const n = projects.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
  });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / n), behavior: "smooth" });
  };

  const p = projects[active];

  return (
    <div ref={ref} className="relative" style={{ height: `${n * 100}svh` }}>
      <div className="sticky top-0 flex h-svh items-center">
        <div className="wrap flex w-full flex-col gap-5 pb-6 pt-20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-0">
          {/* Phones: one segment per project, the current one fills */}
          <div className="flex gap-1.5 lg:hidden" aria-hidden>
            {projects.map((x, i) => (
              <span key={x.slug} className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--glass-border)]">
                <span
                  className={`block h-full rounded-full bg-accent transition-[width] duration-500 ${
                    i < active ? "w-full opacity-50" : i === active ? "w-full" : "w-0"
                  }`}
                />
              </span>
            ))}
          </div>

          {/* Drawing: right column on desktop, top on phones */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="glass relative mx-auto aspect-square w-full max-w-[min(100%,40svh)] overflow-hidden rounded-[2rem] lg:max-h-[76svh] lg:max-w-none lg:rounded-[2.5rem]">
              {projects.map((x, i) => (
                <motion.div
                  key={x.slug}
                  className="absolute inset-0 p-[8%]"
                  initial={false}
                  animate={{
                    opacity: i === active ? 1 : 0,
                    scale: i === active ? 1 : 0.94,
                    filter: i === active ? "blur(0px)" : "blur(10px)",
                  }}
                  transition={{ duration: 0.7, ease }}
                  aria-hidden={i !== active}
                >
                  <Artifact kind={x.artifact} play={i === active} />
                </motion.div>
              ))}
            </div>
            <div className="mx-auto mt-6 hidden h-px max-w-[76svh] bg-line lg:block">
              <motion.div className="h-px origin-left bg-accent" style={{ scaleX: bar }} />
            </div>
          </div>

          {/* Text: left column on desktop, below the drawing on phones */}
          <div className="order-2 flex flex-col gap-12 lg:order-1 lg:col-span-5">
            <ul className="hidden space-y-1.5 text-[0.9375rem] lg:block">
              {projects.map((x, i) => (
                <li key={x.slug}>
                  <button
                    onClick={() => jump(i)}
                    aria-current={i === active}
                    className={`relative flex items-center gap-3 py-0.5 transition-colors duration-500 ${
                      i === active ? "text-ink" : "text-graphite/60 hover:text-graphite"
                    }`}
                  >
                    <span className="relative h-1.5 w-1.5">
                      {i === active && (
                        <motion.span
                          layoutId="dot"
                          className="absolute inset-0 rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                    </span>
                    {x.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="relative min-h-[16.5rem] lg:min-h-[26rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease }}
                >
                  <p className="text-[0.8125rem] text-graphite lg:text-[0.9375rem]">{p.context}</p>
                  <h3 className="mt-1.5 text-[clamp(1.875rem,4.2vw,3.75rem)] font-semibold leading-[1] tracking-[-0.035em] lg:mt-3">
                    {p.name}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[1.0625rem] leading-snug lg:mt-5 lg:max-w-[30ch] lg:text-[clamp(1.125rem,1.7vw,1.375rem)] lg:leading-normal">
                    {p.line}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5 lg:mt-6 lg:gap-2" aria-label="Built with">
                    {p.stack.map((s) => (
                      <li key={s} className="chip px-2.5 py-1 text-[0.75rem] text-graphite lg:px-3 lg:text-[0.8125rem]">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 lg:mt-8">
                    <Links p={p} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
