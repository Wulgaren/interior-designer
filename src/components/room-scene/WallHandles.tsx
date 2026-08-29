"use client"

/* Three.js / R3F pointer cursors mutate the canvas DOM imperatively. */
/* eslint-disable react-hooks/immutability */

import { useThree, type ThreeEvent } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import {
  Plane,
  Vector2,
  Vector3,
  type Camera,
  type Raycaster,
} from "three"
import { clampCm } from "./types"

type Axis = "length" | "width"

type WallHandlesProps = {
  lengthCm: number
  widthCm: number
  heightCm: number
  minCm: number
  maxCm: number
  onDimensionsChange?: (next: { lengthCm: number; widthCm: number }) => void
  onDragChange: (dragging: boolean) => void
}

const HANDLE = "#9a6b4a"
const HIT_RADIUS = 28
const VISUAL_RADIUS = 10

type HandleProps = {
  axis: Axis
  sign: 1 | -1
  lengthCm: number
  widthCm: number
  heightCm: number
  minCm: number
  maxCm: number
  onDimensionsChange?: (next: { lengthCm: number; widthCm: number }) => void
  onDragChange: (dragging: boolean) => void
}

const ndc = new Vector2()

function projectOntoDragPlane(
  raycaster: Raycaster,
  camera: Camera,
  domElement: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  planeY: number,
  out: Vector3,
): boolean {
  const rect = domElement.getBoundingClientRect()
  ndc.set(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1,
  )
  raycaster.setFromCamera(ndc, camera)
  const plane = new Plane(new Vector3(0, 1, 0), -planeY)
  return raycaster.ray.intersectPlane(plane, out) !== null
}

function WallHandle({
  axis,
  sign,
  lengthCm,
  widthCm,
  heightCm,
  minCm,
  maxCm,
  onDimensionsChange,
  onDragChange,
}: HandleProps) {
  const { camera, gl, raycaster } = useThree()
  const dragging = useRef(false)
  const hitPoint = useRef(new Vector3())
  const dimsRef = useRef({ lengthCm, widthCm, minCm, maxCm, heightCm })

  useEffect(() => {
    dimsRef.current = { lengthCm, widthCm, minCm, maxCm, heightCm }
  }, [lengthCm, widthCm, minCm, maxCm, heightCm])

  const halfL = lengthCm / 2
  const halfW = widthCm / 2
  const y = heightCm * 0.5
  const position: [number, number, number] =
    axis === "length"
      ? [sign * halfL, y, 0]
      : [0, y, sign * halfW]

  useEffect(() => {
    const canvas = gl.domElement

    function applyPointer(clientX: number, clientY: number) {
      if (!dragging.current || !onDimensionsChange) return
      const { heightCm: h, minCm: min, maxCm: max, lengthCm: L, widthCm: W } =
        dimsRef.current
      if (
        !projectOntoDragPlane(
          raycaster,
          camera,
          canvas,
          clientX,
          clientY,
          h * 0.5,
          hitPoint.current,
        )
      ) {
        return
      }
      if (axis === "length") {
        const next = clampCm(Math.abs(hitPoint.current.x) * 2, min, max)
        if (next !== L) onDimensionsChange({ lengthCm: next, widthCm: W })
      } else {
        const next = clampCm(Math.abs(hitPoint.current.z) * 2, min, max)
        if (next !== W) onDimensionsChange({ lengthCm: L, widthCm: next })
      }
    }

    function onMove(e: PointerEvent) {
      applyPointer(e.clientX, e.clientY)
    }

    function onUp() {
      if (!dragging.current) return
      dragging.current = false
      onDragChange(false)
      canvas.style.cursor = "auto"
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [axis, camera, gl, onDimensionsChange, onDragChange, raycaster])

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    if (!onDimensionsChange) return
    e.stopPropagation()
    dragging.current = true
    onDragChange(true)
    const canvas = gl.domElement
    canvas.style.cursor = "grabbing"

    if (
      !projectOntoDragPlane(
        raycaster,
        camera,
        canvas,
        e.clientX,
        e.clientY,
        heightCm * 0.5,
        hitPoint.current,
      )
    ) {
      return
    }
    if (axis === "length") {
      const next = clampCm(Math.abs(hitPoint.current.x) * 2, minCm, maxCm)
      onDimensionsChange({ lengthCm: next, widthCm })
    } else {
      const next = clampCm(Math.abs(hitPoint.current.z) * 2, minCm, maxCm)
      onDimensionsChange({ lengthCm, widthCm: next })
    }
  }

  return (
    <group position={position}>
      <mesh
        onPointerDown={onPointerDown}
        onPointerOver={() => {
          if (!dragging.current) {
            gl.domElement.style.cursor = "grab"
          }
        }}
        onPointerOut={() => {
          if (!dragging.current) {
            gl.domElement.style.cursor = "auto"
          }
        }}
      >
        <sphereGeometry args={[HIT_RADIUS, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[VISUAL_RADIUS, 24, 24]} />
        <meshStandardMaterial
          color={HANDLE}
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>
    </group>
  )
}

/** Drag handles on ±X (length) and ±Z (width) wall midpoints. */
export function WallHandles({
  lengthCm,
  widthCm,
  heightCm,
  minCm,
  maxCm,
  onDimensionsChange,
  onDragChange,
}: WallHandlesProps) {
  const common = {
    lengthCm,
    widthCm,
    heightCm,
    minCm,
    maxCm,
    onDimensionsChange,
    onDragChange,
  } as const

  return (
    <group>
      <WallHandle axis="length" sign={1} {...common} />
      <WallHandle axis="length" sign={-1} {...common} />
      <WallHandle axis="width" sign={1} {...common} />
      <WallHandle axis="width" sign={-1} {...common} />
    </group>
  )
}
