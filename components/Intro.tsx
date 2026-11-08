"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { finishIntro, useIntroDone } from "@/lib/intro";

const ease = [0.22, 1, 0.36, 1] as const;
const wipe = [0.76, 0, 0.24, 1] as const;
const HELLO_MS = 1000;
const WELCOME_MS = 1600;

// Welcome screen: "Hello", then the welcome line rises, then the screen lifts away with a curved edge.
export default function Intro() {
  const done = useIntroDone();
  const [gone, setGone] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "done") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = reduced
      ? [window.setTimeout(() => setWelcome(true), 0), window.setTimeout(() => setLeaving(true), 900)]
      : [
          window.setTimeout(() => setWelcome(true), HELLO_MS),
          window.setTimeout(() => setLeaving(true), HELLO_MS + WELCOME_MS),
        ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Already played this visit (and not mid-exit), or finished lifting away.
  if ((done && !leaving) || gone) return null;

  const total = (HELLO_MS + WELCOME_MS) / 1000;

  return (
    <motion.div
      id="intro"
      role="dialog"
      aria-label="Welcome"
      className="fixed inset-0 z-[100] flex flex-col bg-[#0f1013] text-[#ecede9]"
      initial={{ y: 0 }}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1.05, ease: wipe }}
      onAnimationStart={() => leaving && finishIntro()}
      onAnimationComplete={() => leaving && setGone(true)}
    >
      {/* The two lines are stacked and cross-fade. */}
      <div className="relative flex-1 px-6">
        <AnimatePresence>
          {!welcome ? (
            <motion.p
              key="hello"
              className="absolute inset-0 flex items-center justify-center gap-4 text-[clamp(2.75rem,9vw,6rem)] font-semibold tracking-[-0.035em]"
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease }}
            >
              <span className="h-3 w-3 shrink-0 rounded-full bg-[#ff7a2f]" aria-hidden />
              Hello
            </motion.p>
          ) : (
            <motion.div
              key="welcome"
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              initial="hide"
              animate="show"
            >
              {[
                { text: "Welcome to", cls: "text-[#9a9ea6]" },
                { text: "my portfolio", cls: "" },
              ].map((l, li) => (
                <span key={l.text} className="block overflow-hidden pb-[0.12em]">
                  <motion.span
                    className={`block text-[clamp(2.25rem,7vw,6rem)] font-bold leading-[1.02] tracking-[-0.045em] ${l.cls}`}
                    variants={{ hide: { y: "110%" }, show: { y: "0%" } }}
                    transition={{ delay: 0.08 + li * 0.14, duration: 0.95, ease }}
                  >
                    {l.text}
                  </motion.span>
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-6 mb-8 flex items-center gap-6 sm:mx-10">
        <div className="h-px flex-1 bg-white/10">
          <motion.div
            className="h-px origin-left bg-[#ff7a2f]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: total, ease: "linear" }}
          />
        </div>
        <button
          onClick={() => setLeaving(true)}
          className="text-sm text-[#9a9ea6] transition-colors hover:text-[#ecede9]"
        >
          Skip intro
        </button>
      </div>

      {/* Curved bottom edge: bulges while the screen lifts, so it reads as a sheet, not a cut. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-0 top-full h-[14vh] w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          fill="#0f1013"
          initial={{ d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z" }}
          animate={{ d: leaving ? "M0 0 L100 0 L100 0 Q50 100 0 0 Z" : "M0 0 L100 0 L100 0 Q50 0 0 0 Z" }}
          transition={{ duration: 0.9, ease: wipe }}
        />
      </svg>
    </motion.div>
  );
}
