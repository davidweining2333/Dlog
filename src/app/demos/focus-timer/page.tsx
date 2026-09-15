"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "专注 25", minutes: 25 },
  { label: "短休 5", minutes: 5 },
  { label: "深度 50", minutes: 50 },
] as const;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function FocusTimerPage() {
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const endAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<(() => void) | null>(null);

  const progress = useMemo(() => {
    const total = durationMinutes * 60;
    return total === 0 ? 0 : ((total - secondsLeft) / total) * 100;
  }, [durationMinutes, secondsLeft]);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    tickRef.current = () => {
      if (endAtRef.current === null) {
        return;
      }
      const remainMs = endAtRef.current - Date.now();
      const remain = Math.max(0, Math.ceil(remainMs / 1000));
      setSecondsLeft(remain);

      if (remain <= 0) {
        endAtRef.current = null;
        setRunning(false);
        setSessions((value) => value + 1);
        stopLoop();
        return;
      }
      rafRef.current = requestAnimationFrame(() => tickRef.current?.());
    };
  }, [stopLoop]);

  useEffect(() => {
    if (!running) {
      stopLoop();
      return;
    }

    endAtRef.current = Date.now() + secondsLeft * 1000;
    rafRef.current = requestAnimationFrame(() => tickRef.current?.());

    return () => {
      stopLoop();
    };
  }, [running, stopLoop]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) {
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        setRunning((value) => !value);
      }
      if (event.key.toLowerCase() === "r") {
        setRunning(false);
        setSecondsLeft(durationMinutes * 60);
        endAtRef.current = null;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [durationMinutes]);

  function applyPreset(minutes: number) {
    setRunning(false);
    endAtRef.current = null;
    setDurationMinutes(minutes);
    setSecondsLeft(minutes * 60);
  }

  function reset() {
    setRunning(false);
    endAtRef.current = null;
    setSecondsLeft(durationMinutes * 60);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Badge variant="secondary">Demo · Focus Timer</Badge>
      <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">专注计时器</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        低干扰番茄钟。空格开始/暂停，R 重置。适合放在第二屏，用键盘快速切换状态。
      </p>

      <div className="mt-12 rounded-3xl border bg-card p-8 shadow-sm sm:p-12">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.minutes)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                durationMinutes === preset.minutes && !running
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="font-mono text-7xl font-bold tracking-tight sm:text-8xl">
            {formatTime(secondsLeft)}
          </div>
          <div className="mx-auto mt-8 h-2 w-full max-w-md overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            已完成 {sessions} 个会话
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            className={cn(buttonVariants({ size: "lg" }), "min-w-36")}
          >
            {running ? (
              <>
                <Pause className="size-4" /> 暂停
              </>
            ) : (
              <>
                <Play className="size-4" /> 开始
              </>
            )}
          </button>
          <button
            type="button"
            onClick={reset}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <RotateCcw className="size-4" /> 重置
          </button>
        </div>
      </div>
    </div>
  );
}
