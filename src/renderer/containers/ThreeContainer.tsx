import React from 'react';
import { Canvas as ThreeCanvas } from 'react-three-fiber';
import styled from 'styled-components';
import ThreeBoxComponent from '@components/three/Box';

const Wrap = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  background-color: aquamarine;
`;

const Title = styled.h1`
  position: absolute;
  left: 20px;
  top: 0;
  color: #fff;
`;

const ThreeContainer = () => {
  return (
    <Wrap>
      <Title>
        Electron React Typescript{' '}
        <span role="img" aria-label="emoji">
          ❤️
        </span>{' '}
        ThreeJS
      </Title>
      <ThreeCanvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <ThreeBoxComponent position={[-1.2, 0, 0]} />
        <ThreeBoxComponent position={[1.2, 0, 0]} />
      </ThreeCanvas>
    </Wrap>
  );
};

export default ThreeContainer;
