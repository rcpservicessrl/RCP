"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./interior-motion.module.css";

const revealSelector = [
  ":scope > section > .container",
  ":scope > article > header > .container",
  ":scope > article > section > .container",
  ":scope > div > section > .container",
  "section article",
  "section aside",
  "section form",
  "section ol > li",
].join(",");

const surfaceSelector = [
  "section article",
  "section aside",
  "section form",
].join(",");

export function InteriorMotion({ children, language }: { children: ReactNode; language: string }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(root.querySelectorAll<HTMLElement>(revealSelector));
    const surfaces = Array.from(root.querySelectorAll<HTMLElement>(surfaceSelector));

    surfaces.forEach((surface) => surface.setAttribute("data-interior-surface", ""));

    if (reducedMotion || !("IntersectionObserver" in window)) {
      root.dataset.motionReady = "reduced";
      return;
    }

    const viewportThreshold = window.innerHeight * 0.94;
    revealItems.forEach((item) => {
      item.setAttribute("data-interior-reveal", "");
      const siblingIndex = item.parentElement
        ? Array.from(item.parentElement.children).indexOf(item)
        : 0;
      item.style.setProperty("--interior-stagger", String(Math.min(Math.max(siblingIndex, 0), 5)));

      if (item.getBoundingClientRect().top <= viewportThreshold) {
        item.setAttribute("data-interior-visible", "");
      }
    });

    root.dataset.motionReady = "true";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-interior-visible", "");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    revealItems.forEach((item) => {
      if (!item.hasAttribute("data-interior-visible")) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <main
      className={styles.root}
      data-route={pathname}
      key={pathname}
      lang={language}
      ref={rootRef}
    >
      <div className={styles.ambient} aria-hidden="true">
        <span />
        <span />
      </div>
      <div className={styles.routeSignal} aria-hidden="true" />
      {children}
    </main>
  );
}
