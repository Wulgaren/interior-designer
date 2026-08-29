"use client"

import type { DimensionUnit } from "@/lib/rooms/units"
import { DIMENSION_UNITS } from "@/lib/rooms/units"

type UnitToggleProps = {
  unit: DimensionUnit
  onChange: (unit: DimensionUnit) => void
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Jednostka wymiarów"
      className="grid grid-cols-3 border border-[var(--line)]"
    >
      {DIMENSION_UNITS.map((option) => {
        const active = unit === option
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={
              active
                ? "min-h-11 bg-[var(--clay)] px-3 text-sm font-semibold text-[var(--charcoal)]"
                : "min-h-11 bg-transparent px-3 text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
            }
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
