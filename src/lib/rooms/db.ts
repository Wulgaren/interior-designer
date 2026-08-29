import { openDB, type DBSchema, type IDBPDatabase } from "idb"

import type { Room } from "./types"

const DB_NAME = "homiq"
const DB_VERSION = 1
const ROOMS_STORE = "rooms"

interface HomiqDB extends DBSchema {
  rooms: {
    key: string
    value: Room
  }
}

let dbPromise: Promise<IDBPDatabase<HomiqDB>> | null = null

function getDb(): Promise<IDBPDatabase<HomiqDB>> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB jest niedostępne w tym środowisku."))
  }

  if (!dbPromise) {
    dbPromise = openDB<HomiqDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(ROOMS_STORE)) {
          db.createObjectStore(ROOMS_STORE, { keyPath: "id" })
        }
      },
    })
  }

  return dbPromise
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Validates a value read from IndexedDB before treating it as a Room. */
export function parseRoom(value: unknown): Room | null {
  if (!isRecord(value)) {
    return null
  }

  const { id, name, lengthCm, widthCm, heightCm, createdAt, updatedAt } = value

  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof lengthCm !== "number" ||
    typeof widthCm !== "number" ||
    typeof heightCm !== "number" ||
    typeof createdAt !== "string" ||
    typeof updatedAt !== "string"
  ) {
    return null
  }

  if (
    !Number.isFinite(lengthCm) ||
    !Number.isFinite(widthCm) ||
    !Number.isFinite(heightCm)
  ) {
    return null
  }

  return { id, name, lengthCm, widthCm, heightCm, createdAt, updatedAt }
}

function requireRoom(value: unknown): Room {
  const room = parseRoom(value)
  if (!room) {
    throw new Error("Zapisane pomieszczenie ma nieprawidłowy format.")
  }
  return room
}

export async function listRooms(): Promise<Room[]> {
  const db = await getDb()
  const raw = await db.getAll(ROOMS_STORE)
  const rooms: Room[] = []

  for (const entry of raw) {
    const room = parseRoom(entry)
    if (room) {
      rooms.push(room)
    }
  }

  rooms.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return rooms
}

export async function getRoom({ id }: { id: string }): Promise<Room | undefined> {
  const db = await getDb()
  const raw = await db.get(ROOMS_STORE, id)
  if (raw === undefined) {
    return undefined
  }
  return requireRoom(raw)
}

export async function saveRoom(room: Room): Promise<void> {
  const valid = parseRoom(room)
  if (!valid) {
    throw new Error("Nie można zapisać nieprawidłowego pomieszczenia.")
  }
  const db = await getDb()
  await db.put(ROOMS_STORE, valid)
}

export async function deleteRoom({ id }: { id: string }): Promise<void> {
  const db = await getDb()
  await db.delete(ROOMS_STORE, id)
}
