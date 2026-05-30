/**
 * Landing hero with aviation-inspired gradient and copy.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-10 text-center sm:px-6 sm:pt-14 sm:pb-10">
      {/* Soft sky gradient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sky-100/80 via-white to-white dark:from-sky-950/50 dark:via-slate-950 dark:to-slate-950"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-600/10"
        aria-hidden
      />

      <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
        Pickup Planning Mode
      </p>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
        Flight Companion AI
      </h1>

      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
        Enter your flight and home address — we&apos;ll tell you when to leave,
        when to arrive, and how much buffer you have.
      </p>
    </section>
  );
}
