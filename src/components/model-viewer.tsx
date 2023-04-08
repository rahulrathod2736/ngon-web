import { Canvas } from "@react-three/fiber";
import { OrbitControls, useProgress, Html } from "@react-three/drei";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

function Loader() {
  const progress = useProgress();
  console.log(progress);
  return (
    <Html className="flex flex-col">
      <div className="text-xs">Loading 3D Model</div>
      <div>{progress.progress.toFixed()} %</div>
    </Html>
  );
}

const gltfLoader = new GLTFLoader();

export const ModelViewer = () => {
  const [gltf, setGltf] = useState<GLTF>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const urlGltf = `/public/m1.glb`;
    gltfLoader.loadAsync(urlGltf).then((g: GLTF) => {
      setGltf(g);
      setIsLoading(false);
    });
  }, []);

  // React.useEffect(() => {
  //   const url = "/public/m1.glb";
  //   const gltf = useLoader(GLTFLoader, url);

  // }, []);
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
          {gltf && (
            <primitive object={gltf.scene} scale={3} class="rounded-md" />
          )}
          <ambientLight />
          <OrbitControls />
        </Canvas>
      )}
    </div>
    // <Canvas
    //   dpr={[1, 2]}
    //   camera={{ fov: 75, position: [0, 0, 10] }}
    //   className="bg-white"
    // >
    //   <ambientLight intensity={0.5} />
    //   <spotLight intensity={0.8} position={[300, 300, 400]} />
    //   <Suspense fallback={<Loader />}>
    //     <OrbitControls />
    //     <Environment preset="city" />
    //   </Suspense>
    // </Canvas>
  );
};
