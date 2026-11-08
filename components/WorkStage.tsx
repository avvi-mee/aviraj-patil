"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useSpring } from "motion/react";
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

function Stack({ p }: { p: Project }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Built with">
      {p.stack.map((s) => (
        <li key={s} className="chip text-graphite">
          {s}
        </li>
      ))}
    </ul>
  );
}

// Desktop: the section pins to the screen and scrolling moves through the projects one by one.
function Pinned() {
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
    <div ref={ref} className="relative hidden lg:block" style={{ height: `${n * 100}svh` }}>
      <div className="sticky top-0 flex h-svh items-center">
        <div className="wrap grid grid-cols-12 items-center gap-10">
          <div className="col-span-5 flex flex-col gap-12">
            <ul className="space-y-1.5 text-[0.9375rem]">
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

            <div className="relative min-h-[26rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                  transition={{ duration: 0.55, ease }}
                >
                  <p className="text-[0.9375rem] text-graphite">{p.context}</p>
                  <h3 className="mt-3 text-[clamp(2.25rem,4.2vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
                    {p.name}
                  </h3>
                  <p className="lead mt-5 max-w-[30ch]">{p.line}</p>
                  <div className="mt-6">
                    <Stack p={p} />
                  </div>
                  <div className="mt-8">
                    <Links p={p} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="col-span-7">
            <div className="glass relative mx-auto aspect-square max-h-[76svh] overflow-hidden rounded-[2.5rem]">
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
            <div className="mx-auto mt-6 h-px max-w-[76svh] bg-line">
              <motion.div className="h-px origin-left bg-ink" style={{ scaleX: bar }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCard({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.5 });
  return (
    <article className="glass rounded-[2rem] p-4 pb-6">
      <div ref={ref} className="aspect-square overflow-hidden rounded-[1.5rem] bg-[var(--glass-bg)] p-[8%]">
        <Artifact kind={p.artifact} play={seen} />
      </div>
      <div className="px-2">
        <p className="mt-6 text-[0.9375rem] text-graphite">{p.context}</p>
        <h3 className="h3 mt-2">{p.name}</h3>
        <p className="mt-3 text-lg leading-relaxed">{p.line}</p>
        <div className="mt-4">
          <Stack p={p} />
        </div>
      </div>
      <div className="mt-6 px-2">
        <Links p={p} />
      </div>
    </article>
  );
}

export default function WorkStage() {
  return (
    <>
      <Pinned />
      <div className="wrap mt-10 space-y-5 lg:hidden">
        {projects.map((p) => (
          <MobileCard key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}
