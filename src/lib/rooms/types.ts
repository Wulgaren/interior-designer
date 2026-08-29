export type Room = {
  id: string
  name: string
  lengthCm: number // X
  widthCm: number // Z
  heightCm: number // Y
  createdAt: string
  updatedAt: string
}

export type RoomDimensions = Pick<Room, "lengthCm" | "widthCm" | "heightCm">

export type RoomWritableFields = Pick<
  Room,
  "name" | "lengthCm" | "widthCm" | "heightCm"
>
