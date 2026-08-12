"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { MusicIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/icons";
import { useRcpAudio } from "@/components/audio-provider";

interface MusicControlProps {
  locale: Locale;
  compact?: boolean;
}

export function MusicControl({ locale, compact = false }: MusicControlProps) {
  const [expanded, setExpanded] = useState(false);
  const { playing, volume, toggle, setVolume } = useRcpAudio();

  const status = locale === "es" ? (playing ? "Pausar ambiente" : "Activar ambiente") : playing ? "Pause ambience" : "Play ambience";

  return (
    <div className={`music-control ${expanded ? "is-expanded" : ""} ${compact ? "is-compact" : ""}`}>
      <button
        type="button"
        className="utility-button music-control__toggle"
        onClick={() => void toggle()}
        onContextMenu={(event) => {
          event.preventDefault();
          setExpanded((current) => !current);
        }}
        aria-label={status}
        title={`${status} · ${locale === "es" ? "clic derecho para volumen" : "right click for volume"}`}
      >
        <MusicIcon size={17} />
        <span className={`music-bars ${playing ? "is-playing" : ""}`} aria-hidden="true"><i /><i /><i /></span>
      </button>
      <button
        type="button"
        className="music-control__expand"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        aria-label={locale === "es" ? "Ajustar volumen" : "Adjust volume"}
      >
        {playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
      </button>
      {expanded && (
        <div className="music-control__popover">
          <VolumeIcon size={16} />
          <input
            type="range"
            min="0"
            max="0.45"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label={locale === "es" ? "Volumen de música" : "Music volume"}
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
      )}
    </div>
  );
}
