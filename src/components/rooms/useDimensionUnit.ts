"use client"

import { useState } from "react"

import {
  readStoredDimensionUnit,
  writeStoredDimensionUnit,
  type DimensionUnit,
} from "@/lib/rooms/units"

export function useDimensionUnit(): [DimensionUnit, (unit: DimensionUnit) => void] {
  const [unit, setUnitState] = useState<DimensionUnit>(() =>
    readStoredDimensionUnit(),
  )

  function setUnit(next: DimensionUnit) {
    writeStoredDimensionUnit(next)
    setUnitState(next)
  }

  return [unit, setUnit]
}
