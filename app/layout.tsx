import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll, { Motion } from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Intro from "@/components/Intro";
import Aurora from "@/components/Aurora";

const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aviraj Patil",
  description:
    "Second-year B.Tech CSE (AI & ML) student at JSPM, Pune. I build complete products: apps, backends and AI tools.",
  openGraph: {
    title: "Aviraj Patil",
    description: "Projects by Aviraj Patil, B.Tech CSE (AI & ML), JSPM, Pune.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1013" },
  ],
};

// Runs before first paint: if the welcome screen already played this visit, hide it straight away.
const introCheck = `try{if(sessionStorage.getItem("intro-seen"))document.documentElement.dataset.intro="done"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introCheck }} />
        <noscript>
          <style>{`#intro{display:none!important}html{overflow:auto!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-svh">
        <Aurora />
        <Motion>
          <Intro />
          <SmoothScroll />
          <Nav />
          {children}
        </Motion>
      </body>
    </html>
  );
}
