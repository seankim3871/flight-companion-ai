/**
 * Simple site footer.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/5 px-4 py-8 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-500 sm:px-6">
      <p>Flight Companion AI — Live flight data powered by AeroDataBox.</p>
      <p className="mt-1">© {new Date().getFullYear()} Flight Companion AI</p>
    </footer>
  );
}
