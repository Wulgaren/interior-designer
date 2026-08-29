import { create } from "zustand"

import { DEFAULT_ROOM_DIMENSIONS, DEFAULT_ROOM_NAME } from "./defaults"
import * as db from "./db"
import type { Room, RoomWritableFields } from "./types"
import {
  firstValidationMessage,
  validateRoomFields,
} from "./validation"

type CreateRoomInput = Partial<RoomWritableFields>

type UpdateRoomInput = {
  id: string
  patch: Partial<RoomWritableFields>
}

type RoomsState = {
  rooms: Room[]
  loading: boolean
  hydrated: boolean
  error: string | null
  hydrate: () => Promise<void>
  createRoom: (input?: CreateRoomInput) => Promise<string>
  updateRoom: (input: UpdateRoomInput) => Promise<void>
  deleteRoom: (input: { id: string }) => Promise<void>
  getRoom: (input: { id: string }) => Room | undefined
  clearError: () => void
}

function nowIso(): string {
  return new Date().toISOString()
}

function storageErrorMessage(fallback: string, cause: unknown): string {
  if (cause instanceof Error && cause.message.trim().length > 0) {
    return cause.message
  }
  return fallback
}

export const useRoomsStore = create<RoomsState>((set, get) => ({
  rooms: [],
  loading: false,
  hydrated: false,
  error: null,

  clearError: () => {
    set({ error: null })
  },

  hydrate: async () => {
    if (typeof window === "undefined") {
      return
    }

    const { hydrated, loading } = get()
    if (hydrated || loading) {
      return
    }

    set({ loading: true, error: null })

    try {
      const rooms = await db.listRooms()
      set({ rooms, loading: false, hydrated: true, error: null })
    } catch (cause) {
      set({
        loading: false,
        hydrated: true,
        error: storageErrorMessage(
          "Nie udało się wczytać pomieszczeń.",
          cause,
        ),
      })
    }
  },

  createRoom: async (input = {}) => {
    const fields: RoomWritableFields = {
      name: input.name ?? DEFAULT_ROOM_NAME,
      lengthCm: input.lengthCm ?? DEFAULT_ROOM_DIMENSIONS.lengthCm,
      widthCm: input.widthCm ?? DEFAULT_ROOM_DIMENSIONS.widthCm,
      heightCm: input.heightCm ?? DEFAULT_ROOM_DIMENSIONS.heightCm,
    }

    const validation = validateRoomFields(fields)
    if (!validation.ok) {
      const message = firstValidationMessage(validation.errors)
      set({ error: message })
      throw new Error(message)
    }

    const timestamp = nowIso()
    const room: Room = {
      id: crypto.randomUUID(),
      name: fields.name.trim(),
      lengthCm: fields.lengthCm,
      widthCm: fields.widthCm,
      heightCm: fields.heightCm,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    set({ loading: true, error: null })

    try {
      await db.saveRoom(room)
      set((state) => ({
        rooms: [room, ...state.rooms],
        loading: false,
        error: null,
      }))
      return room.id
    } catch (cause) {
      const message = storageErrorMessage(
        "Nie udało się zapisać pomieszczenia.",
        cause,
      )
      set({ loading: false, error: message })
      throw new Error(message)
    }
  },

  updateRoom: async ({ id, patch }) => {
    const existing = get().rooms.find((room) => room.id === id)
    if (!existing) {
      const message = "Nie znaleziono pomieszczenia."
      set({ error: message })
      throw new Error(message)
    }

    const fields: RoomWritableFields = {
      name: patch.name ?? existing.name,
      lengthCm: patch.lengthCm ?? existing.lengthCm,
      widthCm: patch.widthCm ?? existing.widthCm,
      heightCm: patch.heightCm ?? existing.heightCm,
    }

    const validation = validateRoomFields(fields)
    if (!validation.ok) {
      const message = firstValidationMessage(validation.errors)
      set({ error: message })
      throw new Error(message)
    }

    const next: Room = {
      ...existing,
      name: fields.name.trim(),
      lengthCm: fields.lengthCm,
      widthCm: fields.widthCm,
      heightCm: fields.heightCm,
      updatedAt: nowIso(),
    }

    set({ error: null })

    try {
      await db.saveRoom(next)
      set((state) => ({
        rooms: state.rooms
          .map((room) => (room.id === id ? next : room))
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        error: null,
      }))
    } catch (cause) {
      const message = storageErrorMessage(
        "Nie udało się zapisać zmian pomieszczenia.",
        cause,
      )
      set({ error: message })
      throw new Error(message)
    }
  },

  deleteRoom: async ({ id }) => {
    set({ loading: true, error: null })

    try {
      await db.deleteRoom({ id })
      set((state) => ({
        rooms: state.rooms.filter((room) => room.id !== id),
        loading: false,
        error: null,
      }))
    } catch (cause) {
      const message = storageErrorMessage(
        "Nie udało się usunąć pomieszczenia.",
        cause,
      )
      set({ loading: false, error: message })
      throw new Error(message)
    }
  },

  getRoom: ({ id }) => get().rooms.find((room) => room.id === id),
}))

if (typeof window !== "undefined") {
  queueMicrotask(() => {
    void useRoomsStore.getState().hydrate()
  })
}
