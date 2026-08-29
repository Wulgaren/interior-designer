import Link from "next/link"

type RoomsHeaderProps = {
  title: string
  backHref?: string
  backLabel?: string
}

export function RoomsHeader({
  title,
  backHref,
  backLabel = "Wróć",
}: RoomsHeaderProps) {
  return (
    <header className="fade-in border-b border-[var(--line)] pb-5">
      <div className="flex items-baseline justify-between gap-4">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--ink)] transition-colors hover:text-[var(--clay-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clay-soft)]"
        >
          Homiq
        </Link>
        {backHref ? (
          <Link
            href={backHref}
            className="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--clay-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clay-soft)]"
          >
            {backLabel}
          </Link>
        ) : null}
      </div>
      <h1 className="mt-4 font-display text-xl font-medium tracking-[-0.02em] text-[var(--clay-soft)] sm:text-2xl">
        {title}
      </h1>
    </header>
  )
}
