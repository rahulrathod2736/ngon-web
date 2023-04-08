import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as Three from "three";
import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight, Center, Environment, OrbitControls, useProgress, Html } from '@react-three/drei'

interface IProps { modelPath: string, scale?: number, position?: number[], texturePath?: string }

const GltfModel = ({ modelPath, scale = 1, position = [0, 0, 0], texturePath = '/public/pexels-seamlesstextures-11255401.jpg' }: IProps) => {
    const ref = useRef<any>();
    const { scene, materials, nodes, } = useLoader(GLTFLoader, modelPath);
    const [hovered, hover] = useState(false);
    const texture = new Three.TextureLoader().load(texturePath);
    const material = new Three.MeshPhongMaterial({ map: texture });

    useEffect(() => {
        scene.children.map((child) => {
            if (child instanceof Three.Mesh) {
                if (child.isMesh) {
                    child.material = material;
                }
            }
        });
    }, [texture, scene]);

    return (
        <>
            <mesh castShadow>
                {/* <sphereGeometry args={[0.75, 200, 200]} /> */}
                <primitive
                    ref={ref}
                    object={scene}
                    position={position}
                    scale={hovered ? scale * 1.2 : scale}
                    angle={0.15}
                    dispose={null} />
                {/* <meshStandardMaterial metalness={1} map={texture} /> */}
            </mesh>
        </>
    );
};

const CanvasLoader = () => {
    const { progress } = useProgress();
    return (
        <Html
            as='div'
            center
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <span className='canvas-loader'></span>
            <p
                style={{
                    fontSize: 14,
                    color: "#F1F1F1",
                    fontWeight: 800,
                    marginTop: 40,
                }}
            >
                {progress.toFixed(2)}%
            </p>
        </Html>
    );
};



export default function GLBModelViewer({ modelPath, scale = 1, position = [0, 0, 0], texturePath }: IProps) {
    return (
        <div className="h-full">
            <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }} className="rounded-lg">
                <group position={[0, 0, 0]}>
                    <Suspense fallback={<CanvasLoader />}>
                        {/* <GltfModel modelPath={modelPath} scale={scale} position={position} texturePath={texturePath} /> */}
                        <Sphere modelPath={modelPath} />
                    </Suspense>
                    <AccumulativeShadows temporal frames={200} color="purple" colorBlend={0.5} opacity={1} scale={10} alphaTest={0.85}>
                        <RandomizedLight amount={8} radius={5} ambient={0.5} position={[5, 3, 2]} bias={0.001} />
                    </AccumulativeShadows>
                </group>
                <Env />
                <OrbitControls
                    autoRotate
                    autoRotateSpeed={10}
                    enablePan={false}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 2.1}
                    maxPolarAngle={Math.PI / 2.1}
                />
            </Canvas>
        </div>
    )
}

function Sphere({ modelPath }: { modelPath: string }) {
    return (
        <Center top>
            <GltfModel modelPath={modelPath} scale={1} position={[0, 0, 0]} />
        </Center>
    )
}

function Env() {
    const envs: ("sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "city" | "park" | "lobby")[] = ["sunset", "dawn", "night", "warehouse", "forest", "apartment", "studio", "city", "park", "lobby"];
    const random = Math.floor(Math.random() * envs.length);
    const [preset, setPreset] = useState<"sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "city" | "park" | "lobby">(envs[random])

    return <Environment preset={"sunset"} background blur={0.65} />
}
