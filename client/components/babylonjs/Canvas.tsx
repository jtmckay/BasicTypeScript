import * as React from 'react';
import * as BABYLON from 'babylonjs';
import Light from './Light';
import UniversalCamera from './UniversalCamera';
import Ground from './Mesh/Ground';
import Sphere from './Mesh/Sphere';

interface State {
  scene?: BABYLON.Scene;
  position?: BABYLON.Vector3;
}

class Canvas extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      position: new BABYLON.Vector3(-30, 0, 0)
    };

    this.pointerLock = this.pointerLock.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }
  canvas;
  engine;

  componentDidMount() {
    this.canvas = (document.getElementById("renderCanvas") as HTMLCanvasElement);
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.setState({scene: this.createScene()});
    window.addEventListener("resize", function () {
      this.engine.resize();
    }.bind(this));
  }

  pointerLock(event) {
    this.canvas.requestPointerLock();
    this.setState({position: new BABYLON.Vector3(10,0,0)});
  }

  mouseUp(event) {
    document.exitPointerLock();
  }

  mouseMoved(event) {
    //event.target.innerHTML = "Position: " + event.clientX + ", " + event.clientY;
  }

  createScene() {
    let scene = new BABYLON.Scene(this.engine);
    scene.collisionsEnabled = true;
    let gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    let physicPlugin = new BABYLON.OimoJSPlugin();
    scene.enablePhysics(gravityVector, physicPlugin);

    this.engine.runRenderLoop(function () {
      scene.render();
    });

    return scene;
  }

  render() {
    if (this.state.scene) {
      return (
        <canvas id="renderCanvas" style={{width: "100vw", height: "100vh"}} onMouseDown={this.pointerLock} onMouseUp={this.mouseUp} onWheel={(event) => console.log(event.deltaY)}>
          <Light scene={this.state.scene} />
          <UniversalCamera scene={this.state.scene} canvas={this.canvas} />
          <Ground scene={this.state.scene} material={(function() {
            let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
            material.diffuseColor = new BABYLON.Color3(.5, .5, 1);
            return material;
          }.bind(this))()} />
          <Sphere scene={this.state.scene}
            segments={20}
            diameter={6}
            mass={6}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.emissiveTexture = new BABYLON.Texture("textures/penguin.png", this.state.scene);
              return material;
            }.bind(this))()}
            position={new BABYLON.Vector3(0, 0, 0)} />
          <Sphere scene={this.state.scene}
            segments={20}
            diameter={7}
            mass={7}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(.5, 1, .5);
              material.specularColor = new BABYLON.Color3(0, 1, 0);
              material.specularPower = 32;
              return material;
            }.bind(this))()}
            position={this.state.position} />
          <Sphere scene={this.state.scene}
            segments={20}
            diameter={8}
            mass={8}
            material={(function() {
              let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
              material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
              return material;
            }.bind(this))()}
            position={new BABYLON.Vector3(-50, 0, 0)} />
        </canvas>
      );
    }
    else {
      return (
        <canvas id="renderCanvas" style={{width: "100vw", height: "100vh"}}>
        </canvas>
      );
    }
  }
}

export default Canvas;
