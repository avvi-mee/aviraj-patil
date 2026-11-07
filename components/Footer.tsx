export default function Footer() {
  return (
    <footer id="contact" className="wrap mt-32 border-t border-line pb-12 pt-20 sm:mt-48 sm:pt-28">
      <h2 className="h2">Get in touch</h2>
      <p className="lead mt-5 max-w-[42ch] text-graphite">
        Looking for an internship and open to freelance work. Email is the fastest way to reach me.
      </p>
      <a
        href="mailto:avvi.mee@gmail.com"
        className="ulink mt-10 inline-block break-all text-[clamp(1.75rem,5.5vw,4rem)] font-semibold tracking-[-0.035em]"
      >
        avvi.mee@gmail.com
      </a>
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem] font-medium">
        <a href="https://github.com/avvi-mee" target="_blank" rel="noreferrer" className="ulink">
          GitHub
        </a>
        <a href="/aviraj-patil-resume.pdf" download className="ulink">
          Download resume
        </a>
        <a href="https://unmatrix.in" target="_blank" rel="noreferrer" className="ulink">
          UNMATRIX
        </a>
      </div>
      <p className="mt-20 text-sm text-graphite">© 2026 Aviraj Patil, Pune</p>
    </footer>
  );
}
