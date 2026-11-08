const links = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/avvimee" },
  { label: "GitHub", href: "https://github.com/avvi-mee" },
  { label: "UNMATRIX", href: "https://unmatrix.in" },
];

export default function Footer() {
  return (
    <footer id="contact" className="wrap mt-32 border-t border-line pb-12 pt-20 sm:mt-48 sm:pt-28">
      <h2 className="h2">Get in touch</h2>
      <p className="lead mt-5 max-w-[42ch] text-graphite">
        Building something, want to work with UNMATRIX, or just want to talk tech? Reach me directly.
      </p>

      <div className="mt-10 flex flex-col gap-3">
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

      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem] font-medium">
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="ulink">
            {l.label}
          </a>
        ))}
        <a href="/aviraj-patil-resume.pdf" download className="ulink">
          Download resume
        </a>
      </div>
      <p className="mt-20 text-sm text-graphite">© 2026 Aviraj Patil, founder of UNMATRIX. Pune, India.</p>
    </footer>
  );
}
