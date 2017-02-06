import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  canvas: HTMLCanvasElement;
  scene: BABYLON.Scene;
  target: BABYLON.Vector3;
}

class ArcRotateCamera extends React.Component<Props, {}> {
  camera: BABYLON.ArcRotateCamera;

  componentDidMount() {
    this.camera = new BABYLON.ArcRotateCamera("Camera", 1, 1, 90, this.props.target, this.props.scene);
    this.camera.attachControl(this.props.canvas, true);
    this.camera.checkCollisions = true;
  }

  componentWillReceiveProps(props) {
    this.camera.setTarget(props.target);
  }

  componentWillUnmount() {
    this.camera.dispose();
  }

  render() {
    return null;
  }
}

export default ArcRotateCamera;
