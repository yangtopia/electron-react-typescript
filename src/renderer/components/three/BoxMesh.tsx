import React, { useRef, useState } from 'react';
import { useFrame } from 'react-three-fiber';
import { Mesh } from 'three';
import _update from 'lodash/update';
import { MeshProps } from './types';

const BoxMesh: React.FC<MeshProps> = (props) => {
  const mesh = useRef<Mesh>();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current) {
      _update(mesh.current, 'rotation.y', (value: number) => {
        return value + 0.01;
      });
      const rotationY = mesh.current.rotation.y;
      _update(mesh.current, 'rotation.x', () => {
        return rotationY + 0.01;
      });
    }
  });
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [2, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? 'hotpink' : 'orange'}
      />
    </mesh>
  );
};

export default BoxMesh;
