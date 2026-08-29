"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

import { formatRoomDimensions, useRoomsStore, type Room } from "@/lib/rooms"

import { RoomsHeader } from "./RoomsHeader"
import { useDimensionUnit } from "./useDimensionUnit"

export function RoomList() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [creating, setCreating] = useState(false)
  const [unit] = useDimensionUnit()

  const rooms = useRoomsStore((state) => state.rooms)
  const loading = useRoomsStore((state) => state.loading)
  const hydrated = useRoomsStore((state) => state.hydrated)
  const error = useRoomsStore((state) => state.error)
  const hydrate = useRoomsStore((state) => state.hydrate)
  const createRoom = useRoomsStore((state) => state.createRoom)
  const deleteRoom = useRoomsStore((state) => state.deleteRoom)
  const clearError = useRoomsStore((state) => state.clearError)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const busy = creating || (loading && !hydrated)

  async function handleAdd() {
    if (creating) return
    setCreating(true)
    clearError()
    try {
      const id = await createRoom()
      startTransition(() => {
        router.push(`/pomieszczenia/${id}`)
      })
    } catch {
      setCreating(false)
    }
  }

  async function handleDelete(room: Room) {
    const confirmed = window.confirm(
      `Czy na pewno usunąć „${room.name}”? Tej operacji nie można cofnąć.`,
    )
    if (!confirmed) return
    clearError()
    try {
      await deleteRoom({ id: room.id })
    } catch {
      // Store surfaces error
    }
  }

  return (
    <main className="shell relative flex flex-1 flex-col">
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-8 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
        <RoomsHeader title="Moje pomieszczenia" />

        <div className="fade-in-delay mt-6 flex flex-col gap-4">
          {error ? (
            <p
              role="alert"
              className="border border-[color-mix(in_srgb,var(--clay)_40%,transparent)] bg-[color-mix(in_srgb,var(--charcoal-raised)_80%,transparent)] px-3 py-2 text-sm text-[var(--clay-soft)]"
            >
              {error}
            </p>
          ) : null}

          <button
            type="button"
            className="btn-primary w-full sm:w-auto"
            onClick={() => void handleAdd()}
            disabled={busy || pending}
          >
            {creating || pending ? "Tworzenie…" : "Dodaj pomieszczenie"}
          </button>

          {!hydrated && loading ? (
            <p className="text-sm text-[var(--ink-muted)]">Wczytywanie…</p>
          ) : null}

          {hydrated && rooms.length === 0 ? (
            <div className="fade-in-delay-2 mt-4 border-t border-[var(--line)] pt-8">
              <p className="font-display text-lg text-[var(--ink)]">
                Brak pomieszczeń
              </p>
              <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-[var(--ink-muted)]">
                Dodaj pierwsze pomieszczenie, żeby ustawić wymiary i zobaczyć je
                w podglądzie 3D.
              </p>
            </div>
          ) : null}

          {rooms.length > 0 ? (
            <ul className="fade-in-delay-2 mt-2 divide-y divide-[var(--line)] border-t border-[var(--line)]">
              {rooms.map((room) => (
                <li
                  key={room.id}
                  className="flex items-start justify-between gap-3 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/pomieszczenia/${room.id}`}
                      className="block truncate font-medium text-[var(--ink)] transition-colors hover:text-[var(--clay-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clay-soft)]"
                    >
                      {room.name}
                    </Link>
                    <p className="mt-1 text-sm text-[var(--ink-muted)]">
                      {formatRoomDimensions(room, unit)}
                    </p>
                    <Link
                      href={`/pomieszczenia/${room.id}`}
                      className="mt-2 inline-block text-sm text-[var(--clay)] transition-colors hover:text-[var(--clay-soft)]"
                    >
                      Otwórz
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(room)}
                    className="shrink-0 px-2 py-1 text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--clay-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clay-soft)]"
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </main>
  )
}
