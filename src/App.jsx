import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { createXRStore, XR } from '@react-three/xr'

const store = createXRStore()

const planetData = [
  { name: "Mercury", texture: "/textures/mercury.jpg", radius: 2.5, size: 0.2, speed: 0.9 },
  { name: "Venus", texture: "/textures/venus.jpg", radius: 3.5, size: 0.3, speed: 0.7 },
  { name: "Earth", texture: "/textures/earth.jpg", radius: 4.5, size: 0.4, speed: 0.5 },
  { name: "Mars", texture: "/textures/mars.jpg", radius: 5.5, size: 0.35, speed: 0.45 },
  { name: "Jupiter", texture: "/textures/jupiter.jpg", radius: 7, size: 0.8, speed: 0.3 },
  { name: "Saturn", texture: "/textures/saturn.jpg", radius: 9, size: 0.7, speed: 0.25 },
  { name: "Uranus", texture: "/textures/uranus.jpg", radius: 11, size: 0.6, speed: 0.2 },
  { name: "Neptune", texture: "/textures/neptune.jpg", radius: 13, size: 0.6, speed: 0.15 }
];

function Planet({ texture, radius, size, speed, name, onClick }) {
  const ref = useRef();
  const map = useTexture(texture);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.x = Math.cos(t * speed) * radius;
    ref.current.position.z = Math.sin(t * speed) * radius;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} onClick={() => onClick(name)}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial map={map} />
    </mesh>
  );
}

function SolarSystem({ onPlanetClick }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight intensity={2} position={[0, 0, 0]} />
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={1} />
		<Html center>
    <div style={{
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,0,0.5) 0%, rgba(255,140,0,0) 80%)',
      filter: 'blur(5px)',
    }} />
  </Html>
      </mesh>
      {planetData.map((planet) => (
        <Planet key={planet.name} {...planet} onClick={onPlanetClick} />
      ))}
    </>
  );
}

export default function App() {
	

  const [selected, setSelected] = useState(null);

  return (
    <>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas>
        <XR store={store}>
          <Suspense fallback={null}>
            <SolarSystem onPlanetClick={setSelected} />
          </Suspense>
        </XR>
      </Canvas>
      {selected && (
        <div className="info-card">
          <h2>{selected}</h2>
          <p>Here’s some info about {selected}...</p>
        </div>
      )}
    </>
  );
}
