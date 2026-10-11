"use client";
import { useEffect, useRef } from "react";

/** Entrance motion enhances content that stays visible without JavaScript. */
export function ExperienceMotion() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = marker.current?.closest("main");
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches) return;
        const animation = entry.target.animate([{ opacity: .65, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0, rootMargin: "0px 0px -8%" });
    root.querySelectorAll("section:not(#inicio) > .container").forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) observer.observe(element);
    });
    const onPreference = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener("change", onPreference);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); preference.removeEventListener("change", onPreference); };
  }, []);
  return <span ref={marker} hidden aria-hidden="true" />;
}
