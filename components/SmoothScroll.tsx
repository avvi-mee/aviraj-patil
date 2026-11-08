"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { INTRO_EVENT } from "@/lib/intro";

// Smooth, weighted scrolling. Skipped entirely when the visitor prefers reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: { offset: -56 },
    });
    // Hold scrolling while the welcome screen is up.
    const start = () => lenis.start();
    if (document.documentElement.dataset.intro !== "done") {
      lenis.stop();
      window.addEventListener(INTRO_EVENT, start);
    }
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(INTRO_EVENT, start);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function Motion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
