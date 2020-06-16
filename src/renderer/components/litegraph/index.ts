/* eslint-disable class-methods-use-this */
import { LGraphNode, LGraph } from 'litegraph.js';

export class MyAddNode extends LGraphNode {
  constructor() {
    super();
    this.addInput('A', 'number');
    this.addInput('B', 'number');
    this.addOutput('A+B', 'number');
    this.properties = { precision: 1 };
    this.title = 'Sum';
  }

  onExecute(): void {
    const A = this.getInputData<number>(0) || 0;
    const B = this.getInputData<number>(1) || 0;
    const result = A + B;
    this.setOutputData(0, result);
  }
}
