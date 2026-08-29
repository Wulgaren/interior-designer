"use client"

/* Three.js camera framing is imperative; React Compiler cannot model it. */
/* eslint-disable react-hooks/immutability */

import { OrbitControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react"
import { TOUCH, type PerspectiveCamera } from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

type RoomCameraProps = {
  enabled: boolean
  lengthCm: number
  widthCm: number
  heightCm: number
}

export function cameraPositionForRoom(dims: {
  lengthCm: number
  widthCm: number
  heightCm: number
}): [number, number, number] {
  const span = Math.max(dims.lengthCm, dims.widthCm, dims.heightCm)
  const dist = span * 1.55
  return [dist * 0.9, dims.heightCm * 0.85 + span * 0.45, dist * 0.9]
}

/** Orbit from outside / slightly above. Off in dimensions mode. */
export function RoomCamera({
  enabled,
  lengthCm,
  widthCm,
  heightCm,
}: RoomCameraProps) {
  const camera = useThree((s) => s.camera as PerspectiveCamera)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const framed = useRef(false)
  const span = Math.max(lengthCm, widthCm, heightCm)
  const targetY = heightCm * 0.35

  useLayoutEffect(() => {
    camera.near = 0.1
    camera.far = Math.max(5000, span * 20)
    camera.updateProjectionMatrix()

    if (framed.current) return
    framed.current = true

    const [x, y, z] = cameraPositionForRoom({
      lengthCm,
      widthCm,
      heightCm,
    })
    camera.position.set(x, y, z)
    const controls = controlsRef.current
    if (controls) {
      controls.target.set(0, targetY, 0)
      controls.update()
    } else {
      camera.lookAt(0, targetY, 0)
    }
  }, [camera, heightCm, lengthCm, span, targetY, widthCm])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={enabled}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      target={[0, targetY, 0]}
      minDistance={Math.max(100, span * 0.5)}
      maxDistance={Math.max(2500, span * 5)}
      maxPolarAngle={Math.PI * 0.48}
      minPolarAngle={0.2}
      touches={{
        ONE: TOUCH.ROTATE,
        TWO: TOUCH.DOLLY_PAN,
      }}
    />
  )
}
