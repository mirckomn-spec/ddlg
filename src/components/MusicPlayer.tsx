"use client";

import { musicPlayer } from "@/lib/config";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const DEFAULT_VOLUME = 0.425;
const VOLUME_STORAGE_KEY = "ddlg-music-volume";

export type MusicPlayerHandle = {
  playFromUserGesture: () => void;
};

type MusicPlayerProps = {
  visible?: boolean;
};

function readStoredVolume(): number {
  try {
    const stored = parseFloat(localStorage.getItem(VOLUME_STORAGE_KEY) ?? "");
    if (Number.isFinite(stored) && stored >= 0 && stored <= 1) return stored;
  } catch {
    /* indisponível */
  }
  return DEFAULT_VOLUME;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  function MusicPlayer({ visible = false }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const userPausedRef = useRef(false);
    const volumeRef = useRef(DEFAULT_VOLUME);
    const listenersBoundRef = useRef(false);

    const [volume, setVolume] = useState(DEFAULT_VOLUME);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    const audioSrc = musicPlayer.src;

    const displayTitle = musicPlayer.artist
      ? `${musicPlayer.artist} – ${musicPlayer.title}`
      : musicPlayer.title;

    const setAudioVolume = useCallback((audio: HTMLAudioElement) => {
      audio.muted = false;
      audio.volume = volumeRef.current;
    }, []);

    const playAudio = useCallback(
      async (audio: HTMLAudioElement) => {
        setAudioVolume(audio);

        try {
          await audio.play();
          return true;
        } catch {
          try {
            audio.muted = true;
            await audio.play();
            audio.muted = false;
            audio.volume = volumeRef.current;
            return !audio.paused;
          } catch {
            audio.muted = false;
            audio.volume = volumeRef.current;
            return false;
          }
        }
      },
      [setAudioVolume],
    );

    const playFromUserGesture = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;

      userPausedRef.current = false;
      audio.preload = "auto";

      const attempt = () => void playAudio(audio);

      if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        attempt();
        return;
      }

      if (audio.networkState === HTMLMediaElement.NETWORK_EMPTY) {
        audio.load();
      }

      audio.addEventListener("canplay", attempt, { once: true });
    }, [playAudio]);

    useImperativeHandle(ref, () => ({ playFromUserGesture }), [playFromUserGesture]);

    const togglePlay = useCallback(async () => {
      const audio = audioRef.current;
      if (!audio || status === "error") return;

      if (!audio.paused) {
        userPausedRef.current = true;
        audio.pause();
        setIsPlaying(false);
        return;
      }

      userPausedRef.current = false;
      const ok = await playAudio(audio);
      if (!ok && audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        audio.load();
        audio.addEventListener(
          "canplay",
          () => {
            void playAudio(audio);
          },
          { once: true },
        );
      }
    }, [playAudio, status]);

    const handleVolumeChange = useCallback(
      (
        e:
          | React.ChangeEvent<HTMLInputElement>
          | React.FormEvent<HTMLInputElement>,
      ) => {
        const value = Number((e.target as HTMLInputElement).value);
        volumeRef.current = value;
        setVolume(value);

        const audio = audioRef.current;
        if (audio) {
          audio.muted = false;
          audio.volume = value;
        }

        try {
          localStorage.setItem(VOLUME_STORAGE_KEY, String(value));
        } catch {
          /* indisponível */
        }
      },
      [],
    );

    const handleSeek = useCallback(
      (e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const value = Number((e.target as HTMLInputElement).value);
        audio.currentTime = value;
        setCurrentTime(value);
      },
      [],
    );

    useEffect(() => {
      volumeRef.current = readStoredVolume();
      setVolume(volumeRef.current);
    }, []);

    useEffect(() => {
      if (!visible) return;

      const audio = audioRef.current;
      if (!audio || listenersBoundRef.current) return;

      listenersBoundRef.current = true;
      setAudioVolume(audio);

      const markReady = () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
        setStatus("ready");
      };

      let lastUiTick = 0;
      const onTimeUpdate = () => {
        const now = performance.now();
        if (now - lastUiTick < 250) return;
        lastUiTick = now;
        setCurrentTime(audio.currentTime);
      };

      const onPlay = () => {
        setAudioVolume(audio);
        setIsPlaying(true);
      };
      const onPause = () => setIsPlaying(false);
      const onEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      const onError = () => setStatus("error");

      audio.addEventListener("loadedmetadata", markReady);
      audio.addEventListener("canplay", markReady);
      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("play", onPlay);
      audio.addEventListener("pause", onPause);
      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);

      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        markReady();
      }

      return () => {
        listenersBoundRef.current = false;
        audio.removeEventListener("loadedmetadata", markReady);
        audio.removeEventListener("canplay", markReady);
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("play", onPlay);
        audio.removeEventListener("pause", onPause);
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
      };
    }, [visible, setAudioVolume]);

    const progressMax = Math.max(duration, 0.01);
    const isReady = status === "ready";

    return (
      <div className={`music-player${visible ? "" : " music-player--hidden"}`}>
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="none"
          playsInline
        />

        <div className="music-player-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={musicPlayer.cover} alt={`Capa — ${musicPlayer.title}`} />
        </div>

        <div className="music-player-panel">
          <div className="music-player-header">
            <div className="music-player-meta">
              <span className="music-player-status">
                {status === "error"
                  ? "erro ao carregar"
                  : isPlaying
                    ? musicPlayer.statusLabel
                    : isReady
                      ? "pausado"
                      : "carregando..."}
              </span>
              <p className="music-player-track">{displayTitle}</p>
            </div>

            <div
              className={`music-player-visualizer${isPlaying ? " is-active" : ""}`}
              aria-hidden="true"
            >
              {[3, 6, 9, 5, 11, 7, 10, 4].map((h, i) => (
                <span key={i} style={{ "--h": `${h}px` } as CSSProperties} />
              ))}
            </div>
          </div>

          <div className="music-player-controls">
            <button
              type="button"
              className="music-player-play"
              onClick={() => void togglePlay()}
              disabled={status === "error"}
              aria-label={isPlaying ? "Pausar" : "Tocar"}
            >
              {status === "loading" ? (
                <span className="music-player-spinner" />
              ) : isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>

            <div className="music-player-progress-wrap">
              <div
                className="music-player-progress-track"
                style={
                  {
                    "--progress": `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  } as CSSProperties
                }
              >
                <div className="music-player-progress-fill" />
                <div
                  className="music-player-progress-thumb"
                  style={{
                    left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />
              </div>
              <input
                type="range"
                className="music-player-progress-input"
                min={0}
                max={progressMax}
                step={0.01}
                value={Math.min(currentTime, progressMax)}
                onChange={handleSeek}
                onInput={handleSeek}
                disabled={!isReady}
                aria-label="Posição da música"
              />
            </div>

            <span className="music-player-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="music-player-volume">
            <VolumeIcon level={volume} />
            <div className="music-player-volume-track-wrap">
              <div
                className="music-player-volume-track"
                style={{ "--volume": `${volume * 100}%` } as CSSProperties}
              >
                <div className="music-player-volume-fill" />
              </div>
              <input
                type="range"
                className="music-player-volume-input"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                onInput={handleVolumeChange}
                disabled={status === "error"}
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default MusicPlayer;

function VolumeIcon({ level }: { level: number }) {
  const muted = level <= 0.01;
  const low = level > 0.01 && level < 0.35;

  return (
    <svg
      className="music-player-volume-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
      {!muted && (
        <path
          d={
            low
              ? "M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
              : "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
          }
          opacity={low ? 0.35 : 1}
        />
      )}
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}
