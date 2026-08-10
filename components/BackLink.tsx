import Link from "next/link";

// Small back button pinned top-left, styled like the hour-aware pills.
export function BackLink({ href = "/", label = "back to the meadow" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="glass-pill fixed top-4 left-4 z-40 inline-flex items-center gap-1.5 hand text-lg text-ink-soft hover:text-ink
                 backdrop-blur-sm border border-ink/10 rounded-full px-4 py-1.5 shadow-[2px_4px_14px_rgba(46,59,46,0.12)]
                 hover:-translate-y-0.5 transition-transform"
    >
      ← {label}
    </Link>
  );
}
