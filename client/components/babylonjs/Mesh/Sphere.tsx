import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  position: BABYLON.Vector3;
  segments: number;
  diameter: number;
  mass: number;
  scene: BABYLON.Scene;
  material: BABYLON.StandardMaterial;
}

class Sphere extends React.Component<Props, {}> {
  sphere: BABYLON.Mesh;

  componentWillReceiveProps(props) {
    let animation = new BABYLON.Animation("myAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // An array with all animation keys
    var keys = [];

    //At the animation key 0, the value of scaling is "1"
    keys.push({
      frame: 0,
      value: this.props.position
    });

    //At the animation key 100, the value of scaling is "1"
    keys.push({
      frame: 100,
      value: props.position
    });

    animation.setKeys(keys);
    this.sphere.animations.push(animation);
    if (this.props.position.x != props.position.x) {
      this.props.scene.beginAnimation(this.sphere, 0, 100, true);
    }
  }

  componentDidMount() {
    this.sphere = BABYLON.Mesh.CreateSphere("Sphere1", this.props.segments, this.props.diameter, this.props.scene, true);
    this.sphere.ellipsoid = new BABYLON.Vector3(this.props.diameter/4, this.props.diameter/4, this.props.diameter/4);
    this.sphere.checkCollisions = true;
    this.sphere.material = this.props.material;
    this.sphere.position = this.props.position;

    //this.sphere.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: this.props.mass, friction: 1, restitution: 1 });
    //this.sphere.onCollide = event => console.log(event);

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

    var speedCharacter = 8;
    var gravity = 0.15;
    var character = this.sphere;

    var forwards = new BABYLON.Vector3(Math.sin(character.rotation.y) / speedCharacter, gravity, Math.cos(character.rotation.y) / speedCharacter);
    forwards.negate();
    character.moveWithCollisions(forwards);
    // or
    var backwards = new BABYLON.Vector3(Math.sin(character.rotation.y) / speedCharacter, -gravity, Math.cos(character.rotation.y) / speedCharacter);
    character.moveWithCollisions(backwards);

    this.props.scene.registerBeforeRender(function () {
  		this.sphere.moveWithCollisions(this.props.scene.gravity);
  	}.bind(this));
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
