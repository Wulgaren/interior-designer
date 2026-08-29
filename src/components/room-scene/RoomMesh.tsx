"use client"

type RoomMeshProps = {
  lengthCm: number
  widthCm: number
  heightCm: number
}

const WALL_THICKNESS_CM = 8
const PLASTER = "#d9cfc0"
const FLOOR = "#b89f82"

/** Open-top room: floor on y=0, walls around ±X (length) and ±Z (width). */
export function RoomMesh({ lengthCm, widthCm, heightCm }: RoomMeshProps) {
  const halfL = lengthCm / 2
  const halfW = widthCm / 2
  const halfH = heightCm / 2
  const t = WALL_THICKNESS_CM

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[lengthCm, widthCm]} />
        <meshBasicMaterial color={FLOOR} />
      </mesh>

      <mesh position={[halfL - t / 2, halfH, 0]}>
        <boxGeometry args={[t, heightCm, widthCm]} />
        <meshBasicMaterial color={PLASTER} />
      </mesh>

      <mesh position={[-halfL + t / 2, halfH, 0]}>
        <boxGeometry args={[t, heightCm, widthCm]} />
        <meshBasicMaterial color={PLASTER} />
      </mesh>

      <mesh position={[0, halfH, halfW - t / 2]}>
        <boxGeometry args={[lengthCm, heightCm, t]} />
        <meshBasicMaterial color={PLASTER} />
      </mesh>

      <mesh position={[0, halfH, -halfW + t / 2]}>
        <boxGeometry args={[lengthCm, heightCm, t]} />
        <meshBasicMaterial color={PLASTER} />
      </mesh>
    </group>
  )
}
