import type { Metadata } from "next";
import Link from "next/link";
import { DownloadIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Resume | Aviraj Patil",
  description:
    "One-page resume of Aviraj Patil, B.Tech CSE (AI & ML) student at JSPM, Pune.",
};

const contact = [
  { label: "avvi.mee@gmail.com", href: "mailto:avvi.mee@gmail.com" },
  { label: "+91 90679 23611", href: "tel:+919067923611" },
  {
    label: "linkedin.com/in/avvimee",
    href: "https://www.linkedin.com/in/avvimee",
  },
  { label: "github.com/avvi-mee", href: "https://github.com/avvi-mee" },
  { label: "aviraj-patil.vercel.app", href: "https://aviraj-patil.vercel.app" },
];

const projects = [
  {
    name: "Katori",
    what: "All-in-one gym app for Indian gym-goers",
    stack: "Expo, React Native, TypeScript, Supabase, Deno",
    href: "https://github.com/avvi-mee/katori",
    points: [
      "Photo meal logging for Indian food: the AI names dishes and portions, and calories come from a reviewed food table.",
      "Offline workout logger with one-rep-max estimates, habits, steps, body tracking and a daily score; trainer mode with per-client Razorpay billing.",
      "Row-level security on every table with database tests; CI applies migrations and deploys edge functions on each push.",
    ],
  },
  {
    name: "VASP Trace",
    what: "Crypto wallet attribution for cybercrime investigations",
    stack: "Python, FastAPI, Next.js, NetworkX, Postgres",
    href: "https://github.com/avvi-mee/vasp_tracker",
    points: [
      "Follows a wallet up to 12 hops across Ethereum, Polygon, Tron, Solana, Bitcoin and BNB Chain to the exchange most likely holding its KYC.",
      "Sanctions screening from three sources, five laundering-pattern checks, and a court-format evidence pack.",
    ],
  },
  {
    name: "Sukyoo",
    what: "App for senior citizens and their families",
    stack: "Expo, Next.js, TypeScript, Supabase",
    href: "https://github.com/avvi-mee/Sukyoo-App",
    points: [
      "Senior app with big buttons, adjustable text and a call-for-care button, plus a family app, web app and admin panel in one monorepo.",
      "15 database migrations, 6 edge functions and 155 automated tests running in CI.",
    ],
  },
  {
    name: "GramToon Studio",
    what: "Local AI pipeline for animated Hindi cartoons",
    stack: "Python, Ollama, ComfyUI, n8n, FFmpeg",
    href: "https://github.com/avvi-mee/gramtoon",
    points: [
      "Turns an idea into a 1080p episode: story, rigged characters, voices with lip-sync, animation and render, orchestrated by n8n workflows.",
      "Runs on a 6 GB laptop GPU and renders 74 seconds of video in 72 seconds.",
    ],
  },
  {
    name: "Interior Studio OS",
    what: "Multi-tenant software for interior design studios",
    stack: "Next.js, TypeScript, Firebase",
    href: "https://github.com/avvi-mee/Interior-designer-operational-system",
    points: [
      "Estimate calculator, sales pipeline, contracts with signing, vendors and analytics, with separate data per studio.",
    ],
  },
  {
    name: "Peer Review Arena",
    what: "Reinforcement learning environment for AI code review",
    stack: "Python, FastAPI, Docker",
    href: "https://github.com/avvi-mee/unmatrix-openenv",
    points: [
      "Two AI agents review the same code, then learn from each other's findings; live demo on Hugging Face Spaces.",
    ],
  },
];

const skills = [
  ["Languages", "TypeScript, JavaScript, Python, SQL"],
  ["Frontend and mobile", "React, Next.js, Expo / React Native, Tailwind CSS"],
  ["Backend and data", "FastAPI, Node.js, Supabase, PostgreSQL, Firebase"],
  ["AI and automation", "LLM APIs, n8n, Ollama, Whisper, ComfyUI, FFmpeg"],
  ["Shipping", "Git, GitHub Actions, Vercel, Docker, automated testing"],
];

export default function ResumePage() {
  return (
    <main className="sheet-wrap wrap pb-20 pt-24 sm:pt-28">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="ulink text-[0.9375rem] text-graphite hover:text-ink"
        >
          Back to portfolio
        </Link>
        <a
          href="/aviraj-patil-resume.pdf"
          download
          className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[0.875rem] font-semibold text-[#1b1d22] transition-transform duration-300 hover:-translate-y-0.5"
        >
          Download PDF
          <DownloadIcon />
        </a>
      </div>

      {/* The sheet is a fixed A4 page: same layout on screen, in print and in the PDF. */}
      <div className="sheet-frame">
        <article className="sheet">
          <header>
            <h1 className="sheet-name">Aviraj Patil</h1>
            <p className="sheet-role">
              Full-stack developer and B.Tech CSE (AI &amp; ML) student, Pune
            </p>
            <ul className="sheet-contact">
              {contact.map((c) => (
                <li key={c.label}>
                  <a href={c.href}>{c.label}</a>
                </li>
              ))}
            </ul>
          </header>

          <section>
            <h2>Summary</h2>
            <p>
              I build complete products on my own: database, backend, web and
              mobile apps, AI features and deployment. I have shipped 25+
              projects, from a gym app with payments and CI to local AI video
              pipelines.
            </p>
          </section>

          <section>
            <h2>Education</h2>
            <div className="sheet-row">
              <p>
                <strong>
                  B.Tech, Computer Science and Engineering (AI &amp; ML)
                </strong>
                , JSPM, Wagholi, Pune
              </p>
              <p className="sheet-muted">2025 to 2029</p>
            </div>
          </section>

          <section>
            <h2>Projects</h2>
            <div className="sheet-projects">
              {projects.map((p) => (
                <div key={p.name}>
                  <div className="sheet-row">
                    <p>
                      <a href={p.href}>
                        <strong>{p.name}</strong>
                      </a>
                      <span className="sheet-muted">, {p.what}</span>
                    </p>
                    <p className="sheet-muted">{p.stack}</p>
                  </div>
                  <ul>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="sheet-also">
              Also built: PODSYU (podcast to YouTube Shorts with speaker
              tracking and word-synced captions), MedFlow (six-agent blood
              report analysis) and ARIA (AI banking assistant over chat, voice
              and SMS).
            </p>
          </section>

          <section>
            <h2>Skills</h2>
            <dl className="sheet-skills">
              {skills.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>
      </div>
    </main>
  );
}
