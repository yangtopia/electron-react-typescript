import React, { useMemo, useEffect } from 'react';
import { useThree } from 'react-three-fiber';
import { Color, Vector2 } from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Line2 } from 'three/examples/jsm/lines/Line2';

import _isUndefined from 'lodash/isUndefined';
import _flatten from 'lodash/flatten';

interface Props {
  points: [number, number, number][];
  lineWidth?: number;
  color?: Color;
  vertexColors?: [number, number, number][];
  dashed?: boolean;
}

const Line = ({
  lineWidth = 1,
  points,
  color,
  vertexColors,
  dashed,
  ...rest
}: Props & JSX.IntrinsicElements['mesh']) => {
  const { size } = useThree();

  const matLine = useMemo(
    () =>
      new LineMaterial({
        color: 0xffffff,
        linewidth: lineWidth,
        vertexColors: !_isUndefined(vertexColors),
        resolution: new Vector2(size.width, size.height),
        dashed: !_isUndefined(dashed),
      }),
    [lineWidth, vertexColors, size, dashed],
  );

  const geometry = useMemo(() => new LineGeometry(), []);
  const lineObj = useMemo(() => new Line2(geometry, matLine), [
    geometry,
    matLine,
  ]);

  useEffect(() => {
    const pointsFlat = _flatten(points);
    geometry.setPositions(pointsFlat);

    if (vertexColors) {
      const colorsFlat = _flatten(vertexColors);
      geometry.setColors(colorsFlat);
    }

    lineObj.computeLineDistances();
  }, [points, geometry, vertexColors, lineObj]);
  return <primitive object={lineObj} dispose={null} {...rest} />;
};

export default Line;
