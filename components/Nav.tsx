"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useIntroDone } from "@/lib/intro";

export default function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const ready = useIntroDone();
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500 ${
        solid ? "border-line bg-paper/80 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Main" className="wrap flex h-14 items-center justify-between text-[0.9375rem]">
        <Link href="/" className="font-semibold tracking-tight">
          Aviraj Patil
        </Link>
        <ul className="flex items-center gap-5 text-graphite sm:gap-7">
          <li>
            <Link href="/#work" className="ulink transition-colors hover:text-ink">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/#about" className="ulink transition-colors hover:text-ink">
              About
            </Link>
          </li>
          <li>
            <a href="/aviraj-patil-resume.pdf" download className="ulink transition-colors hover:text-ink">
              Resume
            </a>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}
