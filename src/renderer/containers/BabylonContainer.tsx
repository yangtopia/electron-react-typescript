import React, { useEffect, ChangeEvent } from 'react';
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  Nullable,
} from 'babylonjs';
import 'babylonjs-loaders';
import styled from 'styled-components';
import { Subject } from 'rxjs';
import { map, withLatestFrom, filter } from 'rxjs/operators';
import _isEmpty from 'lodash/isEmpty';
import _set from 'lodash/set';
import _update from 'lodash/update';

import SceneComponent from '@components/babylon/Scene';

const Wrap = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
`;

const Title = styled.h1`
  position: absolute;
  left: 20px;
  top: 0;
  color: #fff;
`;

const BabylonContainer = () => {
  const onSceneReady$ = new Subject<Scene>();
  const onRender$ = new Subject<Scene>();

  const boxMesh$ = onSceneReady$.pipe(
    map((scene) => {
      // This creates and positions a free camera (non-mesh)
      const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);

      // This targets the camera to scene origin
      camera.setTarget(Vector3.Zero());

      const canvas = scene.getEngine().getRenderingCanvas() as Nullable<
        HTMLElement
      >;

      if (canvas) {
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
      }

      // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
      const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene);

      // Default intensity is 1. Let's dim the light a small amount
      _set(light, 'intensity', 0.7);

      // Our built-in 'box' shape.
      const boxMesh = MeshBuilder.CreateBox('box', { size: 2 }, scene);

      // Move the box upward 1/2 its height
      _set(boxMesh, 'position.y', 3);

      // Our built-in 'ground' shape.
      // MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
      return boxMesh;
    }),
    filter((meshBox) => !_isEmpty(meshBox)),
  );

  const onRenderSubsc = onRender$
    .pipe(withLatestFrom(boxMesh$))
    .subscribe(([scene, mesh]) => {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();
      const rpm = 10;
      _update(mesh, 'rotation.y', (value: number) => {
        return value + (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
      });
    });

  const glbFileLoaderSubsc = onSceneReady$.subscribe((scene) => {
    SceneLoader.Append(
      '/assets/glb/',
      'flamingo.glb',
      scene,
      (currentScene) => {
        currentScene.createDefaultCameraOrLight(true, true, true);
        currentScene.createDefaultEnvironment();
      },
    );
  });

  useEffect(() => {
    return () => {
      onRenderSubsc.unsubscribe();
      glbFileLoaderSubsc.unsubscribe();
    };
  }, []);

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
        id="canvas"
        onRender={(scene) => onRender$.next(scene)}
        onSceneReady={(scene) => onSceneReady$.next(scene)}
      />
    </Wrap>
  );
};

export default BabylonContainer;
