import * as React from 'react';
import * as BABYLON from 'babylonjs';
import ajax from '../../../functions/ajax';

interface Props {
  scene: BABYLON.Scene;
  engine: BABYLON.Engine;
  //material: BABYLON.StandardMaterial;
}

class Ground extends React.Component<Props, {}> {
  model: BABYLON.Mesh;

  componentDidMount() {
    //this.model = new BABYLON.Mesh("custom", this.props.scene);

    this.props.engine.displayLoadingUI();

    BABYLON.SceneLoader.ImportMesh("Car", "models/", "car.babylon", this.props.scene, function (newMeshes) {
      this.engine.hideLoadingUI();
      this.model = newMeshes[0];
      this.model.position.y = 2;
    }.bind(this));
  }

  componentWillUnmount() {
    //this.ground.dispose();
    //this.props.material.dispose();
  }

  render() {
    return null;
  }
}

export default Ground;
