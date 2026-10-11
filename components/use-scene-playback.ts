"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

/** Animate only scenes on screen, with an explicit pause and motion preference. */
export function useScenePlayback(setIndex: Dispatch<SetStateAction<number>>, count: number, delay = 6500) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const stop = () => { if (timer !== undefined) clearInterval(timer); timer = undefined; };
    const sync = () => {
      stop();
      if (playing && visible && !document.hidden && !preference.matches) {
        timer = setInterval(() => setIndex(index => (index + 1) % count), delay);
      }
    };
    const onPreference = () => { if (preference.matches) setPlaying(false); sync(); };
    if (preference.matches) setPlaying(false);
    const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; sync(); }, { threshold: .25 });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", onPreference);
    return () => { stop(); observer.disconnect(); document.removeEventListener("visibilitychange", sync); preference.removeEventListener("change", onPreference); };
  }, [count, delay, playing, setIndex]);
  return { rootRef, playing, toggle: () => setPlaying(value => !value), pause: () => setPlaying(false) };
}
