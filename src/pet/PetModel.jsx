import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CatmullRomCurve3, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

const SMILE_CURVE = new CatmullRomCurve3([
  new Vector3(-0.058, 0.004, 0),
  new Vector3(-0.034, -0.025, 0),
  new Vector3(0, -0.034, 0),
  new Vector3(0.034, -0.025, 0),
  new Vector3(0.058, 0.004, 0),
], false, 'centripetal');

const WALK_SPEED = 0.7;
const ARRIVAL_DISTANCE = 0.1;
const WALK_TIME_SCALE = 0.75;
const WALK_CYCLE_SPEED = 4.8;

export default function PetModel({ animation = 'idle', target = null, speaking = false, interactive = false, onArrive, onPet }) {
  const root = useRef();
  const body = useRef();
  const head = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftEar = useRef();
  const rightEar = useRef();
  const leftEye = useRef();
  const rightEye = useRef();
  const leftBrow = useRef();
  const rightBrow = useRef();
  const smile = useRef();
  const mouth = useRef();
  const startedAt = useRef(0);
  const arrived = useRef(false);
  const lastPetAt = useRef(0);
  const destination = useRef(target);
  const walkPhase = useRef(0);

  useEffect(() => {
    startedAt.current = performance.now() / 1000;
    if (animation === 'walk') arrived.current = false;
  }, [animation, target]);
  useEffect(() => {
    destination.current = target;
    arrived.current = false;
  }, [target]);

  const handlePet = event => {
    if (!interactive) return;
    event.stopPropagation();
    const now = performance.now();
    if (now - lastPetAt.current < 500) return;
    lastPetAt.current = now;
    onPet?.();
  };
  const handlePetMove = event => {
    if (event.nativeEvent?.buttons === 1 || event.nativeEvent?.pointerType === 'touch') handlePet(event);
  };
  const pointerProps = interactive ? {
    onPointerDown: handlePet,
    onPointerMove: handlePetMove,
    onPointerOver: () => { document.body.style.cursor = 'grab'; },
    onPointerOut: () => { document.body.style.cursor = ''; },
  } : {};

  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    const time = clock.getElapsedTime();
    const elapsed = time - startedAt.current;
    const isWalking = animation === 'walk';
    let gait = 0;
    let isMoving = false;

    if (isWalking && destination.current) {
      const [targetX, targetZ] = destination.current;
      const dx = targetX - root.current.position.x;
      const dz = targetZ - root.current.position.z;
      const distance = Math.hypot(dx, dz);
      if (distance < ARRIVAL_DISTANCE) {
        if (!arrived.current) {
          arrived.current = true;
          onArrive?.();
        }
      } else {
        const step = Math.min(distance, delta * WALK_SPEED);
        root.current.position.x += (dx / distance) * step;
        root.current.position.z += (dz / distance) * step;
        // This model's face points toward +Z; damp the shortest yaw path as it turns.
        const desiredYaw = Math.atan2(dx, dz);
        const currentYaw = root.current.rotation.y;
        const shortestYaw = currentYaw + THREE.MathUtils.euclideanModulo(desiredYaw - currentYaw + Math.PI, Math.PI * 2) - Math.PI;
        root.current.rotation.y = THREE.MathUtils.damp(currentYaw, shortestYaw, 6, delta);
        isMoving = true;
      }
    } else if (isWalking) {
      // The floating mini-widget walks in place while its container roams the screen.
      isMoving = true;
    }

    const locomotionClip = isMoving ? 'Walk' : 'Idle';
    const timeScale = locomotionClip === 'Walk' ? WALK_TIME_SCALE : 1;
    if (locomotionClip === 'Walk') {
      walkPhase.current += delta * WALK_CYCLE_SPEED * timeScale;
      gait = Math.sin(walkPhase.current);
    }
    const bob = locomotionClip === 'Walk' ? Math.abs(gait) * 0.035 : Math.sin(time * 2.1) * 0.014;
    const jump = animation === 'jump' ? Math.sin(Math.min(1, elapsed / 0.9) * Math.PI) * 0.62 : 0;
    root.current.position.y = bob + jump;

    if (body.current) {
      const happyPulse = animation === 'happy' ? Math.sin(time * 8) * 0.045 : 0;
      body.current.scale.set(1 + happyPulse, 1 - happyPulse * 0.5, 1 + happyPulse);
      body.current.rotation.z = animation === 'sad' ? 0.09 : animation === 'happy' ? Math.sin(time * 6) * 0.08 : locomotionClip === 'Walk' ? gait * 0.025 : 0;
    }
    if (head.current) {
      head.current.rotation.z = animation === 'sad' ? 0.13 : animation === 'happy' ? Math.sin(time * 6) * 0.08 : 0;
      head.current.position.y = 1.39 + (animation === 'sad' ? -0.08 : 0) + (animation === 'happy' ? Math.abs(Math.sin(time * 7)) * 0.035 : 0);
    }
    if (leftLeg.current) leftLeg.current.rotation.x = locomotionClip === 'Walk' ? gait * 0.34 : 0;
    if (rightLeg.current) rightLeg.current.rotation.x = locomotionClip === 'Walk' ? -gait * 0.34 : 0;
    if (leftArm.current) leftArm.current.rotation.x = locomotionClip === 'Walk' ? -gait * 0.24 : 0;
    if (rightArm.current) {
      rightArm.current.rotation.x = locomotionClip === 'Walk' ? gait * 0.24 : 0;
      rightArm.current.rotation.z = animation === 'wave' ? -0.9 + Math.sin(time * 12) * 0.22 : 0;
    }
    if (leftEar.current) leftEar.current.rotation.z = animation === 'sad' ? 0.32 : Math.sin(time * 2.4) * 0.025;
    if (rightEar.current) rightEar.current.rotation.z = animation === 'sad' ? -0.32 : -Math.sin(time * 2.4) * 0.025;

    const phase = time % 4.2;
    const blink = phase > 4.02 && phase < 4.18 ? 0.1 : 1;
    const moodEyeScale = animation === 'happy' ? 1.04 : animation === 'sad' ? 0.84 : 1;
    if (leftEye.current) leftEye.current.scale.y = blink * moodEyeScale;
    if (rightEye.current) rightEye.current.scale.y = blink * moodEyeScale;
    if (leftBrow.current) leftBrow.current.rotation.z = animation === 'sad' ? 0.2 : 0.08;
    if (rightBrow.current) rightBrow.current.rotation.z = animation === 'sad' ? -0.2 : -0.08;
    if (smile.current) {
      smile.current.visible = !speaking;
      smile.current.scale.y = animation === 'sad' ? -1 : animation === 'happy' ? 1.12 : 1;
    }
    if (mouth.current) {
      mouth.current.visible = speaking;
      mouth.current.scale.y = speaking ? 0.65 + Math.abs(Math.sin(time * 14)) * 0.7 : 1;
    }
  });

  const green = '#91b966';
  const darkGreen = '#6e8e50';

  return (
    <group ref={root} position={[0, 0, 0]}>
      <group ref={leftLeg} position={[-0.17, 0.3, 0]}>
        <mesh castShadow position={[0, -0.11, 0]} scale={[0.14, 0.21, 0.15]}><sphereGeometry args={[1, 20, 18]} /><meshStandardMaterial color={green} roughness={0.58} /></mesh>
        <mesh castShadow position={[0, -0.22, 0.08]} scale={[0.17, 0.085, 0.21]}><sphereGeometry args={[1, 18, 16]} /><meshStandardMaterial color={darkGreen} roughness={0.5} /></mesh>
      </group>
      <group ref={rightLeg} position={[0.17, 0.3, 0]}>
        <mesh castShadow position={[0, -0.11, 0]} scale={[0.14, 0.21, 0.15]}><sphereGeometry args={[1, 20, 18]} /><meshStandardMaterial color={green} roughness={0.58} /></mesh>
        <mesh castShadow position={[0, -0.22, 0.08]} scale={[0.17, 0.085, 0.21]}><sphereGeometry args={[1, 18, 16]} /><meshStandardMaterial color={darkGreen} roughness={0.5} /></mesh>
      </group>

      <group ref={leftArm} position={[-0.35, 0.9, 0]}>
        <mesh castShadow {...pointerProps} position={[0, -0.12, 0]} scale={[0.13, 0.22, 0.14]}><sphereGeometry args={[1, 20, 18]} /><meshStandardMaterial color={green} roughness={0.58} /></mesh>
        <mesh castShadow position={[0, -0.27, 0.03]} scale={[0.12, 0.105, 0.12]}><sphereGeometry args={[1, 16, 14]} /><meshStandardMaterial color="#e1edbd" roughness={0.55} /></mesh>
      </group>
      <group ref={rightArm} position={[0.35, 0.9, 0]}>
        <mesh castShadow {...pointerProps} position={[0, -0.12, 0]} scale={[0.13, 0.22, 0.14]}><sphereGeometry args={[1, 20, 18]} /><meshStandardMaterial color={green} roughness={0.58} /></mesh>
        <mesh castShadow position={[0, -0.27, 0.03]} scale={[0.12, 0.105, 0.12]}><sphereGeometry args={[1, 16, 14]} /><meshStandardMaterial color="#e1edbd" roughness={0.55} /></mesh>
      </group>

      <group ref={body} position={[0, 0.78, 0]}>
        <mesh castShadow {...pointerProps} scale={[0.4, 0.46, 0.33]}><sphereGeometry args={[1, 32, 28]} /><meshStandardMaterial color={green} roughness={0.55} metalness={0.02} /></mesh>
        <mesh position={[0, -0.035, 0.28]} scale={[0.255, 0.31, 0.075]}><sphereGeometry args={[1, 24, 20]} /><meshStandardMaterial color="#f7f1df" roughness={0.7} /></mesh>
        <mesh position={[0, 0.34, 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[0.37, 0.085, 0.37]}>
          <torusGeometry args={[0.78, 0.13, 8, 28]} /><meshStandardMaterial color="#ef8b72" roughness={0.48} />
        </mesh>
        <mesh position={[0.19, 0.22, 0.28]} rotation={[0, 0, -0.2]} scale={[0.075, 0.12, 0.045]}><sphereGeometry args={[1, 18, 16]} /><meshStandardMaterial color="#e77f69" roughness={0.5} /></mesh>
        <mesh castShadow position={[0.39, 0.03, -0.16]} scale={[0.21, 0.2, 0.2]}><sphereGeometry args={[1, 18, 16]} /><meshStandardMaterial color={darkGreen} roughness={0.55} /></mesh>
      </group>

      <group ref={head} position={[0, 1.39, 0]}>
        <mesh castShadow {...pointerProps} scale={[0.56, 0.5, 0.44]}><sphereGeometry args={[1, 40, 36]} /><meshStandardMaterial color="#a9d174" roughness={0.5} metalness={0.015} /></mesh>

        <group ref={leftEar} position={[-0.41, 0.24, 0]}>
          <mesh castShadow scale={[0.145, 0.19, 0.12]}><sphereGeometry args={[1, 22, 18]} /><meshStandardMaterial color={green} roughness={0.5} /></mesh>
          <mesh position={[0, 0, 0.09]} scale={[0.074, 0.105, 0.032]}><sphereGeometry args={[1, 18, 16]} /><meshStandardMaterial color="#f2a18c" roughness={0.6} /></mesh>
        </group>
        <group ref={rightEar} position={[0.41, 0.24, 0]}>
          <mesh castShadow scale={[0.145, 0.19, 0.12]}><sphereGeometry args={[1, 22, 18]} /><meshStandardMaterial color={green} roughness={0.5} /></mesh>
          <mesh position={[0, 0, 0.09]} scale={[0.074, 0.105, 0.032]}><sphereGeometry args={[1, 18, 16]} /><meshStandardMaterial color="#f2a18c" roughness={0.6} /></mesh>
        </group>

        <group position={[0, 0.45, 0.015]}>
          <mesh position={[0, 0.04, 0]} scale={[0.033, 0.11, 0.032]}><capsuleGeometry args={[0.04, 0.11, 5, 10]} /><meshStandardMaterial color="#7e9e55" roughness={0.55} /></mesh>
          <mesh position={[-0.105, 0.12, 0]} rotation={[0, 0, 0.52]} scale={[0.17, 0.075, 0.045]}><sphereGeometry args={[1, 22, 18]} /><meshStandardMaterial color="#8fba5a" roughness={0.48} /></mesh>
          <mesh position={[0.105, 0.15, -0.012]} rotation={[0, 0, -0.52]} scale={[0.17, 0.078, 0.045]}><sphereGeometry args={[1, 22, 18]} /><meshStandardMaterial color="#a9cf69" roughness={0.48} /></mesh>
          <mesh position={[0, 0.22, -0.025]} rotation={[0, 0, 0.02]} scale={[0.095, 0.12, 0.04]}><sphereGeometry args={[1, 22, 18]} /><meshStandardMaterial color="#c7e977" roughness={0.48} /></mesh>
        </group>

        <mesh ref={leftBrow} position={[-0.19, 0.18, 0.39]} scale={[0.084, 0.019, 0.015]}><sphereGeometry args={[1, 18, 14]} /><meshStandardMaterial color="#75914e" roughness={0.55} /></mesh>
        <mesh ref={rightBrow} position={[0.19, 0.18, 0.39]} scale={[0.084, 0.019, 0.015]}><sphereGeometry args={[1, 18, 14]} /><meshStandardMaterial color="#75914e" roughness={0.55} /></mesh>

        <group ref={leftEye} position={[-0.19, 0.035, 0.405]}>
          <mesh scale={[0.094, 0.118, 0.045]}><sphereGeometry args={[1, 24, 20]} /><meshStandardMaterial color="#fff9ef" roughness={0.32} /></mesh>
          <mesh position={[0, -0.006, 0.034]} scale={[0.063, 0.086, 0.028]}><sphereGeometry args={[1, 24, 20]} /><meshPhysicalMaterial color="#805542" roughness={0.24} clearcoat={0.75} clearcoatRoughness={0.12} /></mesh>
          <mesh position={[0, -0.009, 0.053]} scale={[0.043, 0.063, 0.018]}><sphereGeometry args={[1, 24, 20]} /><meshPhysicalMaterial color="#27232c" roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} /></mesh>
          <mesh position={[-0.019, 0.038, 0.07]} scale={[0.019, 0.024, 0.009]}><sphereGeometry args={[1, 16, 14]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
          <mesh position={[0.02, -0.032, 0.067]} scale={[0.009, 0.012, 0.006]}><sphereGeometry args={[1, 14, 12]} /><meshBasicMaterial color="#fff4e7" toneMapped={false} /></mesh>
        </group>
        <group ref={rightEye} position={[0.19, 0.035, 0.405]}>
          <mesh scale={[0.094, 0.118, 0.045]}><sphereGeometry args={[1, 24, 20]} /><meshStandardMaterial color="#fff9ef" roughness={0.32} /></mesh>
          <mesh position={[0, -0.006, 0.034]} scale={[0.063, 0.086, 0.028]}><sphereGeometry args={[1, 24, 20]} /><meshPhysicalMaterial color="#805542" roughness={0.24} clearcoat={0.75} clearcoatRoughness={0.12} /></mesh>
          <mesh position={[0, -0.009, 0.053]} scale={[0.043, 0.063, 0.018]}><sphereGeometry args={[1, 24, 20]} /><meshPhysicalMaterial color="#27232c" roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} /></mesh>
          <mesh position={[-0.019, 0.038, 0.07]} scale={[0.019, 0.024, 0.009]}><sphereGeometry args={[1, 16, 14]} /><meshBasicMaterial color="#ffffff" toneMapped={false} /></mesh>
          <mesh position={[0.02, -0.032, 0.067]} scale={[0.009, 0.012, 0.006]}><sphereGeometry args={[1, 14, 12]} /><meshBasicMaterial color="#fff4e7" toneMapped={false} /></mesh>
        </group>

        <mesh position={[-0.31, -0.115, 0.345]} scale={[0.073, 0.038, 0.022]}><sphereGeometry args={[1, 18, 16]} /><meshStandardMaterial color="#ef9c83" transparent opacity={0.7} roughness={0.6} /></mesh>
        <mesh position={[0.31, -0.115, 0.345]} scale={[0.073, 0.038, 0.022]}><sphereGeometry args={[1, 18, 16]} /><meshStandardMaterial color="#ef9c83" transparent opacity={0.7} roughness={0.6} /></mesh>
        <mesh position={[0, -0.075, 0.447]} scale={[0.031, 0.023, 0.02]}><sphereGeometry args={[1, 18, 16]} /><meshStandardMaterial color="#d88472" roughness={0.42} /></mesh>
        <mesh ref={smile} position={[0, -0.155, 0.442]}>
          <tubeGeometry args={[SMILE_CURVE, 20, 0.009, 7, false]} />
          <meshStandardMaterial color="#684747" roughness={0.48} />
        </mesh>
        <group ref={mouth} position={[0, -0.16, 0.446]} visible={false}>
          <mesh scale={[0.057, 0.043, 0.02]}><sphereGeometry args={[1, 20, 18]} /><meshStandardMaterial color="#684747" roughness={0.5} /></mesh>
          <mesh position={[0, -0.021, 0.012]} scale={[0.028, 0.012, 0.008]}><sphereGeometry args={[1, 16, 12]} /><meshStandardMaterial color="#ed8b82" roughness={0.48} /></mesh>
        </group>
      </group>

      <mesh castShadow position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.43, 0.24, 1]}>
        <circleGeometry args={[1, 40]} /><meshBasicMaterial color="#70864c" transparent opacity={0.13} />
      </mesh>
    </group>
  );
}
