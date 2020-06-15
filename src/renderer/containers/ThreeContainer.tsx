import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Vector2, Color, Mesh, MeshStandardMaterial } from 'three';
import { Sky, OrbitControls } from 'drei';
import { Canvas, CanvasContext } from 'react-three-fiber';
import { Subject, fromEvent } from 'rxjs';
import {
  map,
  withLatestFrom,
  distinctUntilChanged,
  scan,
  startWith,
} from 'rxjs/operators';
import _update from 'lodash/update';
import _head from 'lodash/head';
import _isEqual from 'lodash/isEqual';
import _intersectionWith from 'lodash/intersectionWith';
import _differenceWith from 'lodash/differenceWith';
import _unionWith from 'lodash/unionWith';

import BoxMesh from '@components/three/BoxMesh';
import BoxDatGUI, { BoxMeshConfig } from '@components/three/BoxDatGUI';

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Title = styled.h1`
  position: absolute;
  left: 20px;
  top: 0;
  color: #fff;
  z-index: 1;
`;

interface MouseEventExtended extends MouseEvent {
  layerX: number;
  layerY: number;
}

const ThreeContainer = () => {
  const initialBoxData: BoxMeshConfig = {
    name: 'react-dat-gui',
    isRotation: false,
    scaleX: 1,
  };
  const [boxMeshConfig, setBoxMeshConfig] = useState(initialBoxData);

  const mousemoveEvent$ = fromEvent<MouseEventExtended>(window, 'mousemove');
  const canvasContext$ = new Subject<CanvasContext>();

  const intersectedFrontMesh$ = mousemoveEvent$.pipe(
    withLatestFrom(canvasContext$),
    map(([event, ctx]) => {
      event.preventDefault();
      const { raycaster, camera, scene } = ctx;
      const { clientX, clientY } = event;
      const mouseX = (clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(clientY / window.innerHeight) * 2 + 1;
      const mouseVector = new Vector2(mouseX, mouseY);

      raycaster.setFromCamera(mouseVector, camera);

      const intersects = raycaster.intersectObjects(scene.children);
      return _head(intersects.map((intersected) => intersected.object as Mesh));
    }),
    distinctUntilChanged(),
  );

  useEffect(() => {
    const initCanvasSubsc = canvasContext$.subscribe((ctx) => {
      const { camera } = ctx;
      camera.position.set(0, 1.5, 3);
      return ctx;
    });

    const hoveredIntersectedSubsc = intersectedFrontMesh$
      .pipe(
        scan<Mesh | undefined, [Mesh | undefined, boolean]>(
          (acc, value) => {
            if (value) {
              const prevMesh = acc[0];
              if (prevMesh) {
                const prevMeshMaterial = prevMesh.material as MeshStandardMaterial;
                prevMeshMaterial.color = new Color('orange');
              }
              return [value, true];
            }
            return [acc[0], false];
          },
          [undefined, false],
        ),
        startWith([undefined, false]),
      )
      .subscribe((meshs) => {
        const [mesh, isHovered] = meshs as [Mesh | undefined, boolean];
        if (mesh) {
          const material = mesh.material as MeshStandardMaterial;
          material.color = isHovered
            ? new Color('hotpink')
            : new Color('orange');
        }
      });
    return () => {
      initCanvasSubsc.unsubscribe();
      hoveredIntersectedSubsc.unsubscribe();
    };
  }, []);

  return (
    <Wrap>
      <BoxDatGUI data={boxMeshConfig} onUpdate={setBoxMeshConfig} />
      <Title>Electron React Typescript X ThreeJS</Title>
      <Canvas
        colorManagement
        onCreated={(context) => canvasContext$.next(context)}
      >
        <Sky />
        <spotLight color={new Color(0x555555)} angle={1.5} />
        <ambientLight color={new Color(0x555555)} />
        <pointLight position={[10, 10, 10]} />
        <BoxMesh name="box1" config={boxMeshConfig} />
        <OrbitControls />
      </Canvas>
    </Wrap>
  );
};

export default ThreeContainer;
