import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  canvas: HTMLCanvasElement;
  scene: BABYLON.Scene;
}

class UniversalCamera extends React.Component<Props, {}> {
  camera: BABYLON.UniversalCamera;

  componentDidMount() {
    this.camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(-10, -6, -30), this.props.scene);
    this.camera.attachControl(this.props.canvas, true);
    this.camera.applyGravity = true;
    this.camera.checkCollisions = true;
    this.camera.ellipsoid = new BABYLON.Vector3(2, 2, 2);
  }

  componentWillUnmount() {
    this.camera.dispose();
  }

  render() {
    return null;
  }
}

export default UniversalCamera;
