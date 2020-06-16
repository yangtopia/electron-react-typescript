import React, { useEffect, useState } from 'react';
import { OrbitControls, Sky } from 'drei';
import _head from 'lodash/head';
import { Canvas, CanvasContext } from 'react-three-fiber';
import { fromEvent, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  scan,
  startWith,
  withLatestFrom,
  filter,
} from 'rxjs/operators';
import styled from 'styled-components';
import { Color, Mesh, MeshStandardMaterial, Vector2 } from 'three';
import { GUI } from 'dat.gui';
import BoxMesh, { BoxMeshConfig } from '@components/three/BoxMesh';

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
  const initialBoxConfig: BoxMeshConfig = {
    name: 'react-dat-gui',
    isRotation: false,
    scaleX: 1,
  };

  const [boxConfig, setBoxConfig] = useState(initialBoxConfig);

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

      const gui = new GUI({ autoPlace: true });
      gui.add(initialBoxConfig, 'name').onChange((value) => {
        setBoxConfig({ ...boxConfig, name: value });
      });
      gui.add(initialBoxConfig, 'isRotation').onChange((value) => {
        setBoxConfig({ ...boxConfig, isRotation: value });
      });
      gui.add(initialBoxConfig, 'scaleX', 1, 5, 0.1).onChange((value) => {
        setBoxConfig({ ...boxConfig, scaleX: value });
      });

      return ctx;
    });

    const hoveredIntersectedMeshSubsc = intersectedFrontMesh$
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
        filter(([mesh, _]) => !!mesh),
      )
      .subscribe((meshs) => {
        const [mesh, isHovered] = meshs as [Mesh, boolean];
        if (mesh) {
          const material = mesh.material as MeshStandardMaterial;
          material.color = isHovered
            ? new Color('hotpink')
            : new Color('orange');
        }
      });
    return () => {
      initCanvasSubsc.unsubscribe();
      hoveredIntersectedMeshSubsc.unsubscribe();
    };
  }, []);

  return (
    <Wrap>
      <Title>Electron React Typescript X ThreeJS</Title>
      <Canvas
        colorManagement
        onCreated={(context) => canvasContext$.next(context)}
      >
        <Sky />
        <spotLight color={new Color(0x555555)} angle={1.5} />
        <ambientLight color={new Color(0x555555)} />
        <pointLight position={[10, 10, 10]} />
        <BoxMesh name="box1" config={boxConfig} />
        <OrbitControls />
      </Canvas>
    </Wrap>
  );
};

export default ThreeContainer;
