"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";

function hslToHex(h: number, s: number, l: number) {
  const sN = s / 100;
  const lN = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) =>
    lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (value: number) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

export default function PaletteLabPage() {
  const [hue, setHue] = useState(256);
  const [saturation, setSaturation] = useState(20);
  const [lightness, setLightness] = useState(52);

  const tokens = useMemo(() => {
    return {
      primary: hslToHex(hue, saturation, lightness),
      primarySoft: hslToHex(hue, Math.max(8, saturation * 0.4), 95),
      background: hslToHex(hue, 8, 99),
      foreground: hslToHex(hue, 12, 18),
      muted: hslToHex(hue, 8, 96),
      mutedForeground: hslToHex(hue, 10, 48),
      darkBackground: hslToHex(hue, 12, 14),
      darkForeground: hslToHex(hue, 10, 94),
      darkPrimary: hslToHex(hue, Math.min(70, saturation + 40), 68),
    };
  }, [hue, saturation, lightness]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <Badge variant="secondary">Demo · Palette Lab</Badge>
      <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">色彩令牌实验室</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        从一个色相出发，生成浅色/深色语义色板。适合在写 Design Tokens 前，先感受“用途色”如何随底层值变化。
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6 rounded-2xl border bg-card p-6">
          {[
            { label: "色相 Hue", value: hue, min: 0, max: 360, onChange: setHue },
            { label: "饱和 Saturation", value: saturation, min: 5, max: 80, onChange: setSaturation },
            { label: "明度 Lightness", value: lightness, min: 30, max: 75, onChange: setLightness },
          ].map((control) => (
            <label key={control.label} className="block text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{control.label}</span>
                <span className="tabular-nums text-muted-foreground">{control.value}</span>
              </div>
              <input
                type="range"
                min={control.min}
                max={control.max}
                value={control.value}
                onChange={(event) => control.onChange(Number(event.target.value))}
                className="mt-3 w-full accent-[var(--brand-500)]"
              />
            </label>
          ))}

          <div className="rounded-xl border bg-muted/40 p-4 text-sm">
            <p className="font-medium">主色</p>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="size-10 rounded-lg border shadow-sm"
                style={{ background: tokens.primary }}
                aria-hidden="true"
              />
              <code className="font-mono text-sm">{tokens.primary}</code>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border overflow-hidden">
            <div className="border-b bg-muted/50 px-5 py-3 text-sm font-medium">Light tokens</div>
            <div
              className="grid gap-4 p-6 sm:grid-cols-2"
              style={{
                background: tokens.background,
                color: tokens.foreground,
              }}
            >
              <div className="rounded-xl border p-4" style={{ borderColor: `${tokens.foreground}22` }}>
                <p className="text-sm opacity-70">background / foreground</p>
                <p className="mt-2 text-2xl font-semibold">界面默认对比</p>
              </div>
              <div className="rounded-xl p-4 text-white" style={{ background: tokens.primary }}>
                <p className="text-sm opacity-90">primary</p>
                <p className="mt-2 text-2xl font-semibold">主要操作</p>
              </div>
              <div className="rounded-xl border p-4" style={{ background: tokens.muted, borderColor: `${tokens.foreground}18` }}>
                <p className="text-sm" style={{ color: tokens.mutedForeground }}>
                  muted
                </p>
                <p className="mt-2 font-medium">次要信息区域</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: tokens.primarySoft, color: tokens.primary }}>
                <p className="text-sm">accent-soft</p>
                <p className="mt-2 font-medium">柔和强调</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden">
            <div className="border-b bg-muted/50 px-5 py-3 text-sm font-medium">Dark tokens</div>
            <div
              className="grid gap-4 p-6 sm:grid-cols-2"
              style={{
                background: tokens.darkBackground,
                color: tokens.darkForeground,
              }}
            >
              <div className="rounded-xl border p-4" style={{ borderColor: `${tokens.darkForeground}22` }}>
                <p className="text-sm opacity-70">dark background</p>
                <p className="mt-2 text-2xl font-semibold">夜间阅读面</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: tokens.darkPrimary, color: tokens.darkBackground }}>
                <p className="text-sm opacity-90">dark primary</p>
                <p className="mt-2 text-2xl font-semibold">强调按钮</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
