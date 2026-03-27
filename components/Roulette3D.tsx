import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Text, OrbitControls, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Roulette3DProps {
  comida: string[];
  bebidas: string[];
  onBack: () => void;
}

// Pre-load the models
useGLTF.preload('/models/ruleta.glb');
useGLTF.preload('/models/flecha.glb');

function RouletteWheel({ url, items, position, scale, color, label }: { url: string, items: string[], position: [number, number, number], scale: number, color: string, label: string }) {
  const { scene } = useGLTF(url);
  // Clone to safely have multiple instances
  const copiedScene = React.useMemo(() => scene.clone(), [scene]);
  
  // Text positioning
  const radius = 1.3; // Distance from center for text
  const angleStep = (Math.PI * 2) / Math.max(items.length, 1);

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
      
      <primitive object={copiedScene} />
      
      {items.length > 0 ? items.map((item, index) => {
        const angle = index * angleStep;
        // Adjust these depending on how your ruleta.glb is modeled
        // Usually up is Y, flat on XZ.
        const x = Math.cos(angle) * radius;
        const z = -Math.sin(angle) * radius; 
        
        return (
          <Text
            key={index}
            position={[x, 0.2, z]}
            // Rotate the text so it lies flat on the wheel but faces outward radially
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
      }) : (
        <Text position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.3} color="white">
          Vacío
        </Text>
      )}
    </group>
  );
}

function Pointer({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const { scene } = useGLTF('/models/flecha.glb');
  const copiedScene = React.useMemo(() => scene.clone(), [scene]);
  
  return (
    <group position={position} rotation={rotation} scale={1.5}>
      <primitive object={copiedScene} />
    </group>
  );
}

export default function Roulette3D({ comida, bebidas, onBack }: Roulette3DProps) {
  return (
    <div className="fixed inset-0 z-50 bg-yellow-400 flex flex-col">
      <div className="p-4 flex justify-between items-center bg-red-600 text-white shadow-md z-10 relative border-b-8 border-red-800">
        <h2 className="text-3xl font-black italic uppercase drop-shadow-md">¡El Casino del Hambre!</h2>
        <button 
          onClick={onBack} 
          className="bg-yellow-400 text-red-900 border-4 border-yellow-500 hover:bg-yellow-300 active:translate-y-1 px-6 py-2 rounded-full font-black uppercase transition-all shadow-lg"
        >
          Volver
        </button>
      </div>
      
      <div className="flex-1 relative bg-linear-to-b from-yellow-300 to-yellow-500 overflow-hidden">
        {/* Confeti Placeholder or Background Pattern if needed */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/images/Mantel.jpg')", backgroundSize: "cover" }} />

        <Canvas camera={{ position: [0, 8, 10], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 15, 10]} intensity={2} angle={0.3} penumbra={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="city" />
          
          <Suspense fallback={
            <Text position={[0, 0, 0]} fontSize={1} color="red" fontStyle="italic">Cargando 3D...</Text>
          }>
            <Center>
              <group position={[0, -1, 0]}>
                {/* Comida Roulette */}
                <RouletteWheel 
                  url="/models/ruleta.glb" 
                  items={comida} 
                  position={[-3, 0, 0]} 
                  scale={2} 
                  color="#b91c1c" // red-700
                  label="🍕 COMIDA" 
                />
                
                {/* Bebida Roulette */}
                <RouletteWheel 
                  url="/models/ruleta.glb" 
                  items={bebidas} 
                  position={[3, 0, 0]} 
                  scale={1.5} 
                  color="#1d4ed8" // blue-700
                  label="🥤 BEBIDAS"
                />

                {/* Pointers: positioned just outside the wheels */}
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
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
           <button className="bg-red-600 hover:bg-red-500 text-white font-black text-5xl px-16 py-8 rounded-full shadow-[0_12px_0_rgb(127,29,29)] active:shadow-[0_0px_0_rgb(127,29,29)] active:translate-y-[12px] transition-all border-4 border-white uppercase flex items-center gap-4">
             ¡GIRAR! 🎲
           </button>
        </div>
      </div>
    </div>
  );
}
