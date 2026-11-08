export type Project = {
  slug: string;
  name: string;
  line: string;
  context: string;
  stack: string[];
  github: string;
  live?: { label: string; href: string };
  problem: string;
  built: string[];
  how: string;
  artifact: "katori" | "vasp" | "sukyoo" | "arena" | "interior";
};

export const projects: Project[] = [
  {
    slug: "katori",
    name: "Katori",
    line: "The all-in-one app for gym freaks: food, workouts, habits and a coach in your pocket.",
    context: "Gym and fitness app",
    stack: ["Expo", "React Native", "TypeScript", "Supabase", "Deno"],
    github: "https://github.com/avvi-mee/katori",
    problem:
      "Serious gym-goers in India juggle four apps: one for calories that doesn't know dal or roti, one for workouts, one for habits, and a WhatsApp chat with their trainer. Nothing connects, so most people stop tracking within weeks.",
    built: [
      "Snap your thali and confirm portions in two taps. The AI names the dishes; calories come from a reviewed Indian food table, so the numbers are never a guess.",
      "A workout logger that works offline in the gym, with estimated one-rep max and progression hints for every lift.",
      "Steps and runs, habits like water, sleep and smoking, body measurements, and one daily score that rolls it all up.",
      "Coach personas that keep you going, and a trainer mode where real coaches review client meals and bill per client.",
      "Challenges and referrals with friends, Razorpay subscriptions and a Telegram bot for logging meals from chat.",
    ],
    how:
      "Row-level security on every database table, with automated tests that run the migrations. GitHub Actions runs type checks and tests on every push.",
    artifact: "katori",
  },
  {
    slug: "vasp-trace",
    name: "VASP Trace",
    line: "Traces an unknown crypto wallet to the exchange behind it.",
    context: "Crypto investigation tool",
    stack: ["Python", "FastAPI", "Next.js", "NetworkX", "Postgres"],
    github: "https://github.com/avvi-mee/vasp_tracker",
    problem:
      "When money from a cybercrime lands in a crypto wallet, investigators need to know which exchange holds the KYC for it. Doing that by hand means following transactions across many hops and chains.",
    built: [
      "Paste a wallet address and it follows the money across up to 12 hops on six chains: Ethereum, Polygon, Tron, Solana, Bitcoin and BNB Chain.",
      "Names the nearest exchange it can attribute, how confident it is, and the evidence behind it.",
      "Risk checks for sanctions, mixers and five laundering patterns, with sanctions screening from three sources.",
      "Produces a court-format evidence pack and drafts the legal request an officer would send to the exchange.",
    ],
    how:
      "A ranked multi-hop search instead of one greedy path. Labels come from three sources in a fixed confidence order, and an address nothing can name is reported as unattributed, never as clean.",
    artifact: "vasp",
  },
  {
    slug: "sukyoo",
    name: "Sukyoo",
    line: "One app for senior citizens and the families who look after them.",
    context: "Mobile and web app",
    stack: ["Expo", "Next.js", "TypeScript", "Supabase"],
    github: "https://github.com/avvi-mee/Sukyoo-App",
    live: { label: "Open the web app", href: "https://web-neon-rho-83.vercel.app" },
    problem:
      "Older people in India juggle separate apps for doctors, medicines, shopping and staying in touch, and most of those apps aren't built for weaker eyesight or shaky hands.",
    built: [
      "A senior app with big buttons, adjustable text size and a one-tap button to call for care, plus a separate family app for the people who help them.",
      "Doctor booking and health records, shopping, local events and trips, video calls and entertainment in one place.",
      "A web app and an admin panel from the same monorepo.",
    ],
    how:
      "One codebase for four apps, backed by 15 database migrations, 6 edge functions and 155 automated tests that run in CI.",
    artifact: "sukyoo",
  },
  {
    slug: "peer-review-arena",
    name: "Peer Review Arena",
    line: "Two AI agents review the same code, then learn from each other.",
    context: "AI research environment",
    stack: ["Python", "FastAPI", "Docker", "OpenEnv"],
    github: "https://github.com/avvi-mee/unmatrix-openenv",
    live: { label: "Try the live demo", href: "https://huggingface.co/spaces/avvi-mee/peer-review-arena" },
    problem:
      "Good code reviewers don't just find bugs. They notice what a colleague caught that they missed, and get better from it. Most AI training environments only score one agent in isolation.",
    built: [
      "A reinforcement learning environment where two agents review the same code for bugs, security holes or design flaws.",
      "After the first round they see each other's findings and review again, so the agent is rewarded both for catching what the other missed and for learning from it.",
      "Watch mode to see two agents compete live, and play mode where you take on the AI yourself.",
    ],
    how:
      "A FastAPI server runs the match as a state machine (round one, cross-review, round two, finished) with three tasks and their own graders, packaged in Docker for Hugging Face Spaces.",
    artifact: "arena",
  },
  {
    slug: "interior-studio-os",
    name: "Interior Studio OS",
    line: "Runs an interior design business, from first estimate to signed contract.",
    context: "Business software",
    stack: ["Next.js", "TypeScript", "Firebase"],
    github: "https://github.com/avvi-mee/Interior-designer-operational-system",
    live: { label: "Open the live site", href: "https://interior-studio-7uv3.vercel.app" },
    problem:
      "Small interior design studios quote prices by hand, track leads in WhatsApp and lose track of vendors and contracts. Every studio needs the same tools but can't afford custom software.",
    built: [
      "A public estimate calculator that prices a home by city, materials and area.",
      "A dashboard for each studio with a sales pipeline, lead temperature by budget, contracts with signing, vendors and analytics.",
      "Client access, employee logins and a super-admin panel that approves new studios.",
    ],
    how:
      "Multi-tenant: every studio's data is kept separate, and the three portals live in one Next.js app as separate route groups.",
    artifact: "interior",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
