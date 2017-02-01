import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  scene: BABYLON.Scene;
}

class Light extends React.Component<Props, {}> {
  light: BABYLON.HemisphericLight;

  componentDidMount() {
    this.light = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), this.props.scene);
    this.light.diffuse = new BABYLON.Color3(1, 1, 1);
    this.light.specular = new BABYLON.Color3(1, 1, 1);
    this.light.groundColor = new BABYLON.Color3(0, 0, 0);
  }

  componentWillUnmount() {
    this.light.dispose();
  }

  render() {
    return null;
  }
}

export default Light;
