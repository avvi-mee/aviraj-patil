"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import Artifact from "./Artifacts";
import type { Project } from "@/lib/projects";

export default function InViewArtifact({ kind }: { kind: Project["artifact"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.4 });
  return (
    <div ref={ref} className="mx-auto aspect-square w-full max-w-[38rem] p-[8%]">
      <Artifact kind={kind} play={seen} />
    </div>
  );
}
