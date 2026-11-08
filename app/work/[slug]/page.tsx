import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import SplitReveal from "@/components/SplitReveal";
import InViewArtifact from "@/components/InViewArtifact";
import Footer from "@/components/Footer";
import { GithubIcon } from "@/components/Icons";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProject(slug);
  return p ? { title: `${p.name} | Aviraj Patil`, description: p.line } : {};
}

export default async function WorkPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <main>
      <article>
        <header className="wrap pt-32 sm:pt-40">
          <Link href="/#work" className="ulink text-[0.9375rem] text-graphite hover:text-ink">
            All work
          </Link>
          <p className="mt-10 text-[0.9375rem] text-graphite">{p.context}</p>
          <h1 className="mt-3 text-[clamp(3.25rem,11vw,8.5rem)] font-bold leading-[0.9] tracking-[-0.055em]">
            <SplitReveal lines={[p.name]} stagger={0.03} />
          </h1>
          <p className="lead mt-8 max-w-[34ch]">{p.line}</p>

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Built with">
            {p.stack.map((s) => (
              <li key={s} className="chip text-graphite">
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {p.live && (
              <a
                href={p.live.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-[0.875rem] font-semibold text-[#1b1d22] transition-transform duration-300 hover:-translate-y-0.5"
              >
                {p.live.label}
              </a>
            )}
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.875rem] font-semibold transition-transform duration-300 hover:-translate-y-0.5"
            >
              <GithubIcon className="h-4 w-4" />
              View the code
            </a>
          </div>
        </header>

        <div className="wrap mt-16">
          <div className="glass rounded-[2.5rem]">
            <InViewArtifact kind={p.artifact} />
          </div>
        </div>

        <div className="wrap mt-16 space-y-4 sm:mt-20">
          <section className="glass grid gap-6 rounded-[2rem] p-6 sm:p-10 md:grid-cols-12">
            <h2 className="h3 md:col-span-4">The problem</h2>
            <p className="max-w-[60ch] text-lg leading-relaxed text-graphite md:col-span-8">{p.problem}</p>
          </section>
          <section className="glass grid gap-6 rounded-[2rem] p-6 sm:p-10 md:grid-cols-12">
            <h2 className="h3 md:col-span-4">What I built</h2>
            <ul className="max-w-[60ch] space-y-4 md:col-span-8">
              {p.built.map((b) => (
                <li key={b} className="relative pl-6 text-lg leading-relaxed">
                  <span className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </section>
          <section className="glass grid gap-6 rounded-[2rem] p-6 sm:p-10 md:grid-cols-12">
            <h2 className="h3 md:col-span-4">How it works</h2>
            <p className="max-w-[60ch] text-lg leading-relaxed text-graphite md:col-span-8">{p.how}</p>
          </section>
        </div>

        <nav aria-label="Next project" className="wrap mt-24 sm:mt-32">
          <p className="text-[0.9375rem] text-graphite">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            className="group mt-2 inline-block text-[clamp(2.25rem,6vw,4.5rem)] font-semibold tracking-[-0.04em]"
          >
            <span className="ulink">{next.name}</span>
          </Link>
        </nav>
      </article>
      <Footer />
    </main>
  );
}
