import {
  siBlender,
  siDocker,
  siExpo,
  siFastapi,
  siFfmpeg,
  siFirebase,
  siGit,
  siGithubactions,
  siJavascript,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siOllama,
  siPostgresql,
  siPython,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

export type Level = "Strong" | "Proficient" | "Familiar";

// Levels reflect how much each tool shows up in shipped projects on GitHub.
const list: [SimpleIcon, string, Level][] = [
  [siTypescript, "TypeScript", "Strong"],
  [siJavascript, "JavaScript", "Strong"],
  [siPython, "Python", "Strong"],
  [siReact, "React", "Strong"],
  [siNextdotjs, "Next.js", "Strong"],
  [siTailwindcss, "Tailwind CSS", "Strong"],
  [siSupabase, "Supabase", "Strong"],
  [siVercel, "Vercel", "Strong"],
  [siExpo, "Expo / React Native", "Proficient"],
  [siNodedotjs, "Node.js", "Proficient"],
  [siFastapi, "FastAPI", "Proficient"],
  [siPostgresql, "PostgreSQL", "Proficient"],
  [siFirebase, "Firebase", "Proficient"],
  [siGit, "Git", "Strong"],
  [siGithubactions, "GitHub Actions", "Proficient"],
  [siOllama, "Ollama", "Proficient"],
  [siFfmpeg, "FFmpeg", "Proficient"],
  [siDocker, "Docker", "Familiar"],
  [siN8n, "n8n", "Strong"],
  [siBlender, "Blender", "Familiar"],
];

// Near-black brand colours (Next.js, Vercel, Ollama, Expo) would vanish on a dark page; those use the text colour.
const isDark = (hex: string) => {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
};

export const skills = list.map(([icon, name, level]) => ({
  name,
  level,
  path: icon.path,
  color: isDark(icon.hex) ? "var(--ink)" : `#${icon.hex}`,
}));
