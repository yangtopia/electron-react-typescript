import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Vector3 } from 'three';
import { TrackballControls, Stars } from 'drei';
import { Canvas, CanvasContext } from 'react-three-fiber';
import { Subject, fromEvent } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import BoxMesh from '@components/three/BoxMesh';
import ExtrudeMesh from '@components/three/ExtrudeMesh';

const Wrap = styled.div`
  position: relative;
  /* width: 50%; */
  width: 100%;
  height: 100%;
  background-color: #000;
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

  const eventSubsc = mousemoveEvent$
    .pipe(withLatestFrom(canvasContext$))
    .subscribe(([event, ctx]) => {
      event.preventDefault();
      const { raycaster, camera, scene } = ctx;
      const { layerX, layerY } = event;
      const x = (layerX / window.innerWidth) * 2 - 1;
      const y = (layerY / window.innerHeight) * 2 + 1;
      const mouseVector = new Vector3(x, y, 0.5);
      raycaster.setFromCamera(mouseVector, camera);

      const intersects = raycaster.intersectObjects(scene.children);
    });

  useEffect(() => {
    return () => {
      eventSubsc.unsubscribe();
    };
  }, []);

  return (
    <Wrap>
      <Title>Electron React Typescript X ThreeJS</Title>
      <Canvas
        colorManagement
        onCreated={(context) => canvasContext$.next(context)}
      >
        <Stars />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <BoxMesh position={[-1.2, 0, 0]} />
        <BoxMesh position={[1.2, 0, 0]} />
        <ExtrudeMesh />
        <TrackballControls />
      </Canvas>
    </Wrap>
  );
};

export default ThreeContainer;
