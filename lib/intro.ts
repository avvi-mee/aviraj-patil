"use client";

import { useSyncExternalStore } from "react";

export const INTRO_EVENT = "intro:done";

const subscribe = (cb: () => void) => {
  window.addEventListener(INTRO_EVENT, cb);
  return () => window.removeEventListener(INTRO_EVENT, cb);
};
const isDone = () => document.documentElement.dataset.intro === "done";

// True once the welcome screen has finished (or was skipped because it already played this visit).
export function useIntroDone() {
  return useSyncExternalStore(subscribe, isDone, () => false);
}

export function finishIntro() {
  document.documentElement.dataset.intro = "done";
  try {
    sessionStorage.setItem("intro-seen", "1");
  } catch {
    // Storage blocked: the intro simply plays again on the next full reload.
  }
  window.dispatchEvent(new Event(INTRO_EVENT));
}
