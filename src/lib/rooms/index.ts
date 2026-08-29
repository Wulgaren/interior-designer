export { DEFAULT_ROOM_DIMENSIONS, DEFAULT_ROOM_NAME } from "./defaults"
export {
  deleteRoom,
  getRoom,
  listRooms,
  parseRoom,
  saveRoom,
} from "./db"
export { useRoomsStore } from "./store"
export type { Room, RoomDimensions, RoomWritableFields } from "./types"
export {
  clampDimensionCm,
  clampRoomDimensions,
  firstValidationMessage,
  MAX_DIMENSION_CM,
  MIN_DIMENSION_CM,
  validateDimensionCm,
  validateRoomFields,
  validateRoomName,
} from "./validation"
export type { FieldErrors, ValidationResult } from "./validation"
export {
  cmToUnit,
  DIMENSION_UNITS,
  formatCmForUnit,
  formatLimitForUnit,
  formatRoomDimensions,
  readStoredDimensionUnit,
  unitToCm,
  validateDimensionInUnit,
  writeStoredDimensionUnit,
  type DimensionUnit,
} from "./units"
