import React from 'react';
import { useSelector } from 'react-redux';
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Scene,
} from '@babylonjs/core';
import styled from 'styled-components';

import SceneComponent from '@components/SceneComponent';
import { selectIsLoggedIn } from '@store/auth';

const Wrap = styled.div`
  position: relative;
  height: 100vh;
`;

const Title = styled.h1`
  position: fixed;
  left: 20px;
  top: 0;
  color: #fff;
`;

let box: Mesh;

const MainContainer = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const onSceneReady = (scene: Scene) => {
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    const canvas = scene.getEngine().getRenderingCanvas() as HTMLElement;

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'box' shape.
    box = MeshBuilder.CreateBox('box', { size: 2 }, scene);

    // Move the box upward 1/2 its height
    box.position.y = 1;

    // Our built-in 'ground' shape.
    MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
  };

  const onRender = (scene: Scene) => {
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 10;
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
  };

  return (
    <Wrap>
      <Title>
        Electron React Typescript{' '}
        <span role="img" aria-label="emoji">
          ❤️
        </span>{' '}
        BabylonJS
      </Title>
      <SceneComponent
        onRender={onRender}
        onSceneReady={onSceneReady}
        id="canvas"
      />
    </Wrap>
  );
};

export default MainContainer;
