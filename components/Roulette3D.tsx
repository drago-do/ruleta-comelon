import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Text,
  OrbitControls,
  Environment,
  Center,
} from "@react-three/drei";
import * as THREE from "three";
import VictoryScreen from "./VictoryScreen";
import Image from "next/image";

interface Roulette3DProps {
  comida: string[];
  bebidas: string[];
  onBack: () => void;
}

// Pre-load the models
useGLTF.preload("/models/ruleta.glb");
useGLTF.preload("/models/flecha.glb");

// Easing function for smooth deceleration
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function RouletteWheel({
  url,
  items,
  position,
  scale,
  color,
  label,
  isSpinning,
  spinDuration,
  onFinish,
  targetItemIndex,
  pointerAngleOffset,
}: {
  url: string;
  items: string[];
  position: [number, number, number];
  scale: number;
  color: string;
  label: string;
  isSpinning: boolean;
  spinDuration: number;
  onFinish: (winnerIndex: number) => void;
  targetItemIndex: number;
  pointerAngleOffset: number;
}) {
  const { scene } = useGLTF(url);
  const copiedScene = React.useMemo(() => scene.clone(), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const radius = 1.3;
  const angleStep = (Math.PI * 2) / Math.max(items.length, 1);

  const [startTime, setStartTime] = useState<number | null>(null);
  const startRotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const lastClackAngleRef = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio("/audio/clack.mp3");
    audioRef.current.volume = 0.6;
  }, []);

  useEffect(() => {
    if (isSpinning) {
      setStartTime(Date.now());
      startRotationRef.current = groupRef.current?.rotation.y || 0;

      const fullSpins = 5 + Math.random() * 3; // 5 to 8 full extra spins
      const winningAngle = targetItemIndex * angleStep;

      const targetRotationBase = pointerAngleOffset - winningAngle;

      const currentNorm = startRotationRef.current % (Math.PI * 2);
      let diff = targetRotationBase - currentNorm;
      if (diff < 0) diff += Math.PI * 2;

      targetRotationRef.current =
        startRotationRef.current + diff + fullSpins * Math.PI * 2;
    } else {
      setStartTime(null);
    }
  }, [isSpinning, targetItemIndex, pointerAngleOffset, angleStep]);

  useFrame(() => {
    if (isSpinning && startTime !== null && groupRef.current) {
      const elapsed = Date.now() - startTime;
      let progress = elapsed / spinDuration;

      if (progress >= 1) {
        progress = 1;
        groupRef.current.rotation.y = targetRotationRef.current;
        setStartTime(null); // Stop frame loop
        onFinish(targetItemIndex);
      } else {
        const eased = easeOutCubic(progress);
        const currentRotation =
          startRotationRef.current +
          (targetRotationRef.current - startRotationRef.current) * eased;
        groupRef.current.rotation.y = currentRotation;

        const slicesPassed = Math.floor(
          (currentRotation - pointerAngleOffset + angleStep / 2) / angleStep,
        );
        if (slicesPassed > lastClackAngleRef.current) {
          lastClackAngleRef.current = slicesPassed;
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }
      }
    }
  });

  return (
    <group position={position} scale={scale}>
      <Text
        position={[0, 2, 0]}
        color={color}
        fontSize={0.4}
        fontWeight="bold"
        outlineWidth={0.02}
        outlineColor="white"
      >
        {label}
      </Text>

      <group ref={groupRef}>
        <primitive object={copiedScene} />
        {items.length > 0 ? (
          items.map((item, index) => {
            const angle = index * angleStep;
            const x = Math.cos(angle) * radius;
            const z = -Math.sin(angle) * radius;

            return (
              <Text
                key={index}
                position={[x, 0.2, z]}
                rotation={[-Math.PI / 2, 0, angle]}
                fontSize={0.2}
                color="white"
                outlineWidth={0.015}
                outlineColor={color}
                anchorX="center"
                anchorY="middle"
                maxWidth={radius * 1.5}
                textAlign="center"
              >
                {item}
              </Text>
            );
          })
        ) : (
          <Text
            position={[0, 0.2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color="white"
          >
            Vacío
          </Text>
        )}
      </group>
    </group>
  );
}

function Pointer({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const { scene } = useGLTF("/models/flecha.glb");
  const copiedScene = React.useMemo(() => scene.clone(), [scene]);

  return (
    <group position={position} rotation={rotation} scale={1.5}>
      <primitive object={copiedScene} />
    </group>
  );
}

export default function Roulette3D({
  comida,
  bebidas,
  onBack,
}: Roulette3DProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [comidaFinished, setComidaFinished] = useState(false);
  const [bebidasFinished, setBebidasFinished] = useState(false);
  const [results, setResults] = useState<{
    comida: string | null;
    bebidas: string | null;
  }>({ comida: null, bebidas: null });

  const [comidaTarget, setComidaTarget] = useState(0);
  const [bebidasTarget, setBebidasTarget] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;

    setComidaTarget(Math.floor(Math.random() * Math.max(comida.length, 1)));
    setBebidasTarget(Math.floor(Math.random() * Math.max(bebidas.length, 1)));

    setComidaFinished(false);
    setBebidasFinished(false);
    setShowVictory(false);
    setIsSpinning(true);
  };

  const onComidaFinish = (index: number) => {
    setComidaFinished(true);
    setResults((prev) => ({ ...prev, comida: comida[index] || "Nada" }));
  };

  const onBebidasFinish = (index: number) => {
    setBebidasFinished(true);
    setResults((prev) => ({ ...prev, bebidas: bebidas[index] || "Nada" }));
  };

  const handleRestartSpin = () => {
    setShowVictory(false);
    setResults({ comida: null, bebidas: null });
    // Small delay to allow react to flush the state change before rotating again
    setTimeout(handleSpin, 50);
  };

  useEffect(() => {
    if (comidaFinished && bebidasFinished) {
      setIsSpinning(false);
      // Small pause before full reveal for suspension
      setTimeout(() => setShowVictory(true), 1000);
    }
  }, [comidaFinished, bebidasFinished]);

  return (
    <div className="fixed inset-0 z-50 bg-yellow-400 flex flex-col">
      <div className="p-4 flex justify-between items-center bg-red-600 text-white shadow-md z-10 relative border-b-8 border-red-800">
        <h2 className="text-3xl font-black italic uppercase drop-shadow-md">
          ¡El Casino del Hambre!
        </h2>
        <button
          onClick={onBack}
          disabled={isSpinning}
          className="bg-yellow-400 text-red-900 border-4 border-yellow-500 hover:bg-yellow-300 active:translate-y-1 px-6 py-2 rounded-full font-black uppercase transition-all shadow-lg disabled:opacity-50"
        >
          Volver
        </button>
      </div>

      <div className="flex-1 relative bg-linear-to-b from-yellow-300 to-yellow-500 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url('/images/Mantel.jpg')",
            backgroundSize: "cover",
          }}
        />

        <Canvas camera={{ position: [0, 8, 10], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <spotLight
            position={[10, 15, 10]}
            intensity={2}
            angle={0.3}
            penumbra={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="city" />

          <Suspense
            fallback={
              <Text
                position={[0, 0, 0]}
                fontSize={1}
                color="red"
                fontStyle="italic"
              >
                Cargando 3D...
              </Text>
            }
          >
            <Center>
              <group position={[0, -1, 0]}>
                <RouletteWheel
                  url="/models/ruleta.glb"
                  items={comida}
                  position={[-3, 0, 0]}
                  scale={2}
                  color="#b91c1c"
                  label="🍕 COMIDA"
                  isSpinning={isSpinning}
                  spinDuration={6000}
                  onFinish={onComidaFinish}
                  targetItemIndex={comidaTarget}
                  pointerAngleOffset={Math.PI / 2}
                />

                <RouletteWheel
                  url="/models/ruleta.glb"
                  items={bebidas}
                  position={[3, 0, 0]}
                  scale={1.5}
                  color="#1d4ed8"
                  label="🥤 BEBIDAS"
                  isSpinning={isSpinning}
                  spinDuration={8000}
                  onFinish={onBebidasFinish}
                  targetItemIndex={bebidasTarget}
                  pointerAngleOffset={Math.PI / 2}
                />

                <Pointer position={[-3, 0.5, 3]} rotation={[0, Math.PI, 0]} />
                <Pointer position={[3, 0.5, 2.3]} rotation={[0, Math.PI, 0]} />
              </group>
            </Center>
          </Suspense>

          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={20}
          />
        </Canvas>

        {/* Start Button */}
        {!isSpinning && !showVictory && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer z-10">
            <button
              onClick={handleSpin}
              className="bg-red-600 hover:bg-red-500 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-[0_12px_0_rgb(127,29,29)] active:shadow-[0_0px_0_rgb(127,29,29)] active:translate-y-[12px] transition-all border-4 border-white uppercase flex items-center gap-4 cursor-pointer"
            >
              ¡GIRAR!
              <Image
                src="/images/dados.png"
                alt="Dados"
                width={100}
                height={100}
                className="absolute -top-12 -right-12 rotate-12 drop-shadow-[5px_5px_0_rgba(0,0,0,1)] z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain"
              />
            </button>
          </div>
        )}

        {/* Victory Screen Overlay */}
        {showVictory && results.comida && results.bebidas && (
          <VictoryScreen
            comida={results.comida}
            bebida={results.bebidas}
            onRestart={handleRestartSpin}
            onNewMenu={onBack}
          />
        )}
      </div>
    </div>
  );
}
