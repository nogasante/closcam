"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useState } from "react";

export type Spot = "phone" | "kiosk" | "booth";

function Mat({
  color,
  args,
  position,
  onClick,
  hot,
}: {
  color: string;
  args: [number, number, number];
  position: [number, number, number];
  onClick?: () => void;
  hot?: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);
  return (
    <mesh
      position={position}
      castShadow={false}
      receiveShadow={false}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(event) => {
        if (!onClick) return;
        event.stopPropagation();
        document.body.style.cursor = "pointer";
        invalidate();
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
        invalidate();
      }}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial color={hot ? "#d89a2b" : color} roughness={0.9} metalness={0.02} />
    </mesh>
  );
}

function Model({
  onSelect,
  hover,
  setHover,
}: {
  onSelect: (spot: Spot) => void;
  hover: Spot | null;
  setHover: (spot: Spot | null) => void;
}) {
  return (
    <group>
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#2a261f" roughness={1} />
      </mesh>
      <mesh position={[0, 0.7, -1.6]}>
        <boxGeometry args={[7.2, 1.5, 0.12]} />
        <meshStandardMaterial color="#3a342c" roughness={1} />
      </mesh>
      <group
        position={[-1.7, 0, 0.2]}
        onPointerOver={() => setHover("kiosk")}
        onPointerOut={() => setHover(null)}
      >
        <Mat color="#6b5c4e" args={[1.15, 1.15, 0.7]} position={[0, 0.7, 0]} onClick={() => onSelect("kiosk")} hot={hover === "kiosk"} />
        <Mat color="#8a6244" args={[1.4, 0.08, 0.9]} position={[0, 1.32, 0]} />
        <Mat color="#d89a2b" args={[0.7, 0.22, 0.05]} position={[0, 1.05, 0.38]} />
      </group>
      <group position={[0.15, 0, 0.5]} onPointerOver={() => setHover("phone")} onPointerOut={() => setHover(null)}>
        <Mat color="#5c564c" args={[0.55, 0.12, 0.4]} position={[0, 0.2, 0]} />
        <Mat color="#1c3a2e" args={[0.34, 0.62, 0.06]} position={[0, 0.58, 0]} onClick={() => onSelect("phone")} hot={hover === "phone"} />
      </group>
      <group position={[1.7, 0, 0.15]} onPointerOver={() => setHover("booth")} onPointerOut={() => setHover(null)}>
        <Mat color="#8a8176" args={[0.08, 1.3, 0.08]} position={[-0.35, 0.7, 0]} />
        <Mat color="#8a8176" args={[0.08, 1.3, 0.08]} position={[0.35, 0.7, 0]} />
        <Mat color="#8a8176" args={[0.86, 0.08, 0.08]} position={[0, 1.2, 0]} />
        <Mat color="#d7d0c6" args={[0.22, 0.1, 0.32]} position={[0, 0.95, 0.12]} onClick={() => onSelect("booth")} hot={hover === "booth"} />
      </group>
      <mesh position={[-3, 1.5, -0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
        <meshStandardMaterial color="#3a342c" roughness={1} />
      </mesh>
      <mesh position={[-3, 2.55, -0.4]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#e2b15a" emissive="#e2b15a" emissiveIntensity={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function JunctionScene({ onSelect }: { onSelect: (spot: Spot) => void }) {
  const [hover, setHover] = useState<Spot | null>(null);
  return (
      <Canvas
      camera={{ position: [4.4, 3.1, 6.4], fov: 32 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera, invalidate }) => {
        camera.lookAt(0, 0.7, 0);
        invalidate();
      }}
    >
      <color attach="background" args={["#161410"]} />
      <ambientLight intensity={1.35} color="#f4efe6" />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff6e8" />
      <spotLight position={[-2.2, 4.4, 2]} angle={0.7} penumbra={0.8} intensity={12} color="#e2b15a" />
      <Model onSelect={onSelect} hover={hover} setHover={setHover} />
    </Canvas>
  );
}
