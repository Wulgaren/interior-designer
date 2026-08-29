export type EditMode = "preview" | "dimensions"

export type RoomSceneProps = {
  lengthCm: number
  widthCm: number
  heightCm: number
  mode: EditMode
  onDimensionsChange?: (next: { lengthCm: number; widthCm: number }) => void
  minCm?: number
  maxCm?: number
}

export const DEFAULT_MIN_CM = 50
export const DEFAULT_MAX_CM = 2000

export function clampCm(value: number, minCm: number, maxCm: number): number {
  return Math.min(maxCm, Math.max(minCm, Math.round(value)))
}
