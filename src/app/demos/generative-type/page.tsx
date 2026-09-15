"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";

const PHRASES = [
  "把想法写下来",
  "再把它做出来",
  "设计是约束的艺术",
  "代码是可执行的判断",
];

export default function GenerativeTypePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [density, setDensity] = useState(18);
  const [jitter, setJitter] = useState(10);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const animRef = useRef<number | null>(null);
  const drawRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    drawRef.current = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0b1020";
      ctx.fillRect(0, 0, width, height);

      const phrase = PHRASES[phraseIndex] ?? PHRASES[0] ?? "Dlog";
      const cell = Math.max(18, Math.floor(width / density));
      const cols = Math.ceil(width / cell) || 1;
      const rows = Math.ceil(height / cell) || 1;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 ${Math.floor(cell * 0.72)}px "PingFang SC", "Microsoft YaHei", sans-serif`;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const char = phrase[(row * cols + col) % phrase.length] ?? "·";
          const nx = col / cols;
          const ny = row / rows;
          const wave = Math.sin(time * 0.001 + nx * 6 + ny * 4);
          const dx = (Math.sin(time * 0.0015 + row * 0.4) * jitter * wave) / 2;
          const dy = (Math.cos(time * 0.0012 + col * 0.35) * jitter * wave) / 2;
          const alpha = 0.25 + ((wave + 1) / 2) * 0.65;
          const hue = 220 + wave * 40;

          ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${alpha})`;
          ctx.fillText(char, col * cell + cell / 2 + dx, row * cell + cell / 2 + dy);
        }
      }

      animRef.current = requestAnimationFrame((nextTime) => drawRef.current?.(nextTime));
    };
  }, [density, jitter, phraseIndex]);

  const startLoop = useCallback(() => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
    }
    animRef.current = requestAnimationFrame((time) => drawRef.current?.(time));
  }, []);

  useEffect(() => {
    startLoop();
    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [startLoop]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <Badge variant="secondary">Demo · Generative Type</Badge>
      <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">生成式排版实验</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        用字符网格采样句子，再用相位扰动制造呼吸感。拖动参数，观察密度与抖动如何改变阅读节奏。
      </p>

      <div className="mt-10 overflow-hidden rounded-3xl border bg-[#0b1020] shadow-sm">
        <canvas ref={canvasRef} className="h-[420px] w-full" aria-label="生成式排版画布" />
      </div>

      <div className="mt-8 grid gap-6 rounded-2xl border bg-card p-6 sm:grid-cols-2">
        <label className="block text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">字符密度</span>
            <span className="text-muted-foreground">{density}</span>
          </div>
          <input
            type="range"
            min={10}
            max={28}
            value={density}
            onChange={(event) => setDensity(Number(event.target.value))}
            className="mt-3 w-full accent-[var(--brand-500)]"
          />
        </label>
        <label className="block text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">扰动强度</span>
            <span className="text-muted-foreground">{jitter}</span>
          </div>
          <input
            type="range"
            min={0}
            max={28}
            value={jitter}
            onChange={(event) => setJitter(Number(event.target.value))}
            className="mt-3 w-full accent-[var(--brand-500)]"
          />
        </label>
        <div className="sm:col-span-2">
          <p className="mb-3 text-sm font-medium">切换语句</p>
          <div className="flex flex-wrap gap-2">
            {PHRASES.map((phrase, index) => (
              <button
                key={phrase}
                type="button"
                onClick={() => setPhraseIndex(index)}
                className={
                  phraseIndex === index
                    ? "rounded-full border border-primary bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                    : "rounded-full border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                }
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
