import React, { useEffect } from 'react';
import { TrackballControls } from 'drei';
import _head from 'lodash/head';
import { Canvas, CanvasContext } from 'react-three-fiber';
import { fromEvent, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  scan,
  startWith,
  withLatestFrom,
} from 'rxjs/operators';
import styled from 'styled-components';
import { Color, Mesh, MeshStandardMaterial, Vector2 } from 'three';

import BoxMesh from '@components/three/BoxMesh';

const Wrap = styled.div`
  position: relative;
  /* width: 50%; */
  width: 100%;
  height: 100%;
  /* background-color: #000; */
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
  const mousemoveEvent$ = fromEvent<MouseEventExtended>(window, 'mousemove');
  const canvasContext$ = new Subject<CanvasContext>();

  const initCanvasContext$ = canvasContext$.pipe(
    map((ctx) => {
      const { scene } = ctx;
      scene.background = new Color('black');
      return ctx;
    }),
  );

  const intersectedFrontMesh$ = mousemoveEvent$.pipe(
    withLatestFrom(initCanvasContext$),
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
    const initCanvasSubsc = initCanvasContext$.subscribe();
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
      <Title>Electron React Typescript X ThreeJS</Title>
      <Canvas
        colorManagement
        onCreated={(context) => canvasContext$.next(context)}
      >
        <spotLight color={new Color(0x555555)} angle={1.5} />
        <ambientLight color={new Color(0x555555)} />
        <pointLight position={[10, 10, 10]} />
        <BoxMesh position={[-1.2, 0, 0]} name="box1" />
        <BoxMesh position={[1.2, 0, 0]} name="box2" />
        {/* <ExtrudeMesh /> */}
        <TrackballControls rotateSpeed={10.0} />
      </Canvas>
    </Wrap>
  );
};

export default ThreeContainer;
