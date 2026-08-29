import type { RoomDimensions } from "./types"

export const DEFAULT_ROOM_NAME = "Nowe pomieszczenie"

export const DEFAULT_ROOM_DIMENSIONS = {
  lengthCm: 400,
  widthCm: 300,
  heightCm: 270,
} as const satisfies RoomDimensions
