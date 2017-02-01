import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  segments: number;
  diameter: number;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
  position: BABYLON.Vector3;
}

class Sphere extends React.Component<Props, {}> {
  sphere: BABYLON.Mesh;

  componentDidMount() {
    this.sphere = BABYLON.Mesh.CreateSphere("Sphere1", this.props.segments, this.props.diameter, this.props.scene, true, 2);
    this.sphere.material = this.props.material;
    this.sphere.position = this.props.position;
    this.sphere.checkCollisions = true;

    var animationBox = new BABYLON.Animation("myAnimation", "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    // An array with all animation keys
    var keys = [];

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: 1
    });

    //At the animation key 20, the value of scaling is "0.2"
    keys.push({
      frame: 20,
      value: 0.2
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: 100,
      value: 1
    });

    animationBox.setKeys(keys);
    this.sphere.animations.push(animationBox);
    this.props.scene.beginAnimation(this.sphere, 0, 100, true);
    this.sphere.ellipsoid = new BABYLON.Vector3(.5, 1, .5);

    var speedCharacter = 8;
    var gravity = 0.15;
    var character = this.sphere;

    character.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
    character.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);

    var forwards = new BABYLON.Vector3(Math.sin(character.rotation.y) / speedCharacter, gravity, Math.cos(character.rotation.y) / speedCharacter);
    forwards.negate();
    character.moveWithCollisions(forwards);
    // or
    var backwards = new BABYLON.Vector3(Math.sin(character.rotation.y) / speedCharacter, -gravity, Math.cos(character.rotation.y) / speedCharacter);
    character.moveWithCollisions(backwards);
  }

  componentWillUnmount() {
    this.sphere.dispose();
    this.props.material.dispose();
  }

  render() {
    return null;
  }
}

export default Sphere;
