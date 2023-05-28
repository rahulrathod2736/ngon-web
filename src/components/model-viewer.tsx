import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import React, { Suspense, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

function Loader() {
  const progress = useProgress();

  return (
    <Html className="flex flex-col">
      <div className="text-xs">Loading 3D Model</div>
      <div>{progress.progress.toFixed()} %</div>
    </Html>
  );
}

const gltfLoader = new GLTFLoader();

interface IProps {
  modelUrl: string;
}

export const ModelViewer = ({ modelUrl }: IProps) => {
  const [gltf, setGltf] = useState<GLTF>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const urlGltf = modelUrl || `/m1.glb`;

    gltfLoader.loadAsync(urlGltf).then((g: GLTF) => {
      setGltf(g);
      setIsLoading(false);
    });
  }, [modelUrl]);

  return (
    <div className="relative w-full h-full">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <BiLoaderAlt className="animate-spin" />
        </div>
      ) : (
        <Canvas
          style={{ filter: `blur(${isLoading ? 2 : 0}px)` }}
          className="rounded-md"
          dpr={[1, 2]}
          camera={{ fov: 75, position: [0, 0, 10] }}
        >
          <ambientLight intensity={1} />
          <spotLight
            intensity={0.5}
            angle={0.1}
            penumbra={1}
            position={[10, 15, 10]}
            castShadow
          />
          <Suspense fallback={null}>
            {gltf && (
              <primitive object={gltf.scene} scale={3} class="rounded-md" />
            )}
          </Suspense>
          <OrbitControls />
        </Canvas>
      )}
    </div>
  );
};
