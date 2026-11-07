import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import WorkStage from "@/components/WorkStage";
import Footer from "@/components/Footer";

const journey = [
  { year: "2025", text: "Started B.Tech in Computer Science (AI & ML) at JSPM, Wagholi, Pune." },
  { year: "2026", text: "PSBs Hackathon (IDEA 2.0): built ARIA, an AI banking assistant that works over chat, voice and SMS." },
  { year: "2026", text: "Meta OpenEnv hackathon: built Peer Review Arena and MisInfo Arena, two reinforcement learning environments." },
  { year: "2026", text: "Smart India Hackathon: built VASP Trace for problem statement SIH26182." },
];

const skills = [
  { group: "Languages", items: "TypeScript, JavaScript, Python, SQL" },
  { group: "Web and mobile", items: "React, Next.js, Expo / React Native, Tailwind CSS" },
  { group: "Backend and data", items: "FastAPI, Node.js, Supabase, Postgres, Firebase" },
  { group: "AI", items: "LLM APIs, Ollama, Whisper, Stable Diffusion, RL environments" },
  { group: "Shipping", items: "Git, GitHub Actions, Vercel, Docker, automated tests" },
];

export default function Home() {
  return (
    <main>
      <Hero />

      <section id="work" className="scroll-mt-14 pt-24 sm:pt-36">
        <div className="wrap">
          <h2 className="h2">Selected work</h2>
          <p className="lead mt-5 max-w-[40ch] text-graphite">
            Five projects from 2026. Scroll through them, or open one to read how it was built.
          </p>
        </div>
        <WorkStage />
        <div className="wrap pt-10 lg:pt-6">
          <p className="max-w-[56ch] text-[0.9375rem] text-graphite">
            There are 20 more projects on GitHub, including an automated Hindi cartoon studio and a tool that turns
            podcasts into Shorts.{" "}
            <a href="https://github.com/avvi-mee" target="_blank" rel="noreferrer" className="ulink font-medium text-ink">
              See everything on GitHub
            </a>
          </p>
        </div>
      </section>

      <section id="about" className="scroll-mt-14 pt-32 sm:pt-48">
        <div className="wrap">
          <Statement />

          <div className="mt-24 grid gap-16 sm:mt-32 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="h3">So far</h2>
              <ol className="mt-8 border-l border-line">
                {journey.map((j) => (
                  <li key={j.text} className="relative pb-8 pl-6 last:pb-0">
                    <span className="absolute -left-[4.5px] top-[0.45rem] h-2 w-2 rounded-full bg-neel" aria-hidden />
                    <p className="text-[0.9375rem] font-medium">{j.year}</p>
                    <p className="mt-1 leading-relaxed text-graphite">{j.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <h2 className="h3">What I work with</h2>
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {skills.map((s) => (
                  <div key={s.group} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
                    <dt className="text-[0.9375rem] font-medium">{s.group}</dt>
                    <dd className="leading-relaxed text-graphite sm:col-span-2">{s.items}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
