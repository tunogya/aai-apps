"use client";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect";
// import { OrbitControls } from "@react-three/drei";

export default function CSRPage() {
  const router = useRouter();

  return (
    <>
      <button
        className={
          "absolute text-black top-4 right-4 z-50 p-2 hover:bg-gray-100 bg-gray-200 rounded-full"
        }
        onClick={() => {
          router.back();
        }}
      >
        <XMarkIcon className={"w-5 h-5"} />
      </button>
      <Canvas>
        <ambientLight />
        <color attach="background" args={["black"]} />
        <Torus />
        {/*<OrbitControls />*/}
        <AsciiRenderer fgColor="white" bgColor="black" />
      </Canvas>
    </>
  );
}

function Torus() {
  const ref = useRef();
  useFrame((state, delta) => {
    // @ts-ignore
    ref.current.rotation.x = ref.current.rotation.y += delta / 2;
  });

  return (
    // @ts-ignore
    <mesh ref={ref} scale={1}>
      <torusGeometry args={[1, 0.4, 12, 48]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function AsciiRenderer({
  renderIndex = 1,
  characters = " .:-+*=%@#",
  invert = true,
  color = false,
  resolution = 0.15,
  fgColor,
  bgColor,
}: any) {
  const { size, gl, scene, camera } = useThree();
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, {
      invert,
      color,
      resolution,
    });
    effect.domElement.style.position = "absolute";
    effect.domElement.style.top = "0px";
    effect.domElement.style.left = "0px";
    effect.domElement.style.pointerEvents = "none";
    return effect;
  }, [characters, invert, color, resolution]);
  useLayoutEffect(() => {
    effect.domElement.style.color = fgColor;
    effect.domElement.style.backgroundColor = bgColor;
  }, [fgColor, bgColor]);
  useEffect(() => {
    gl.domElement.style.opacity = "0";
    // @ts-ignore
    gl.domElement.parentNode.appendChild(effect.domElement);
    return () => {
      gl.domElement.style.opacity = "1";
      // @ts-ignore
      gl.domElement.parentNode.removeChild(effect.domElement);
    };
  }, [effect]);
  useEffect(() => {
    effect.setSize(size.width, size.height);
  }, [effect, size]);

  useFrame((state) => {
    effect.render(scene, camera);
  }, renderIndex);

  return null;
}
