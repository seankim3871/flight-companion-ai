import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Top navigation bar with branding and theme control.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {/* Minimal plane icon */}
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white"
            aria-hidden
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white sm:text-base">
            Flight Companion AI
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
