"use client";

import { motion, type Variants } from "motion/react";
import type { Project } from "@/lib/projects";

const ease = [0.22, 1, 0.36, 1] as const;

// Shared variants: lines draw themselves, shapes settle into place.
const draw = (delay = 0, duration = 1.2): Variants => ({
  off: { pathLength: 0, opacity: 0, transition: { duration: 0.25 } },
  on: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay, duration, ease }, opacity: { delay, duration: 0.01 } },
  },
});
const drawTo = (to: number, delay = 0, duration = 1.6): Variants => ({
  off: { pathLength: 0, opacity: 0, transition: { duration: 0.25 } },
  on: {
    pathLength: to,
    opacity: 1,
    transition: { pathLength: { delay, duration, ease }, opacity: { delay, duration: 0.01 } },
  },
});
const pop = (delay = 0): Variants => ({
  off: { scale: 0.6, opacity: 0, transition: { duration: 0.2 } },
  on: { scale: 1, opacity: 1, transition: { delay, duration: 0.8, ease } },
});
const fade = (delay = 0): Variants => ({
  off: { opacity: 0, transition: { duration: 0.2 } },
  on: { opacity: 1, transition: { delay, duration: 0.8, ease } },
});

const box = { transformBox: "fill-box", transformOrigin: "center" } as const;
const ink = "var(--ink)";
const neel = "var(--neel)";
const soft = "var(--neel-soft)";
const line = "var(--graphite)";

function Frame({ play, label, children }: { play: boolean; label: string; children: React.ReactNode }) {
  return (
    <motion.svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={label}
      className="h-full w-full"
      initial="off"
      animate={play ? "on" : "off"}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </motion.svg>
  );
}

// A thali seen from above, with the day's calorie ring filling around it.
function Katori({ play }: { play: boolean }) {
  const bowls = [
    { x: 152, y: 148, d: 0.55 },
    { x: 250, y: 140, d: 0.68 },
    { x: 140, y: 248, d: 0.81 },
  ];
  return (
    <Frame play={play} label="A thali with three katoris and a calorie ring filling around it">
      <motion.circle cx="200" cy="200" r="172" stroke="var(--line)" strokeWidth="10" variants={fade(0)} />
      <motion.circle
        cx="200"
        cy="200"
        r="172"
        stroke={neel}
        strokeWidth="10"
        transform="rotate(-90 200 200)"
        variants={drawTo(0.72, 0.2, 2)}
      />
      <motion.circle cx="200" cy="200" r="140" stroke={ink} strokeWidth="1.5" variants={draw(0.1, 1.4)} />
      {bowls.map((b) => (
        <motion.g key={b.x} style={box} variants={pop(b.d)}>
          <circle cx={b.x} cy={b.y} r="40" stroke={ink} strokeWidth="1.5" />
          <circle cx={b.x} cy={b.y} r="30" fill={soft} />
        </motion.g>
      ))}
      <motion.g style={box} variants={pop(0.95)}>
        <circle cx="252" cy="250" r="52" stroke={ink} strokeWidth="1.5" />
        <circle cx="252" cy="250" r="40" stroke={line} strokeWidth="1" strokeDasharray="2 6" />
      </motion.g>
    </Frame>
  );
}

// Money hops from wallet to wallet until it reaches an exchange; dead ends fade out.
function Vasp({ play }: { play: boolean }) {
  const hops: [number, number][] = [
    [72, 312],
    [138, 252],
    [116, 170],
    [196, 136],
    [254, 196],
    [318, 118],
  ];
  const deadEnds: [number, number, number, number][] = [
    [138, 252, 214, 318],
    [196, 136, 156, 72],
    [254, 196, 318, 262],
  ];
  return (
    <Frame play={play} label="A wallet's transactions traced hop by hop to an exchange">
      {deadEnds.map(([x1, y1, x2, y2], i) => (
        <motion.g key={i} variants={fade(0.4 + i * 0.25)}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={line} strokeWidth="1" strokeDasharray="3 6" />
          <circle cx={x2} cy={y2} r="6" fill="var(--paper)" stroke={line} strokeWidth="1" />
        </motion.g>
      ))}
      {hops.slice(1).map(([x, y], i) => {
        const [px, py] = hops[i];
        return (
          <motion.line
            key={`e${i}`}
            x1={px}
            y1={py}
            x2={x}
            y2={y}
            stroke={neel}
            strokeWidth="2"
            variants={draw(0.2 + i * 0.32, 0.45)}
          />
        );
      })}
      {hops.slice(1, -1).map(([x, y], i) => (
        <motion.circle
          key={`n${i}`}
          cx={x}
          cy={y}
          r="8"
          fill="var(--paper)"
          stroke={ink}
          strokeWidth="1.5"
          style={box}
          variants={pop(0.45 + i * 0.32)}
        />
      ))}
      <motion.g style={box} variants={pop(0)}>
        <circle cx="72" cy="312" r="14" fill={neel} />
        <text x="72" y="350" textAnchor="middle" fontSize="13" fill={ink} fontFamily="inherit">
          Wallet
        </text>
      </motion.g>
      <motion.g style={box} variants={pop(1.85)}>
        <rect x="296" y="96" width="44" height="44" rx="12" fill={ink} />
        <text x="318" y="78" textAnchor="middle" fontSize="13" fill={ink} fontFamily="inherit">
          Exchange
        </text>
      </motion.g>
      <motion.rect
        x="290"
        y="90"
        width="56"
        height="56"
        rx="16"
        stroke={neel}
        strokeWidth="1.5"
        style={box}
        variants={{
          off: { opacity: 0, scale: 1 },
          on: { opacity: [0, 1, 0], scale: [1, 1.35, 1.6], transition: { delay: 2.2, duration: 1.4, ease } },
        }}
      />
    </Frame>
  );
}

// A senior's phone with big, simple tiles, connected to the family's phone.
function Sukyoo({ play }: { play: boolean }) {
  const tiles = [
    [90, 112],
    [158, 112],
    [90, 180],
    [158, 180],
  ];
  return (
    <Frame play={play} label="A senior's phone with large tiles linked to a family member's phone">
      <motion.rect x="66" y="66" width="168" height="288" rx="30" stroke={ink} strokeWidth="1.5" variants={draw(0, 1.1)} />
      {tiles.map(([x, y], i) => (
        <motion.rect
          key={i}
          x={x}
          y={y}
          width="52"
          height="52"
          rx="14"
          fill={soft}
          style={box}
          variants={pop(0.45 + i * 0.1)}
        />
      ))}
      <motion.rect x="90" y="256" width="120" height="58" rx="18" fill={neel} style={box} variants={pop(0.95)} />
      <motion.rect x="276" y="128" width="88" height="164" rx="20" stroke={ink} strokeWidth="1.5" variants={draw(0.3, 1)} />
      {[160, 184, 208, 232].map((y, i) => (
        <motion.line
          key={y}
          x1="292"
          y1={y}
          x2={i % 2 ? 330 : 348}
          y2={y}
          stroke={line}
          strokeWidth="5"
          variants={draw(0.8 + i * 0.1, 0.5)}
        />
      ))}
      <motion.path
        d="M210 285 C 245 285, 250 250, 276 250"
        stroke={neel}
        strokeWidth="2"
        strokeDasharray="4 6"
        variants={draw(1.3, 0.8)}
      />
    </Frame>
  );
}

// Two agents flag problems in the same code, then cross-check each other.
function Arena({ play }: { play: boolean }) {
  const widths = [180, 120, 210, 150, 96, 190, 140, 170];
  const flagsA = [1, 4];
  const flagsB = [2, 4, 6];
  return (
    <Frame play={play} label="Two AI agents flag issues in the same code and compare findings">
      <motion.rect x="56" y="56" width="288" height="236" rx="20" stroke={ink} strokeWidth="1.5" variants={draw(0, 1)} />
      {widths.map((w, i) => (
        <motion.rect
          key={i}
          x={80 + (i % 3 === 2 ? 20 : 0)}
          y={82 + i * 25}
          width={w}
          height="8"
          rx="4"
          fill={line}
          opacity="0.35"
          variants={{
            off: { scaleX: 0, transition: { duration: 0.2 } },
            on: { scaleX: 1, transition: { delay: 0.25 + i * 0.06, duration: 0.6, ease } },
          }}
          style={{ transformBox: "fill-box", transformOrigin: "left center" }}
        />
      ))}
      {flagsA.map((i, k) => (
        <motion.circle key={`a${i}`} cx="306" cy={86 + i * 25} r="7" fill={ink} style={box} variants={pop(0.9 + k * 0.18)} />
      ))}
      {flagsB.map((i, k) => (
        <motion.circle
          key={`b${i}`}
          cx={i === 4 ? 324 : 306}
          cy={86 + i * 25}
          r="7"
          fill={neel}
          style={box}
          variants={pop(1.05 + k * 0.18)}
        />
      ))}
      <motion.g style={box} variants={pop(1.5)}>
        <circle cx="132" cy="340" r="20" fill={ink} />
        <text x="132" y="345" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--paper)" fontFamily="inherit">
          A
        </text>
      </motion.g>
      <motion.g style={box} variants={pop(1.6)}>
        <circle cx="268" cy="340" r="20" fill={neel} />
        <text x="268" y="345" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--paper)" fontFamily="inherit">
          B
        </text>
      </motion.g>
      <motion.path d="M156 330 C 190 304, 210 304, 244 330" stroke={ink} strokeWidth="1.5" variants={draw(1.9, 0.7)} />
      <motion.path d="M244 352 C 210 378, 190 378, 156 352" stroke={neel} strokeWidth="1.5" variants={draw(2.15, 0.7)} />
    </Frame>
  );
}

// A floor plan draws itself, then gets measured and priced.
function Interior({ play }: { play: boolean }) {
  return (
    <Frame play={play} label="A home floor plan drawn, measured and priced">
      <motion.path
        d="M150 70 H 340 V 320 H 60 V 70 H 110"
        stroke={ink}
        strokeWidth="3"
        variants={draw(0, 1.6)}
      />
      <motion.path d="M200 70 V 190 M60 210 H 150 M190 210 H 260 M260 210 V 320" stroke={ink} strokeWidth="2" variants={draw(0.9, 1)} />
      <motion.path d="M110 70 A 40 40 0 0 1 150 110" stroke={line} strokeWidth="1" variants={draw(1.6, 0.6)} />
      <motion.path d="M150 210 A 40 40 0 0 0 190 250" stroke={line} strokeWidth="1" variants={draw(1.7, 0.6)} />
      <motion.rect x="84" y="96" width="70" height="90" rx="8" fill={soft} style={box} variants={pop(1.9)} />
      <motion.rect x="276" y="250" width="48" height="56" rx="8" fill={soft} style={box} variants={pop(2.0)} />
      <motion.circle cx="270" cy="130" r="26" fill={soft} style={box} variants={pop(2.1)} />
      <motion.path d="M60 352 H 340 M60 344 V 360 M340 344 V 360" stroke={neel} strokeWidth="1.5" variants={draw(2.2, 0.8)} />
      <motion.g variants={fade(2.7)}>
        <rect x="150" y="338" width="100" height="28" rx="14" fill="var(--paper)" />
        <text x="200" y="357" textAnchor="middle" fontSize="13" fill={neel} fontWeight="600" fontFamily="inherit">
          1,240 sq ft
        </text>
      </motion.g>
    </Frame>
  );
}

const map = { katori: Katori, vasp: Vasp, sukyoo: Sukyoo, arena: Arena, interior: Interior };

export default function Artifact({ kind, play }: { kind: Project["artifact"]; play: boolean }) {
  const C = map[kind];
  return <C play={play} />;
}
