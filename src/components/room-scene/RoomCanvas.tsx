"use client"

import { Canvas } from "@react-three/fiber"
import { useMemo, useState } from "react"
import { Color } from "three"
import { cameraPositionForRoom, RoomCamera } from "./RoomCamera"
import { RoomMesh } from "./RoomMesh"
import {
  DEFAULT_MAX_CM,
  DEFAULT_MIN_CM,
  type RoomSceneProps,
} from "./types"
import { WallHandles } from "./WallHandles"

/**
 * Client-only R3F room preview. Import via next/dynamic with ssr:false
 * from a parent page when wiring the store.
 */
export function RoomCanvas({
  lengthCm,
  widthCm,
  heightCm,
  mode,
  onDimensionsChange,
  minCm = DEFAULT_MIN_CM,
  maxCm = DEFAULT_MAX_CM,
}: RoomSceneProps) {
  const [dragging, setDragging] = useState(false)
  const orbitEnabled = mode === "preview" && !dragging
  const cameraPosition = useMemo(
    () => cameraPositionForRoom({ lengthCm, widthCm, heightCm }),
    [lengthCm, widthCm, heightCm],
  )
  const far = Math.max(5000, Math.max(lengthCm, widthCm, heightCm) * 20)

  return (
    <div
      className="room-canvas"
      style={{
        width: "100%",
        height: "50vh",
        minHeight: 280,
        maxHeight: 640,
        touchAction: "none",
        background:
          "linear-gradient(165deg, #f6f1ea 0%, #ebe3d6 48%, #e2d8c8 100%)",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far,
          position: cameraPosition,
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor(new Color("#ebe3d6"), 1)
          scene.background = new Color("#ebe3d6")
          camera.position.set(...cameraPosition)
          camera.lookAt(0, heightCm * 0.35, 0)
          camera.updateProjectionMatrix()
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight intensity={1.2} position={[200, 400, 200]} />
        <RoomMesh
          lengthCm={lengthCm}
          widthCm={widthCm}
          heightCm={heightCm}
        />
        <RoomCamera
          enabled={orbitEnabled}
          lengthCm={lengthCm}
          widthCm={widthCm}
          heightCm={heightCm}
        />
        {mode === "dimensions" ? (
          <WallHandles
            lengthCm={lengthCm}
            widthCm={widthCm}
            heightCm={heightCm}
            minCm={minCm}
            maxCm={maxCm}
            onDimensionsChange={onDimensionsChange}
            onDragChange={setDragging}
          />
        ) : null}
      </Canvas>
    </div>
  )
}
