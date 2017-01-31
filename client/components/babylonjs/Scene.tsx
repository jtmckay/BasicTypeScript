import * as React from 'react';
import * as BABYLON from 'babylonjs';
import Light from './Light';

interface State {
  scene: BABYLON.Scene;
}

class Scene extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      scene: null
    };
  }
  canvas;
  engine;

  componentDidMount() {
    this.canvas = (document.getElementById("renderCanvas") as HTMLCanvasElement);
    this.engine = new BABYLON.Engine(this.canvas, true);

    let scene = this.createScene();
    let gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    let physicPlugin = new BABYLON.OimoJSPlugin();
    scene.enablePhysics(gravityVector, physicPlugin);
    this.engine.runRenderLoop(function () {
      scene.render();
    });
    this.setState({scene: scene});

    window.addEventListener("resize", function () {
      this.engine.resize();
    }.bind(this));
  }

  createScene() {
    let scene = new BABYLON.Scene(this.engine);
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;

    var camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(-10, 0, -30), scene);
    camera.attachControl(this.canvas, true);
    camera.applyGravity = true;
    camera.checkCollisions = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
    ground.position.y = -5;


    //Creation of spheres
    var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 10.0, 6.0, scene, true, 2);
    var materialSphere1 = new BABYLON.StandardMaterial("texture1", scene);
    materialSphere1.emissiveTexture = new BABYLON.Texture("textures/penguin.png", scene);
    sphere1.material = materialSphere1;
    sphere1.checkCollisions = true;

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
    sphere1.animations.push(animationBox);
    scene.beginAnimation(sphere1, 0, 100, true);
    sphere1.ellipsoid = new BABYLON.Vector3(.5, 1, .5);

    var sphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 10.0, 7.0, scene);
    var materialSphere2 = new BABYLON.StandardMaterial("texture1", scene);
    materialSphere2.diffuseColor = new BABYLON.Color3(.5, 1, .5);
    materialSphere2.specularColor = new BABYLON.Color3(0, 1, 0);
    materialSphere2.specularPower = 32;
    sphere2.material = materialSphere2;
    sphere2.checkCollisions = true;
    sphere2.position.x = -30;


    var sphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 10.0, 8.0, scene);
    var materialSphere3 = new BABYLON.StandardMaterial("texture1", scene);
    materialSphere3.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
    sphere3.material = materialSphere3;
    sphere3.checkCollisions = true;
    sphere3.position.x = -40;


    var materialGround = new BABYLON.StandardMaterial("texture1", scene);
    materialGround.diffuseColor = new BABYLON.Color3(.5, .5, 1);
    ground.material = materialGround;
    ground.checkCollisions = true;

    var speedCharacter = 8;
    var gravity = 0.15;
    var character = sphere1;

    character.ellipsoid = new BABYLON.Vector3(0.5, 1.0, 0.5);
    character.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);

    var forwards = new BABYLON.Vector3(Math.sin(character.rotation.y) / speedCharacter, gravity, Math.cos(character.rotation.y) / speedCharacter);
    forwards.negate();
    character.moveWithCollisions(forwards);
    // or
    var backwards = new BABYLON.Vector3(Math.sin(character.rotation.y) / speedCharacter, -gravity, Math.cos(character.rotation.y) / speedCharacter);
    character.moveWithCollisions(backwards);

    return scene;
  }

  render() {
    if (this.state.scene) {
    return (
      <canvas id="renderCanvas" style={{width: "100vw", height: "100vh", touchAction: "none"}}>
        <Light scene={this.state.scene} />
      </canvas>
    );
    }
    else {
    return (
      <canvas id="renderCanvas" style={{width: "100vw", height: "100vh", touchAction: "none"}}>
      </canvas>
    );
    }
  }
}

export default Scene;
