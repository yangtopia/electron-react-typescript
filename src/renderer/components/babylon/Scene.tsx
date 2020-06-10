import React, { useRef, useState, useEffect } from 'react';
import {
  Engine,
  Scene,
  EngineOptions,
  SceneOptions,
  Nullable,
} from 'babylonjs';
import { fromEvent } from 'rxjs';
import styled from 'styled-components';

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

interface Props {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onSceneReady: (scene: Scene) => void;
  onRender: (scene: Scene) => void;
  id: string;
}

const BabylonSceneComponent: React.FC<Props> = ({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onSceneReady,
  onRender,
  ...rest
}) => {
  const canvasRef = useRef<Nullable<HTMLCanvasElement>>(null);

  const [isLoaded, setLoaded] = useState(false);
  const [scene, setScene] = useState<Nullable<Scene>>(null);

  useEffect(() => {
    const subsc = fromEvent(window, 'resize').subscribe(() => {
      if (scene) {
        scene.getEngine().resize();
      }
    });

    return () => {
      subsc.unsubscribe();
    };
  }, [scene]);

  useEffect(() => {
    if (!isLoaded) {
      setLoaded(true);
      const engine = new Engine(
        canvasRef.current,
        antialias,
        engineOptions,
        adaptToDeviceRatio,
      );
      const currentScene = new Scene(engine, sceneOptions);
      setScene(currentScene);
      if (currentScene.isReady()) {
        onSceneReady(currentScene);
      } else {
        currentScene.onReadyObservable.addOnce((eventScene) =>
          onSceneReady(eventScene),
        );
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === 'function') {
          onRender(currentScene);
        }
        currentScene.render();
      });
    }

    return () => {
      if (scene !== null) {
        scene.dispose();
      }
    };
  }, [canvasRef]);

  return <Canvas ref={canvasRef} {...rest} />;
};

export default BabylonSceneComponent;
