import type { Metadata } from "next"

import { RoomDetail } from "@/components/rooms/RoomDetail"

export const metadata: Metadata = {
  title: "Pomieszczenie",
}

export default function PomieszczenieDetailPage() {
  return <RoomDetail />
}
