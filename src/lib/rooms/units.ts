import { MAX_DIMENSION_CM, MIN_DIMENSION_CM } from "./validation"

export type DimensionUnit = "m" | "cm" | "mm"

export const DIMENSION_UNITS: DimensionUnit[] = ["m", "cm", "mm"]

const STORAGE_KEY = "homiq-dimension-unit"

export function readStoredDimensionUnit(): DimensionUnit {
  if (typeof window === "undefined") {
    return "cm"
  }
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "m" || stored === "cm" || stored === "mm") {
    return stored
  }
  return "cm"
}

export function writeStoredDimensionUnit(unit: DimensionUnit): void {
  if (typeof window === "undefined") {
    return
  }
  localStorage.setItem(STORAGE_KEY, unit)
}

export function cmToUnit(cm: number, unit: DimensionUnit): number {
  switch (unit) {
    case "m":
      return cm / 100
    case "mm":
      return cm * 10
    default:
      return cm
  }
}

export function unitToCm(value: number, unit: DimensionUnit): number {
  switch (unit) {
    case "m":
      return value * 100
    case "mm":
      return value / 10
    default:
      return value
  }
}

export function formatCmForUnit(cm: number, unit: DimensionUnit): string {
  const value = cmToUnit(cm, unit)
  if (unit === "m") {
    const rounded = Math.round(value * 10000) / 10000
    return String(rounded)
  }
  if (unit === "mm") {
    return String(Math.round(value))
  }
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}

export function formatLimitForUnit(cm: number, unit: DimensionUnit): string {
  return `${formatCmForUnit(cm, unit)} ${unit}`
}

export function validateDimensionInUnit(
  displayValue: number,
  unit: DimensionUnit,
): string | undefined {
  if (!Number.isFinite(displayValue)) {
    return "Wymiar musi być liczbą."
  }

  const cm = unitToCm(displayValue, unit)
  if (cm < MIN_DIMENSION_CM) {
    return `Minimalny wymiar to ${formatLimitForUnit(MIN_DIMENSION_CM, unit)}.`
  }
  if (cm > MAX_DIMENSION_CM) {
    return `Maksymalny wymiar to ${formatLimitForUnit(MAX_DIMENSION_CM, unit)}.`
  }
  return undefined
}

export function formatRoomDimensions(
  dims: { lengthCm: number; widthCm: number; heightCm: number },
  unit: DimensionUnit,
): string {
  const length = formatCmForUnit(dims.lengthCm, unit)
  const width = formatCmForUnit(dims.widthCm, unit)
  const height = formatCmForUnit(dims.heightCm, unit)
  return `${length} × ${width} × ${height} ${unit}`
}
