import type { RoomWritableFields } from "./types"

export const MIN_DIMENSION_CM = 50
export const MAX_DIMENSION_CM = 2000

export type FieldErrors = Partial<Record<keyof RoomWritableFields, string>>

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: FieldErrors }

/** Clamps a dimension for drag / dimension-mode updates. */
export function clampDimensionCm(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_DIMENSION_CM
  }
  return Math.min(
    MAX_DIMENSION_CM,
    Math.max(MIN_DIMENSION_CM, Math.round(value)),
  )
}

export function clampRoomDimensions(dims: {
  lengthCm: number
  widthCm: number
  heightCm: number
}): { lengthCm: number; widthCm: number; heightCm: number } {
  return {
    lengthCm: clampDimensionCm(dims.lengthCm),
    widthCm: clampDimensionCm(dims.widthCm),
    heightCm: clampDimensionCm(dims.heightCm),
  }
}

export function validateRoomName(name: string): string | undefined {
  if (name.trim().length === 0) {
    return "Nazwa nie może być pusta."
  }
  return undefined
}

export function validateDimensionCm(value: number): string | undefined {
  if (!Number.isFinite(value)) {
    return "Wymiar musi być liczbą."
  }
  if (value < MIN_DIMENSION_CM) {
    return `Minimalny wymiar to ${MIN_DIMENSION_CM} cm.`
  }
  if (value > MAX_DIMENSION_CM) {
    return `Maksymalny wymiar to ${MAX_DIMENSION_CM} cm.`
  }
  return undefined
}

export function validateRoomFields(fields: RoomWritableFields): ValidationResult {
  const errors: FieldErrors = {}

  const nameError = validateRoomName(fields.name)
  if (nameError) {
    errors.name = nameError
  }

  const lengthError = validateDimensionCm(fields.lengthCm)
  if (lengthError) {
    errors.lengthCm = lengthError
  }

  const widthError = validateDimensionCm(fields.widthCm)
  if (widthError) {
    errors.widthCm = widthError
  }

  const heightError = validateDimensionCm(fields.heightCm)
  if (heightError) {
    errors.heightCm = heightError
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }
  return { ok: true }
}

export function firstValidationMessage(errors: FieldErrors): string {
  const first = Object.values(errors).find(
    (message): message is string => typeof message === "string",
  )
  return first ?? "Dane pomieszczenia są nieprawidłowe."
}
