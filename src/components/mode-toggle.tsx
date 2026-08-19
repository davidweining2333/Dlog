"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

const choices = [
  { value: "light", label: "浅色", Icon: Sun },
  { value: "dark", label: "深色", Icon: Moon },
  { value: "system", label: "跟随系统", Icon: Monitor },
] as const;

const subscribe = () => () => undefined;

export function ModeToggle() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-lg border bg-card p-1" aria-label="主题设置">
      {choices.map(({ value, label, Icon }) => (
        <Button
          key={value}
          type="button"
          variant={mounted && theme === value ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={mounted && theme === value}
          title={label}
        >
          <Icon className="size-4" aria-hidden="true" />
        </Button>
      ))}
    </div>
  );
}