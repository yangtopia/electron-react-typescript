import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { LGraph, LGraphCanvas, LiteGraph } from 'litegraph.js';
import { Subject } from 'rxjs';
import { MyAddNode } from '@components/litegraph';

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas.attrs({
  // width: '1024',
  // height: '1024',
})`
  width: 100%;
  height: 100%;
`;

const LiteGraphContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    LiteGraph.registerNodeType('basic/sum', MyAddNode);
    if (canvasRef.current) {
      const graph = new LGraph();
      const canvas = new LGraphCanvas(canvasRef.current, graph, {
        autoresize: true,
      });
      const nodeConst1 = LiteGraph.createNode('basic/const');
      nodeConst1.pos = [200, 200];
      graph.add(nodeConst1);
      nodeConst1.setValue(4.5);

      const nodeConst2 = LiteGraph.createNode('basic/const');
      nodeConst2.pos = [200, 500];
      graph.add(nodeConst2);
      nodeConst2.setValue(4.5);

      const nodeWatch = LiteGraph.createNode('basic/watch');
      nodeWatch.pos = [700, 200];
      graph.add(nodeWatch);

      const nodeSum = LiteGraph.createNode<MyAddNode>('basic/sum');
      nodeSum.pos = [500, 300];
      graph.add(nodeSum);

      nodeConst1.connect(0, nodeSum, 0);
      nodeConst2.connect(0, nodeSum, 1);
      nodeSum.connect(0, nodeWatch, 0);

      graph.start();
    }
  }, []);

  return (
    <Wrap>
      <Canvas ref={canvasRef} />
    </Wrap>
  );
};

export default LiteGraphContainer;
