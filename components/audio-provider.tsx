"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { readPreference, writePreference } from "@/lib/browser-preferences";

interface AudioContextValue {
  playing: boolean;
  volume: number;
  toggle: () => Promise<void>;
  setVolume: (value: number) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.18);

  useEffect(() => {
    const storedVolume = Number.parseFloat(readPreference("rcp-music-volume") ?? "0.18");
    const safeVolume = Number.isFinite(storedVolume) ? Math.min(0.45, Math.max(0, storedVolume)) : 0.18;
    const storedTime = Number.parseFloat(readPreference("rcp-music-time") ?? "0");
    const audio = new Audio("/Fondo%20Tech%20Emotivo.mp3");
    audio.loop = true;
    audio.preload = "metadata";
    audio.volume = safeVolume;
    setVolumeState(safeVolume);
    audioRef.current = audio;

    const restoreTime = () => {
      if (Number.isFinite(storedTime) && storedTime > 0 && Number.isFinite(audio.duration) && storedTime < audio.duration) audio.currentTime = storedTime;
    };
    const persistTime = () => {
      if (Number.isFinite(audio.currentTime)) writePreference("rcp-music-time", String(Math.round(audio.currentTime * 10) / 10));
    };
    const handleVisibility = () => {
      if (document.hidden && !audio.paused) {
        audio.pause();
        persistTime();
        writePreference("rcp-music-playing", "false");
        setPlaying(false);
      }
    };

    audio.addEventListener("loadedmetadata", restoreTime, { once: true });
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", persistTime);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", persistTime);
      persistTime();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        writePreference("rcp-music-playing", "true");
        setPlaying(true);
      } catch {
        writePreference("rcp-music-playing", "false");
        setPlaying(false);
      }
      return;
    }
    audio.pause();
    writePreference("rcp-music-time", String(Math.round(audio.currentTime * 10) / 10));
    writePreference("rcp-music-playing", "false");
    setPlaying(false);
  }, []);

  const setVolume = useCallback((value: number) => {
    const safeVolume = Math.min(0.45, Math.max(0, value));
    setVolumeState(safeVolume);
    writePreference("rcp-music-volume", String(safeVolume));
    if (audioRef.current) audioRef.current.volume = safeVolume;
  }, []);

  const context = useMemo(() => ({ playing, volume, toggle, setVolume }), [playing, setVolume, toggle, volume]);
  return <AudioContext.Provider value={context}>{children}</AudioContext.Provider>;
}

export function useRcpAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useRcpAudio must be used within AudioProvider");
  return context;
}
