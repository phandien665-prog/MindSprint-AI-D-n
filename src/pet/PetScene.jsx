import React, { useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import PetModel from './PetModel.jsx';

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

function CameraAim({ height }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, height, 0);
    camera.updateProjectionMatrix();
  }, [camera, height]);
  return null;
}

export default function PetScene({ mode = 'full', animation = 'idle', target = null, speaking = false, onMove, onArrive, onPet }) {
  const isMini = mode === 'mini';
  const handleGround = useCallback(event => {
    if (isMini || !onMove) return;
    event.stopPropagation();
    onMove([clamp(event.point.x, -2.5, 2.5), clamp(event.point.z, -1.6, 1.6)]);
  }, [isMini, onMove]);

  return (
    <Canvas
      shadows={!isMini}
      dpr={[1, 1.5]}
      camera={isMini ? { position: [0, 1.4, 3.9], fov: 36 } : { position: [0, 2.15, 6.8], fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
      aria-label={isMini ? 'Pet 3D đồng hành' : 'Cảnh pet 3D; bấm xuống sàn để pet đi tới vị trí đó'}
    >
      <CameraAim height={isMini ? 0.98 : 0.88} />
      <ambientLight intensity={1.75} />
      <hemisphereLight args={['#fff9ed', '#b2c58b', 1.1]} />
      <directionalLight position={[3, 6, 5]} intensity={2.1} castShadow={!isMini} shadow-mapSize-width={512} shadow-mapSize-height={512} />
      <pointLight position={[-3, 3, 2]} intensity={0.65} color="#fff1d6" />
      {!isMini && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]} receiveShadow onPointerDown={handleGround}>
          <planeGeometry args={[12, 9]} />
          <meshStandardMaterial color="#eef1db" roughness={0.92} />
        </mesh>
      )}
      {!isMini && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <circleGeometry args={[1.75, 64]} />
        <meshBasicMaterial color="#dce9bd" transparent opacity={0.34} />
      </mesh>}
      <PetModel animation={animation} target={target} speaking={speaking} interactive={!isMini} onArrive={onArrive} onPet={onPet} />
    </Canvas>
  );
}
