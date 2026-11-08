import { socials } from "./Icons";

export default function Footer() {
  return (
    <footer id="contact" className="wrap mt-32 pb-10 sm:mt-48">
      <div className="glass relative overflow-hidden rounded-[2.5rem] px-6 py-14 sm:px-14 sm:py-20">
        <h2 className="h2 relative">Get in touch</h2>
        <p className="lead relative mt-5 max-w-[42ch] text-graphite">
          Building something, want to work with UNMATRIX, or just want to talk tech? Reach me directly.
        </p>

        <div className="relative mt-10 flex flex-col gap-3">
          <a
            href="mailto:avvi.mee@gmail.com"
            className="ulink w-fit break-all text-[clamp(1.75rem,5.5vw,4rem)] font-semibold tracking-[-0.035em]"
          >
            avvi.mee@gmail.com
          </a>
          <a
            href="tel:+919067923611"
            className="ulink w-fit text-[clamp(1.5rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-graphite hover:text-ink"
          >
            +91 90679 23611
          </a>
        </div>

        <div className="relative mt-12 flex flex-wrap gap-2.5">
          {socials.map(({ label, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="chip h-11 gap-2 px-4 text-[0.875rem] font-semibold transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
          <a
            href="https://unmatrix.in"
            target="_blank"
            rel="noreferrer"
            className="chip h-11 px-4 text-[0.875rem] font-semibold transition-transform duration-300 hover:-translate-y-0.5"
          >
            UNMATRIX
          </a>
          <a
            href="/resume"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[0.875rem] font-semibold text-[#1b1d22] transition-transform duration-300 hover:-translate-y-0.5"
          >
            View resume
          </a>
        </div>
      </div>
      <p className="mt-8 px-2 text-sm text-graphite">© 2026 Aviraj Patil. Pune, India.</p>
    </footer>
  );
}
