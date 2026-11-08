import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import WorkStage from "@/components/WorkStage";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import { GithubIcon } from "@/components/Icons";

const facts = [
  { label: "Building", text: "Katori, a full gym app, and Interior Studio OS, software for design studios." },
  { label: "Studying", text: "B.Tech in Computer Science (AI & ML) at JSPM, Wagholi, Pune. Second year." },
  { label: "Based in", text: "Pune, India." },
];

export default function Home() {
  return (
    <main>
      <Hero />

      <section id="work" className="scroll-mt-20 pt-24 sm:pt-36">
        <div className="wrap">
          <h2 className="h2">My projects</h2>
          <p className="lead mt-5 max-w-[40ch] text-graphite">
            Scroll through them, or open one to read how it was built.
          </p>
        </div>
        <WorkStage />
        <div className="wrap pt-10 lg:pt-6">
          <a
            href="https://github.com/avvi-mee"
            target="_blank"
            rel="noreferrer"
            className="glass inline-flex items-center gap-3 rounded-full py-3 pl-4 pr-5 text-[0.9375rem] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <GithubIcon />
            <span>
              <span className="font-semibold">20 more projects on GitHub</span>
              <span className="text-graphite">, including a Hindi cartoon studio and a podcast-to-Shorts tool</span>
            </span>
          </a>
        </div>
      </section>

      <section id="skills" className="scroll-mt-20 pt-32 sm:pt-48">
        <div className="wrap">
          <h2 className="h2">My skills</h2>
          <p className="lead mt-5 max-w-[44ch] text-graphite">
            Rated by how much I&apos;ve used each one in projects I shipped.
          </p>
          <Skills />
        </div>
      </section>

      <section id="about" className="scroll-mt-20 pt-32 sm:pt-48">
        <div className="wrap">
          <Statement />
          <dl className="mt-16 grid gap-4 sm:mt-24 md:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="glass rounded-[1.75rem] p-6 sm:p-7">
                <dt className="flex items-center gap-2.5 text-[0.9375rem] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                  {f.label}
                </dt>
                <dd className="mt-3 leading-relaxed text-graphite">{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Footer />
    </main>
  );
}
