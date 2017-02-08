import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  scene: BABYLON.Scene;
  register: (camera: BABYLON.Camera) => void;
  canvas: HTMLCanvasElement;
  target: BABYLON.Vector3;
  mouseSensitivity: number;
}

class ArcRotateCamera extends React.Component<Props, {}> {
  camera: BABYLON.ArcRotateCamera;
  mouseSensitivity: number;

  componentDidMount() {
    if (isNaN(parseFloat(this.props.mouseSensitivity.toString()))) {
      this.mouseSensitivity = this.mouseSensitivity ? this.mouseSensitivity : 5;
    }
    else {
      this.mouseSensitivity = parseFloat(this.props.mouseSensitivity.toString());
    }
    this.camera = new BABYLON.ArcRotateCamera("Camera", 1, 1, 90, this.props.target, this.props.scene);
    this.camera.checkCollisions = true;
    this.camera.inertia = 0;
    this.camera.angularSensibilityX = 1500/this.mouseSensitivity;
    this.camera.angularSensibilityY = 1500/this.mouseSensitivity;
    this.camera.lowerRadiusLimit = 5;
    this.camera.upperRadiusLimit = 100;
    this.camera.lowerBetaLimit = .1;
    this.camera.upperBetaLimit = Math.PI/2;

    this.props.register(this.camera);
  }

  componentWillUnmount() {
    this.camera.dispose();
  }

  componentWillReceiveProps(props) {
    if (isNaN(parseFloat(props.mouseSensitivity))) {
      this.mouseSensitivity = this.mouseSensitivity ? this.mouseSensitivity : 5;
    }
    else {
      this.mouseSensitivity = parseFloat(props.mouseSensitivity.toString());
    }
    this.camera.angularSensibilityX = 1500/this.mouseSensitivity;
    this.camera.angularSensibilityY = 1500/this.mouseSensitivity;
  }

  render() {
    return null;
  }
}

export default ArcRotateCamera;
