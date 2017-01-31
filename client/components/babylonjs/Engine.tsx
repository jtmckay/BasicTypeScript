import * as BABYLON from 'babylonjs';

function Engine(canvas: HTMLCanvasElement) {
  let Engine = new BABYLON.Engine(canvas, true);
  return Engine;
}

export default Engine;
