import type { Metadata } from "next"

import { RoomList } from "@/components/rooms/RoomList"

export const metadata: Metadata = {
  title: "Moje pomieszczenia",
}

export default function PomieszczeniaPage() {
  return <RoomList />
}
