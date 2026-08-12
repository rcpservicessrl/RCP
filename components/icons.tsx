import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number | undefined) => ({
  width: size ?? 20,
  height: size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export function SearchIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}

export function SunIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></svg>;
}

export function MoonIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M21 13.2A8.3 8.3 0 1 1 10.8 3a6.5 6.5 0 0 0 10.2 10.2Z" /></svg>;
}

export function MusicIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></svg>;
}

export function GlobeIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>;
}

export function MenuIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

export function CloseIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function ArrowIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function ChevronIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="m8 10 4 4 4-4" /></svg>;
}

export function PortalIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 12h10M15 8l4 4-4 4" /></svg>;
}

export function CheckIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="m5 12 4 4L19 6" /></svg>;
}

export function PlusIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M12 5v14M5 12h14" /></svg>;
}

export function VolumeIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></svg>;
}

export function PauseIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M9 5v14M15 5v14" /></svg>;
}

export function PlayIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="m8 5 11 7-11 7V5Z" /></svg>;
}

export function ShieldIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="M12 3 5 6v5c0 4.6 2.9 8.2 7 10 4.1-1.8 7-5.4 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
}

export function LayersIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>;
}

export function SparkIcon({ size, ...props }: IconProps) {
  return <svg {...base(size)} {...props}><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></svg>;
}
