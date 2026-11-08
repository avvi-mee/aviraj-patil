"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useIntroDone } from "@/lib/intro";
import { socials } from "./Icons";

const sections = [
  { label: "Projects", href: "/#work" },
  { label: "Skills", href: "/#skills" },
  { label: "About", href: "/#about" },
];

// Floating glass bar: name, sections, social icons and the resume button.
export default function Nav() {
  const ready = useIntroDone();

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6"
    >
      <nav
        aria-label="Main"
        className="glass mx-auto flex h-14 max-w-[72rem] items-center justify-between gap-3 rounded-full pl-5 pr-2"
      >
        <Link href="/" className="shrink-0 text-[0.9375rem] font-semibold tracking-tight">
          Aviraj Patil
        </Link>

        <ul className="hidden items-center gap-7 text-[0.9375rem] text-graphite md:flex">
          {sections.map((s) => (
            <li key={s.label}>
              <Link href={s.href} className="ulink transition-colors hover:text-ink">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-0.5">
          {socials.map(({ label, href, Icon, external }, i) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className={`h-10 w-10 items-center justify-center rounded-full text-graphite transition-colors duration-300 hover:bg-[var(--glass-bg)] hover:text-ink ${
                i > 1 ? "hidden sm:flex" : "flex"
              }`}
            >
              <Icon />
            </a>
          ))}
          <a
            href="/resume"
            className="ml-1.5 inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-[0.875rem] font-semibold text-[#1b1d22] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.97]"
          >
            Resume
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
