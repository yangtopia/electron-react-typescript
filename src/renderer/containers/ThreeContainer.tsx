import React, { useEffect } from 'react';
import styled from 'styled-components';
import { TrackballControls, Stars } from 'drei';
import { Canvas, CanvasContext } from 'react-three-fiber';
import { Subject } from 'rxjs';
import ThreeBoxComponent from '@components/three/Box';

const Wrap = styled.div`
  position: relative;
  width: 50%;
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

const ThreeContainer = () => {
  const canvasContext$ = new Subject<CanvasContext>();

  const canvasContextSubsc = canvasContext$.subscribe((ctx) => {
    console.log(ctx);
  });

  useEffect(() => {
    return () => {
      canvasContextSubsc.unsubscribe();
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
        <ThreeBoxComponent position={[-1.2, 0, 0]} />
        <ThreeBoxComponent position={[1.2, 0, 0]} />
        <TrackballControls />
      </Canvas>
    </Wrap>
  );
};

export default ThreeContainer;
