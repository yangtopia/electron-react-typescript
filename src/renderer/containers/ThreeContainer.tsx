import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TrackballControls, Stars } from 'drei';
import { Canvas, CanvasContext } from 'react-three-fiber';
import { Subject, fromEvent } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import BoxMeshComponent from '@components/three/BoxMesh';
import ExtrudeMeshComponent from '@components/three/ExtrudeMesh';
import { Vector3 } from 'three';

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
      <Title>
        Electron React Typescript{' '}
        <span role="img" aria-label="emoji">
          ❤️
        </span>{' '}
        ThreeJS
      </Title>
      <Canvas
        colorManagement
        onCreated={(context) => canvasContext$.next(context)}
      >
        <Stars />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <BoxMeshComponent position={[-1.2, 0, 0]} />
        <BoxMeshComponent position={[1.2, 0, 0]} />
        <ExtrudeMeshComponent />
        <TrackballControls />
      </Canvas>
    </Wrap>
  );
};

export default ThreeContainer;
