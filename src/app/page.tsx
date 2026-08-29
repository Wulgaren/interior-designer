import Link from "next/link";

export default function Home() {
  return (
    <main className="shell relative flex flex-1 flex-col">
      <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-10 pt-16 sm:justify-center sm:px-10 sm:pb-16">
        <div className="mx-auto w-full max-w-lg">
          <p className="fade-in font-display text-[clamp(3.25rem,14vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.03em] text-[var(--ink)]">
            Homiq
          </p>
          <h1 className="fade-in-delay mt-6 max-w-[18ch] text-lg font-medium leading-snug text-[var(--clay-soft)] sm:text-xl">
            Planuj pomieszczenia w skali — prosto z telefonu.
          </h1>
          <p className="fade-in-delay mt-3 max-w-[32ch] text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base">
            Buduj pokoje jako proste bryły, ustawiaj wymiary w centymetrach i
            trzymaj projekty lokalnie na urządzeniu.
          </p>
          <div className="fade-in-delay-2 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/pomieszczenia" className="btn-primary">
              Moje pomieszczenia
            </Link>
            <span className="text-xs tracking-wide text-[var(--ink-muted)] sm:text-sm">
              Faza 1 · tylko pomieszczenia
            </span>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[12%] h-[42%] opacity-[0.35] sm:top-[8%] sm:h-[48%]"
      >
        <div className="absolute left-[8%] top-[18%] h-[58%] w-[42%] border border-[var(--line)]" />
        <div className="absolute right-[10%] top-[8%] h-[72%] w-[36%] border border-[var(--line)]" />
        <div className="absolute left-[28%] top-[42%] h-px w-[48%] bg-[var(--line)]" />
        <div className="absolute left-[48%] top-[18%] h-[55%] w-px bg-[var(--line)]" />
      </div>
    </main>
  );
}
