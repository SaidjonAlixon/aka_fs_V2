import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeToggleProps = {
  variant?: 'icon' | 'pill';
  className?: string;
};

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={
          variant === 'pill'
            ? `h-10 w-[4.5rem] rounded-full bg-foreground/5 ${className}`
            : `h-10 w-10 ${className}`
        }
        aria-hidden
      />
    );
  }

  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center rounded-full border border-foreground/10 bg-background/90 p-1 shadow-sm backdrop-blur-sm ${className}`}
        role="group"
        aria-label="Theme"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
            !isDark
              ? 'bg-lime text-[#0A0F1A] shadow-[0_0_12px_rgba(184,255,44,0.45)]'
              : 'text-foreground/45 hover:text-foreground'
          }`}
          aria-label="Light mode"
          aria-pressed={!isDark}
        >
          <Sun className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
            isDark
              ? 'bg-lime text-[#0A0F1A] shadow-[0_0_12px_rgba(184,255,44,0.45)]'
              : 'text-foreground/45 hover:text-foreground'
          }`}
          aria-label="Dark mode"
          aria-pressed={isDark}
        >
          <Moon className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative rounded-full border border-foreground/10 p-2 transition-all duration-300 hover:bg-foreground/5 ${className}`}
      aria-label="Toggle theme"
    >
      <div className="relative h-6 w-6">
        <Sun
          className={`absolute inset-0 transition-all duration-500 ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          } text-amber-500`}
        />
        <Moon
          className={`absolute inset-0 transition-all duration-500 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          } text-blue-400`}
        />
      </div>
    </button>
  );
}
