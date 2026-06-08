import React from "react";
import { Sparkles, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  onOpenDrawer: () => void;
  onNavigateHome: () => void;
}

export default function Header({ onOpenDrawer, onNavigateHome }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6">
      <button
        data-testid="button-home-logo"
        onClick={onNavigateHome}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Sparkles className="text-primary w-6 h-6" />
        <span className="font-bold text-xl tracking-tight">Smart Egypt</span>
      </button>

      <div className="flex items-center gap-4">
        <button
          data-testid="button-toggle-theme"
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          data-testid="button-open-drawer"
          onClick={onOpenDrawer}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
