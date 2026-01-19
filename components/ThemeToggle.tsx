"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-5 h-5" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
      }}
      className="relative w-5 h-5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Sun
        className={`absolute inset-0 h-5 w-5 transition-all duration-300 pointer-events-none ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
        strokeWidth={1.5}
      />
      <Moon
        className={`absolute inset-0 h-5 w-5 transition-all duration-300 pointer-events-none ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
        strokeWidth={1.5}
      />
    </button>
  );
}
