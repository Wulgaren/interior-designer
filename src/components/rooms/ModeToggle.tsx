"use client"

import type { EditMode } from "@/components/room-scene"

type ModeToggleProps = {
  mode: EditMode
  onChange: (mode: EditMode) => void
}

const OPTIONS: { value: EditMode; label: string }[] = [
  { value: "preview", label: "Podgląd" },
  { value: "dimensions", label: "Wymiary" },
]

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Tryb edycji"
      className="grid grid-cols-2 border border-[var(--line)]"
    >
      {OPTIONS.map((option) => {
        const active = mode === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={
              active
                ? "min-h-11 bg-[var(--clay)] px-3 text-sm font-semibold text-[var(--charcoal)]"
                : "min-h-11 bg-transparent px-3 text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
