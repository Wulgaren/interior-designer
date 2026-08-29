import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="shell flex flex-1 flex-col justify-center px-6 py-16">
      <p className="font-display text-3xl font-semibold tracking-tight text-[var(--clay)]">
        Homiq
      </p>
      <h1 className="mt-6 max-w-sm font-display text-2xl font-medium leading-snug text-[var(--ink)]">
        Jesteś offline
      </h1>
      <p className="mt-3 max-w-sm text-base leading-relaxed text-[var(--ink-muted)]">
        Brak połączenia. Gdy wrócisz do sieci, odśwież stronę albo wróć do
        listy pomieszczeń.
      </p>
      <Link href="/pomieszczenia" className="btn-primary mt-10 w-fit">
        Moje pomieszczenia
      </Link>
    </main>
  );
}
