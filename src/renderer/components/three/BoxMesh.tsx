import React, { useRef, useState, memo } from 'react';
import { useFrame } from 'react-three-fiber';
import { Mesh } from 'three';
import _update from 'lodash/update';
import { MeshProps } from './types';
import { UseDatGuiParams } from './useDatGUI';

export interface BoxMeshConfig extends UseDatGuiParams {
  name: string;
  isRotation: boolean;
  scaleX: {
    initialValue: number;
    min: number;
    max: number;
    step: number;
  };
}

interface Props extends MeshProps {
  config: BoxMeshConfig;
}

const BoxMesh: React.FC<Props> = ({ config, ...rest }) => {
  const mesh = useRef<Mesh>();
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current && config.isRotation) {
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
    <mesh {...rest} ref={mesh} scale={[config.scaleX.initialValue, 1, 1]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color="orange" />
    </mesh>
  );
};

export default memo(BoxMesh);
