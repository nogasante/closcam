"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useState } from "react";

export type Spot = "phone" | "kiosk" | "booth";

function Box({
  color,
  args,
  position,
  onClick,
  hoverColor,
  hot,
}: {
  color: string;
  args: [number, number, number];
  position: [number, number, number];
  onClick?: () => void;
  hoverColor?: string;
  hot?: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);
  return (
    <mesh
      position={position}
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
        if (!onClick) return;
        document.body.style.cursor = "";
        invalidate();
      }}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={hot && hoverColor ? hoverColor : color}
        roughness={0.86}
        metalness={0.04}
      />
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[9, 6]} />
        <meshStandardMaterial color="#2c2822" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.35]}>
        <planeGeometry args={[7.2, 1.15]} />
        <meshStandardMaterial color="#3a342c" roughness={1} />
      </mesh>
      <Box color="#4a433b" args={[7.4, 1.35, 0.16]} position={[0, 0.78, -1.55]} />
      <Box color="#6d6458" args={[7.4, 0.08, 0.22]} position={[0, 1.48, -1.55]} />

      <group
        position={[-1.45, 0, 0.15]}
        onPointerOver={() => setHover("kiosk")}
        onPointerOut={() => setHover(null)}
      >
        <Box color="#5c4b3d" args={[1.05, 0.92, 0.62]} position={[0, 0.58, 0]} onClick={() => onSelect("kiosk")} />
        <Box color="#7a624c" args={[1.28, 0.06, 0.78]} position={[0, 1.08, 0.04]} />
        <Box color="#8d6a45" args={[1.22, 0.05, 0.72]} position={[0, 1.16, 0]} />
        <Box color="#3d342c" args={[1.15, 0.08, 0.42]} position={[0, 0.72, 0.42]} />
        <Box
          color="#d89a2b"
          hoverColor="#e2b15a"
          hot={hover === "kiosk"}
          args={[0.62, 0.28, 0.04]}
          position={[0, 0.86, 0.34]}
          onClick={() => onSelect("kiosk")}
        />
      </group>

      <group
        position={[0.05, 0, 0.42]}
        onPointerOver={() => setHover("phone")}
        onPointerOut={() => setHover(null)}
      >
        <Box color="#4e4942" args={[0.46, 0.08, 0.34]} position={[0, 0.16, 0]} />
        <Box color="#1a1916" args={[0.28, 0.52, 0.045]} position={[0, 0.48, 0]} onClick={() => onSelect("phone")} />
        <Box
          color="#16352c"
          hoverColor="#1f4a3d"
          hot={hover === "phone"}
          args={[0.22, 0.38, 0.01]}
          position={[0, 0.5, 0.03]}
          onClick={() => onSelect("phone")}
        />
      </group>

      <group
        position={[1.45, 0, 0.05]}
        onPointerOver={() => setHover("booth")}
        onPointerOut={() => setHover(null)}
      >
        <Box color="#3f3a34" args={[0.9, 0.06, 0.7]} position={[0, 0.08, 0]} />
        <Box color="#6e675e" args={[0.06, 1.35, 0.06]} position={[-0.38, 0.74, 0]} />
        <Box color="#6e675e" args={[0.06, 1.35, 0.06]} position={[0.38, 0.74, 0]} />
        <Box color="#6e675e" args={[0.82, 0.06, 0.62]} position={[0, 1.4, 0]} />
        <Box color="#514c46" args={[0.7, 1.05, 0.05]} position={[0, 0.78, -0.28]} onClick={() => onSelect("booth")} />
        <Box
          color="#d7d0c6"
          hoverColor="#e2b15a"
          hot={hover === "booth"}
          args={[0.16, 0.08, 0.22]}
          position={[0.12, 1.02, -0.18]}
          onClick={() => onSelect("booth")}
        />
      </group>

      <mesh position={[-2.55, 1.15, -0.35]}>
        <cylinderGeometry args={[0.035, 0.045, 2.3, 12]} />
        <meshStandardMaterial color="#3a342c" roughness={0.8} />
      </mesh>
      <mesh position={[-2.55, 2.28, -0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.55, 8]} />
        <meshStandardMaterial color="#3a342c" roughness={0.8} />
      </mesh>
      <mesh position={[-2.28, 2.28, -0.05]}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshStandardMaterial color="#f0d48a" emissive="#e2b15a" emissiveIntensity={1.1} roughness={0.35} />
      </mesh>
    </group>
  );
}

export default function JunctionScene({ onSelect }: { onSelect: (spot: Spot) => void }) {
  const [hover, setHover] = useState<Spot | null>(null);
  return (
    <Canvas
      camera={{ position: [3.1, 2.15, 4.35], fov: 34 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => {
        camera.lookAt(-0.05, 0.72, 0);
      }}
    >
      <color attach="background" args={["#14120f"]} />
      <ambientLight intensity={0.55} color="#f3efe6" />
      <directionalLight position={[3.5, 5.5, 4]} intensity={1.35} color="#fff8ee" />
      <spotLight
        position={[-2.2, 2.35, 0.4]}
        angle={0.55}
        penumbra={0.9}
        intensity={8}
        color="#e2b15a"
        distance={8}
      />
      <Model onSelect={onSelect} hover={hover} setHover={setHover} />
    </Canvas>
  );
}
