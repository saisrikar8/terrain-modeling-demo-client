import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { divergingColor, colorScaleOf } from "../lib/colors";

function buildGeometry(grid, colorScale) {
  const size = grid.length;
  const geometry = new THREE.PlaneGeometry(10, 10, size - 1, size - 1);
  const pos = geometry.attributes.position;
  const maxAbs = colorScale || colorScaleOf(grid);
  const colors = new Float32Array(pos.count * 3);

  let maxMag = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      maxMag = Math.max(maxMag, Math.abs(grid[y][x]));
    }
  }
  const scale = maxMag > 0 ? 1.8 / maxMag : 1;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const v = grid[y][x];
      pos.setZ(idx, v * scale);
      const [r, g, b] = divergingColor(v, maxAbs);
      colors[idx * 3] = r / 255;
      colors[idx * 3 + 1] = g / 255;
      colors[idx * 3 + 2] = b / 255;
    }
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function Mesh({ grid, colorScale }) {
  const geometry = useMemo(() => buildGeometry(grid, colorScale), [grid, colorScale]);
  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2.4, 0, 0]}>
      <meshStandardMaterial vertexColors flatShading roughness={0.85} />
    </mesh>
  );
}

function Terrain3D({ grid, scale, className }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 6, 9], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 8, 4]} intensity={1.1} />
        <Mesh grid={grid} colorScale={scale} />
        <OrbitControls enablePan={false} minDistance={4} maxDistance={16} />
      </Canvas>
    </div>
  );
}

export default Terrain3D;
