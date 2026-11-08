import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import WorkStage from "@/components/WorkStage";
import Footer from "@/components/Footer";

const facts = [
  { label: "Studying", text: "B.Tech in Computer Science (AI & ML) at JSPM, Wagholi, Pune. 2025 to 2029, now in second year." },
  { label: "Building", text: "Products under UNMATRIX, my own studio for apps and AI tools." },
  { label: "Looking for", text: "An internship where I can ship real features to real users." },
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
          <h2 className="h2">My projects</h2>
          <p className="lead mt-5 max-w-[40ch] text-graphite">
            Scroll through them, or open one to read how it was built.
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
              <h2 className="h3">Right now</h2>
              <dl className="mt-8 space-y-7">
                {facts.map((f) => (
                  <div key={f.label} className="border-l-2 border-accent pl-5">
                    <dt className="text-[0.9375rem] font-medium">{f.label}</dt>
                    <dd className="mt-1 leading-relaxed text-graphite">{f.text}</dd>
                  </div>
                ))}
              </dl>
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
