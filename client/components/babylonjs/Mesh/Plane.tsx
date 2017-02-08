import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  register: (ground: BABYLON.Mesh) => void;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  size: number;
  position: BABYLON.Vector3;
  rotation: BABYLON.Vector3;
}

class Ground extends React.Component<Props, {}> {
  ground: BABYLON.Mesh;

  componentDidMount() {
    this.ground = BABYLON.Mesh.CreatePlane("plane", this.props.size, this.props.scene);
    this.ground.position = this.props.position;
    this.ground.material = this.props.material;
    this.ground.rotation = this.props.rotation;
    this.ground.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, {mass: 0});

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
