import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import SplitReveal from "@/components/SplitReveal";
import InViewArtifact from "@/components/InViewArtifact";
import Footer from "@/components/Footer";

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

          <dl className="mt-12 grid gap-6 border-t border-line pt-6 text-[0.9375rem] sm:grid-cols-3">
            <div>
              <dt className="text-graphite">Built with</dt>
              <dd className="mt-1">{p.stack.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-graphite">Code</dt>
              <dd className="mt-1">
                <a href={p.github} target="_blank" rel="noreferrer" className="ulink">
                  View on GitHub
                </a>
              </dd>
            </div>
            {p.live && (
              <div>
                <dt className="text-graphite">Try it</dt>
                <dd className="mt-1">
                  <a href={p.live.href} target="_blank" rel="noreferrer" className="ulink text-neel">
                    {p.live.label}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </header>

        <div className="wrap mt-16">
          <div className="rounded-[2.5rem] bg-paper-2">
            <InViewArtifact kind={p.artifact} />
          </div>
        </div>

        <div className="wrap mt-24 space-y-20 sm:mt-32 sm:space-y-28">
          <section className="grid gap-6 md:grid-cols-12">
            <h2 className="h3 md:col-span-4">The problem</h2>
            <p className="max-w-[60ch] text-lg leading-relaxed text-graphite md:col-span-8">{p.problem}</p>
          </section>
          <section className="grid gap-6 md:grid-cols-12">
            <h2 className="h3 md:col-span-4">What I built</h2>
            <ul className="max-w-[60ch] space-y-4 md:col-span-8">
              {p.built.map((b) => (
                <li key={b} className="relative pl-6 text-lg leading-relaxed">
                  <span className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-neel" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </section>
          <section className="grid gap-6 md:grid-cols-12">
            <h2 className="h3 md:col-span-4">How it works</h2>
            <p className="max-w-[60ch] text-lg leading-relaxed text-graphite md:col-span-8">{p.how}</p>
          </section>
        </div>

        <nav aria-label="Next project" className="wrap mt-32 border-t border-line pt-10 sm:mt-40">
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
