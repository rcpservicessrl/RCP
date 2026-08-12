"use client";

import Image from "next/image";

export type PulsoScene = "idle" | "progress" | "present" | "analyze" | "consider";

interface PulsoProps {
  scene?: PulsoScene;
  size?: "small" | "medium" | "large";
  interactive?: boolean;
  label?: string;
  className?: string;
}

const sceneConfig: Record<PulsoScene, { src: string; position: string }> = {
  idle: { src: "/assets/brand/mascot/pulso-presenta-v1.png", position: "center bottom" },
  progress: { src: "/assets/brand/mascot/pulso-avanza-v1.png", position: "center bottom" },
  present: { src: "/assets/brand/mascot/pulso-presenta-v1.png", position: "center bottom" },
  analyze: { src: "/assets/brand/mascot/pulso-orienta-v1.png", position: "center bottom" },
  consider: { src: "/assets/brand/mascot/pulso-orienta-v1.png", position: "center bottom" },
};

export function Pulso({
  scene = "idle",
  size = "medium",
  interactive = false,
  label,
  className = "",
}: PulsoProps) {
  const config = sceneConfig[scene];

  return (
    <figure
      className={`pulso pulso--${scene} pulso--${size} ${interactive ? "pulso--interactive" : ""} ${className}`}
      data-pulso-scene={scene}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <span className="pulso__frame">
        <Image
          className="pulso__image"
          src={config.src}
          alt=""
          fill
          sizes={size === "large" ? "310px" : size === "medium" ? "200px" : "90px"}
          style={{ objectPosition: config.position }}
        />
      </span>
      {label && <figcaption className="sr-only">{label}</figcaption>}
    </figure>
  );
}
