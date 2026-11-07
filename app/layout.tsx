import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll, { Motion } from "@/components/SmoothScroll";
import Nav from "@/components/Nav";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${grotesk.variable} antialiased`}>
      <body className="min-h-svh">
        <Motion>
          <SmoothScroll />
          <Nav />
          {children}
        </Motion>
      </body>
    </html>
  );
}
