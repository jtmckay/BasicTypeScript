import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  register: (ground: BABYLON.Mesh) => void;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
}

class Ground extends React.Component<Props, {}> {
  ground: BABYLON.Mesh;

  componentDidMount() {
    this.ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 2, this.props.scene);
    this.ground.position.y = -10;
    this.ground.material = this.props.material;
    this.ground.checkCollisions = true;

    this.props.register(this.ground);
  }

  componentWillUnmount() {
    this.ground.dispose();
    this.props.material.dispose();
  }

  render() {
    return null;
  }
}

export default Ground;
