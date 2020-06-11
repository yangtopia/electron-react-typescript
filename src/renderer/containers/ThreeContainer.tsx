import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Vector2, Color, Mesh, MeshStandardMaterial } from 'three';
import { TrackballControls } from 'drei';
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

import BoxMesh from '@components/three/BoxMesh';
import ExtrudeMesh from '@components/three/ExtrudeMesh';

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

  const [t, setT] = useState();

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

  // intersectedFrontMesh$.subscribe((mesh) => {
  //   if (mesh) {
  //     const material = mesh.material as MeshStandardMaterial;
  //     material.color = new Color('hotpink');
  //     setT(mesh);
  //   } else {

  //   }
  //   console.log(mesh);
  // });

  // .subscribe(([event, ctx]) => {
  //   event.preventDefault();
  //   const { raycaster, camera, scene } = ctx;
  //   const { clientX, clientY } = event;
  //   const mouseX = (clientX / window.innerWidth) * 2 - 1;
  //   const mouseY = -(clientY / window.innerHeight) * 2 + 1;
  //   const mouseVector = new Vector2(mouseX, mouseY);

  //   raycaster.setFromCamera(mouseVector, camera);

  //   const intersects = raycaster.intersectObjects(scene.children);
  // if (intersects.length > 0) {
  //   const head = intersects[0];
  //   const object = head.object as Mesh;
  //   const material = object.material as MeshStandardMaterial;
  //   const currentHex = material.emissive.getHex();
  //   if (currentHex === 0) {
  //     material.emissive.setHex(0xff000);
  //   } else {
  //     material.emissive.setHex(0);
  //   }
  // }
  // });

  useEffect(() => {
    return () => {
      // intersects$.unsubscribe();
    };
  }, []);

  return (
    <Wrap>
      <Title>Electron React Typescript X ThreeJS</Title>
      <Canvas
        colorManagement
        onCreated={(context) => canvasContext$.next(context)}
      >
        {/* <spotLight color={new Color(0x555555)} angle={1.5} /> */}
        <ambientLight color={new Color(0x555555)} />
        <pointLight position={[10, 10, 10]} />
        <BoxMesh position={[-1.2, 0, 0]} name="box1" />
        <BoxMesh position={[1.2, 0, 0]} name="box2" />
        {/* <ExtrudeMesh /> */}
        <TrackballControls rotateSpeed={1.0} zoomSpeed={1.2} panSpeed={0.8} />
      </Canvas>
    </Wrap>
  );
};

export default ThreeContainer;
