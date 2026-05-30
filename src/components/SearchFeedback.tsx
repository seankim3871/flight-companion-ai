interface SearchFeedbackProps {
  message: string;
  variant: "error" | "info";
  /** Shows a spinner when fetching live data */
  isLoading?: boolean;
}

/**
 * Inline alert for search errors, loading, or info states.
 */
export function SearchFeedback({
  message,
  variant,
  isLoading = false,
}: SearchFeedbackProps) {
  const styles =
    variant === "error"
      ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
      : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
      aria-busy={isLoading}
      className={`mx-auto flex max-w-lg animate-fade-in items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm sm:px-6 ${styles}`}
    >
      {isLoading && (
        <span
          className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600 dark:border-slate-600 dark:border-t-sky-400"
          aria-hidden
        />
      )}
      <span>{message}</span>
    </div>
  );
}
