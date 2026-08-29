"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import type { EditMode } from "@/components/room-scene"
import {
  MAX_DIMENSION_CM,
  MIN_DIMENSION_CM,
  useRoomsStore,
  validateDimensionCm,
  validateRoomName,
  type FieldErrors,
  type RoomWritableFields,
} from "@/lib/rooms"

import { ModeToggle } from "./ModeToggle"
import { RoomsHeader } from "./RoomsHeader"

const RoomCanvas = dynamic(
  () =>
    import("@/components/room-scene/RoomCanvas").then((mod) => mod.RoomCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[280px] items-center justify-center border border-[var(--line)] bg-[color-mix(in_srgb,var(--charcoal-raised)_70%,transparent)] text-sm text-[var(--ink-muted)]"
        style={{ height: "50vh", maxHeight: 640 }}
      >
        Ładowanie podglądu…
      </div>
    ),
  },
)

type Draft = {
  name: string
  lengthCm: string
  widthCm: string
  heightCm: string
}

function roomToDraft(fields: RoomWritableFields): Draft {
  return {
    name: fields.name,
    lengthCm: String(fields.lengthCm),
    widthCm: String(fields.widthCm),
    heightCm: String(fields.heightCm),
  }
}

function parseDimension(raw: string): number {
  const trimmed = raw.trim().replace(",", ".")
  if (trimmed.length === 0) return Number.NaN
  return Number(trimmed)
}

function fieldErrorsForDraft(draft: Draft): FieldErrors {
  const errors: FieldErrors = {}
  const nameError = validateRoomName(draft.name)
  if (nameError) errors.name = nameError

  const lengthError = validateDimensionCm(parseDimension(draft.lengthCm))
  if (lengthError) errors.lengthCm = lengthError

  const widthError = validateDimensionCm(parseDimension(draft.widthCm))
  if (widthError) errors.widthCm = widthError

  const heightError = validateDimensionCm(parseDimension(draft.heightCm))
  if (heightError) errors.heightCm = heightError

  return errors
}

function draftToFields(draft: Draft): RoomWritableFields | null {
  if (Object.keys(fieldErrorsForDraft(draft)).length > 0) return null
  return {
    name: draft.name,
    lengthCm: parseDimension(draft.lengthCm),
    widthCm: parseDimension(draft.widthCm),
    heightCm: parseDimension(draft.heightCm),
  }
}

export function RoomDetail() {
  const params = useParams<{ id: string }>()
  const id = typeof params.id === "string" ? params.id : ""

  const hydrated = useRoomsStore((state) => state.hydrated)
  const loading = useRoomsStore((state) => state.loading)
  const error = useRoomsStore((state) => state.error)
  const hydrate = useRoomsStore((state) => state.hydrate)
  const updateRoom = useRoomsStore((state) => state.updateRoom)
  const clearError = useRoomsStore((state) => state.clearError)

  const room = useRoomsStore((state) =>
    id ? state.rooms.find((item) => item.id === id) : undefined,
  )

  const [mode, setMode] = useState<EditMode>("preview")
  const [draft, setDraft] = useState<Draft | null>(null)
  const [draftRoomId, setDraftRoomId] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (room && draftRoomId !== room.id) {
    setDraftRoomId(room.id)
    setDraft(roomToDraft(room))
    setFieldErrors({})
    setMode("preview")
  }

  if (!room && draftRoomId !== null && hydrated) {
    setDraftRoomId(null)
    setDraft(null)
  }

  async function persist(next: Draft) {
    const fields = draftToFields(next)
    setFieldErrors(fieldErrorsForDraft(next))
    if (!fields || !id) return

    const current = useRoomsStore.getState().rooms.find((item) => item.id === id)
    if (
      current &&
      current.name === fields.name &&
      current.lengthCm === fields.lengthCm &&
      current.widthCm === fields.widthCm &&
      current.heightCm === fields.heightCm
    ) {
      return
    }

    clearError()
    try {
      await updateRoom({ id, patch: fields })
    } catch {
      // Store surfaces error
    }
  }

  function handleFieldChange(key: keyof Draft, value: string) {
    setDraft((current) => {
      if (!current) return current
      const next = { ...current, [key]: value }
      void persist(next)
      return next
    })
  }

  async function handleDimensionsChange(next: {
    lengthCm: number
    widthCm: number
  }) {
    if (!id) return
    setDraft((current) =>
      current
        ? {
            ...current,
            lengthCm: String(next.lengthCm),
            widthCm: String(next.widthCm),
          }
        : current,
    )
    setFieldErrors((prev) => {
      const copy = { ...prev }
      delete copy.lengthCm
      delete copy.widthCm
      return copy
    })
    clearError()
    try {
      await updateRoom({
        id,
        patch: { lengthCm: next.lengthCm, widthCm: next.widthCm },
      })
    } catch {
      // Store surfaces error
    }
  }

  if (!hydrated && loading) {
    return (
      <main className="shell relative flex flex-1 flex-col">
        <div className="relative z-10 mx-auto w-full max-w-lg px-5 pb-8 pt-6 sm:px-8">
          <RoomsHeader
            title="Pomieszczenie"
            backHref="/pomieszczenia"
            backLabel="Lista"
          />
          <p className="mt-8 text-sm text-[var(--ink-muted)]">Wczytywanie…</p>
        </div>
      </main>
    )
  }

  if (hydrated && !room) {
    return (
      <main className="shell relative flex flex-1 flex-col">
        <div className="relative z-10 mx-auto w-full max-w-lg px-5 pb-8 pt-6 sm:px-8">
          <RoomsHeader
            title="Pomieszczenie"
            backHref="/pomieszczenia"
            backLabel="Lista"
          />
          <p className="fade-in mt-8 font-display text-lg text-[var(--ink)]">
            Nie znaleziono
          </p>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            To pomieszczenie nie istnieje lub zostało usunięte.
          </p>
          <Link href="/pomieszczenia" className="btn-primary mt-8 inline-flex">
            Wróć do listy
          </Link>
        </div>
      </main>
    )
  }

  if (!room || !draft) {
    return (
      <main className="shell relative flex flex-1 flex-col">
        <div className="relative z-10 mx-auto w-full max-w-lg px-5 pb-8 pt-6 sm:px-8">
          <RoomsHeader
            title="Pomieszczenie"
            backHref="/pomieszczenia"
            backLabel="Lista"
          />
          <p className="mt-8 text-sm text-[var(--ink-muted)]">Wczytywanie…</p>
        </div>
      </main>
    )
  }

  const parsedLength = parseDimension(draft.lengthCm)
  const parsedWidth = parseDimension(draft.widthCm)
  const parsedHeight = parseDimension(draft.heightCm)
  const lengthCm = Number.isFinite(parsedLength) ? parsedLength : room.lengthCm
  const widthCm = Number.isFinite(parsedWidth) ? parsedWidth : room.widthCm
  const heightCm = Number.isFinite(parsedHeight) ? parsedHeight : room.heightCm

  return (
    <main className="shell relative flex flex-1 flex-col">
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pb-8 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
        <RoomsHeader
          title={room.name}
          backHref="/pomieszczenia"
          backLabel="Lista"
        />

        <div className="fade-in-delay mt-6 flex flex-col gap-5">
          {error ? (
            <p
              role="alert"
              className="border border-[color-mix(in_srgb,var(--clay)_40%,transparent)] bg-[color-mix(in_srgb,var(--charcoal-raised)_80%,transparent)] px-3 py-2 text-sm text-[var(--clay-soft)]"
            >
              {error}
            </p>
          ) : null}

          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <Field
              id="room-name"
              label="Nazwa"
              value={draft.name}
              error={fieldErrors.name}
              onChange={(value) => handleFieldChange("name", value)}
              autoComplete="off"
            />
            <div className="grid grid-cols-3 gap-3">
              <Field
                id="room-length"
                label="Długość"
                suffix="cm"
                inputMode="decimal"
                value={draft.lengthCm}
                error={fieldErrors.lengthCm}
                onChange={(value) => handleFieldChange("lengthCm", value)}
              />
              <Field
                id="room-width"
                label="Szerokość"
                suffix="cm"
                inputMode="decimal"
                value={draft.widthCm}
                error={fieldErrors.widthCm}
                onChange={(value) => handleFieldChange("widthCm", value)}
              />
              <Field
                id="room-height"
                label="Wysokość"
                suffix="cm"
                inputMode="decimal"
                value={draft.heightCm}
                error={fieldErrors.heightCm}
                onChange={(value) => handleFieldChange("heightCm", value)}
              />
            </div>
          </form>

          <ModeToggle mode={mode} onChange={setMode} />

          <div className="overflow-hidden border border-[var(--line)]">
            <RoomCanvas
              lengthCm={lengthCm}
              widthCm={widthCm}
              heightCm={heightCm}
              mode={mode}
              minCm={MIN_DIMENSION_CM}
              maxCm={MAX_DIMENSION_CM}
              onDimensionsChange={
                mode === "dimensions" ? handleDimensionsChange : undefined
              }
            />
          </div>

          {mode === "dimensions" ? (
            <p className="text-xs leading-relaxed text-[var(--ink-muted)]">
              Przeciągaj uchwyty ścian, żeby zmienić długość i szerokość.
              Wysokość ustawiasz tylko w formularzu.
            </p>
          ) : null}
        </div>
      </div>
    </main>
  )
}

type FieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  suffix?: string
  inputMode?: "decimal" | "text"
  autoComplete?: string
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  suffix,
  inputMode,
  autoComplete,
}: FieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-xs tracking-wide text-[var(--ink-muted)]">
        {label}
        {suffix ? ` (${suffix})` : null}
      </span>
      <input
        id={id}
        value={value}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 border border-[var(--line)] bg-[color-mix(in_srgb,var(--charcoal-raised)_85%,transparent)] px-3 text-[var(--ink)] outline-none transition-colors focus:border-[var(--clay)]"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <span id={`${id}-error`} className="text-xs text-[var(--clay-soft)]">
          {error}
        </span>
      ) : null}
    </label>
  )
}
