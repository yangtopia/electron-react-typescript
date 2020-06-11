import React, { useRef, useState, useMemo } from 'react';
import {
  Mesh,
  Vector2,
  Shape,
  Vector3,
  MathUtils,
  CatmullRomCurve3,
} from 'three';
import _update from 'lodash/update';
import { MeshProps } from './types';

const ExtrudeMesh: React.FC<MeshProps> = (props) => {
  const mesh = useRef<Mesh>();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const shape = useMemo(() => {
    const points: Vector2[] = [];
    const numPts = 5;
    for (let i = 0; i < numPts * 2; i += 1) {
      const l = i % 2 === 1 ? 10 : 20;
      const a = (i / numPts) * Math.PI;
      points.push(new Vector2(Math.cos(a) * l, Math.sin(a) * l));
    }
    return new Shape(points);
  }, []);

  const randomSpline = useMemo(() => {
    const points: Vector3[] = [];
    for (let i = 0; i < 10; i += 1) {
      points.push(
        new Vector3(
          (i - 4.5) * 50,
          MathUtils.randFloat(-50, 50),
          MathUtils.randFloat(-50, 50),
        ),
      );
    }
    return new CatmullRomCurve3(points);
  }, []);

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [2, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <extrudeBufferGeometry
        attach="geometry"
        args={[
          shape,
          { steps: 200, bevelEnabled: false, extrudePath: randomSpline },
        ]}
      />
      <meshStandardMaterial
        attach="material"
        color={hovered ? 'orange' : 'hotpink'}
      />
    </mesh>
  );
};

export default ExtrudeMesh;
