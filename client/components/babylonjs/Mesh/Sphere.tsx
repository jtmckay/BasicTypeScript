import * as React from 'react';
import * as BABYLON from 'babylonjs';

interface Props {
  scene: BABYLON.Scene;
  hook?: (Object) => void;
  material: BABYLON.StandardMaterial;
  position: BABYLON.Vector3;
  segments: number;
  diameter: number;
  mass: number;
}

class Sphere extends React.Component<Props, {}> {
  sphere: BABYLON.Mesh;

  componentWillReceiveProps(props) {
    if(this.props.hook) {
      this.props.hook(this.sphere);
    }
  }

  componentDidMount() {
    this.sphere = BABYLON.Mesh.CreateSphere("Sphere1", this.props.segments, this.props.diameter, this.props.scene, true);
    this.sphere.ellipsoid = new BABYLON.Vector3(this.props.diameter/4, this.props.diameter/4, this.props.diameter/4);
    this.sphere.checkCollisions = true;
    this.sphere.material = this.props.material;
    this.sphere.position = this.props.position;

    let physicalSphere = this.sphere.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: this.props.mass, friction: 1 });
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
    //this.props.scene.beginAnimation(this.sphere, 0, 100, true);

    this.props.scene.registerBeforeRender(function () {
      physicalSphere.linearVelocity.scaleEqual(.92);
      physicalSphere.angularVelocity.scaleEqual(.92);
    });
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
