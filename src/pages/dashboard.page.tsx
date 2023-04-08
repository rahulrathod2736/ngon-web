import { HiHomeModern } from "react-icons/hi2";
import { FiDownloadCloud } from "react-icons/fi";
import { AiTwotoneLike } from "react-icons/ai";
import { RiUserFollowFill } from "react-icons/ri";
// import "../client.ts";
import { STRINGS } from "../utils/constants/strings";

import { Canvas, useLoader } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useProgress,
  Html,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Suspense } from "react";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./m1.glb");
  return (
    <>
      <primitive object={gltf.scene} scale={1} />
    </>
  );
};

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center className="flex">
      {progress.toFixed()} % loaded
    </Html>
  );
}

export const DashboardPage = () => {
  return (
    <>
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 75, position: [0, 0, 10] }}
        className="bg-white"
      >
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.8} position={[300, 300, 400]} />
        <Suspense fallback={<Loader />}>
          <Model />
          <OrbitControls />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      {/* <div className="text-3xl">{STRINGS.DASHBOARD}</div>
      <div className="grid grid-cols-4 gap-4 my-4">
        <div className="bg-white py-4 px-4 rounded-lg drop-shadow-2xl flex items-center gap-4">
          <div className="bg-slate-100 w-14 h-14 flex items-center justify-center rounded-lg">
            <HiHomeModern size={24} className={"text-slate-800"} />
          </div>
          <div className="flex-1">
            <div className="font-semibold tracking-wider">Total Models</div>
            <div className="text-xl mt-2">1,25,124</div>
          </div>
        </div>
        <div className="bg-white py-4 px-4 rounded-lg drop-shadow-2xl flex items-center gap-4">
          <div className="bg-slate-100 w-14 h-14 flex items-center justify-center rounded-lg">
            <FiDownloadCloud size={24} className={"text-slate-800"} />
          </div>
          <div className="flex-1">
            <div className="font-semibold tracking-wider">Total Downloads</div>
            <div className="text-xl mt-2">1,25,124</div>
          </div>
        </div>
        <div className="bg-white py-4 px-4 rounded-lg drop-shadow-2xl flex items-center gap-4">
          <div className="bg-slate-100 w-14 h-14 flex items-center justify-center rounded-lg">
            <AiTwotoneLike size={24} className={"text-slate-800"} />
          </div>
          <div className="flex-1">
            <div className="font-semibold tracking-wider">Total Likes</div>
            <div className="text-xl mt-2">1,25,124</div>
          </div>
        </div>
        <div className="bg-white py-4 px-4 rounded-lg drop-shadow-2xl flex items-center gap-4">
          <div className="bg-slate-100 w-14 h-14 flex items-center justify-center rounded-lg">
            <RiUserFollowFill size={24} className={"text-slate-800"} />
          </div>
          <div className="flex-1">
            <div className="font-semibold tracking-wider">Total Followers</div>
            <div className="text-xl mt-2">1,25,124</div>
          </div>
        </div>
      </div> */}
    </>
  );
};
