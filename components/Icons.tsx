import { siGithub } from "simple-icons";

type P = { className?: string };

export function GithubIcon({ className = "h-[18px] w-[18px]" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={siGithub.path} />
    </svg>
  );
}

// Drawn by hand: a rounded square with "in" cut out.
export function LinkedinIcon({ className = "h-[18px] w-[18px]" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="currentColor" />
      <circle cx="7.6" cy="7.4" r="1.7" fill="var(--paper)" />
      <rect x="6.1" y="10" width="3" height="8.4" rx="0.6" fill="var(--paper)" />
      <path
        d="M11.2 10h2.8v1.2c.5-.85 1.55-1.45 2.85-1.45 2.25 0 3.15 1.45 3.15 3.9v4.75h-3v-4.2c0-1.15-.4-1.85-1.4-1.85-1.05 0-1.6.75-1.6 1.95v4.1h-2.8z"
        fill="var(--paper)"
      />
    </svg>
  );
}

export function MailIcon({ className = "h-[18px] w-[18px]" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-[18px] w-[18px]" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 16.5v2.8a2 2 0 0 1-2.2 2 19 19 0 0 1-8.3-3 18.7 18.7 0 0 1-5.8-5.8 19 19 0 0 1-3-8.3A2 2 0 0 1 3.7 2h2.8a2 2 0 0 1 2 1.7c.13.95.37 1.88.7 2.77a2 2 0 0 1-.45 2.1L7.6 9.7a15 15 0 0 0 5.7 5.7l1.13-1.13a2 2 0 0 1 2.1-.45c.89.33 1.82.57 2.77.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

export function DownloadIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
    </svg>
  );
}

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/avvimee", Icon: LinkedinIcon, external: true },
  { label: "GitHub", href: "https://github.com/avvi-mee", Icon: GithubIcon, external: true },
  { label: "Email", href: "mailto:avvi.mee@gmail.com", Icon: MailIcon, external: false },
  { label: "Call", href: "tel:+919067923611", Icon: PhoneIcon, external: false },
];
