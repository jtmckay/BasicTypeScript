import * as React from 'react';
import * as BABYLON from 'babylonjs';
import Light from './Light';
import UniversalCamera from './UniversalCamera';
import ArcRotateCamera from './ArcRotateCamera';
import Ground from './Mesh/Ground';
import Sphere from './Mesh/Sphere';
import Model from './Mesh/Model';

interface State {
  scene?: BABYLON.Scene;
  position?: BABYLON.Vector3;
  cameraTargetPosition?: BABYLON.Vector3;
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
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  car: BABYLON.Mesh;
  ground: BABYLON.Mesh;
  hook: {
    Sphere?: BABYLON.Mesh
  } = {};

  componentDidMount() {
    this.canvas = (document.getElementById("renderCanvas") as HTMLCanvasElement);
    this.engine = new BABYLON.Engine(this.canvas, true);

    let scene = this.createScene();
    BABYLON.SceneLoader.ImportMesh("test", "babylonjs/", "skull.babylon", scene, function (newMeshes) {
      debugger;
      let skull = newMeshes[0];
      let speed = 1;

      let forward = false;
      let strafeLeft = false;
      let backward = false;
      let strafeRight = false;

      scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (event) {
        if (event.sourceEvent.key == "w") {
          forward = true;
        }
        if (event.sourceEvent.key == "a") {
          strafeLeft = true;
        }
        if (event.sourceEvent.key == "s") {
          backward = true;
        }
        if (event.sourceEvent.key == "d") {
          strafeRight = true;
        }
      }));

      scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (event) {
        if (event.sourceEvent.key == "w") {
          forward = false;
        }
        if (event.sourceEvent.key == "a") {
          strafeLeft = false;
        }
        if (event.sourceEvent.key == "s") {
          backward = false;
        }
        if (event.sourceEvent.key == "d") {
          strafeRight = false;
        }
      }));

      scene.registerBeforeRender(function () {
        if (forward) {
          skull.position += speed;
        }
        if (strafeLeft) {
          skull.position += speed;
        }
        if (backward) {
          skull.position += speed;
        }
        if (strafeRight) {
          skull.position += speed;
        }
        this.setState({cameraTargetPosition: skull.position});
      }.bind(this));
    }.bind(this));

    BABYLON.SceneLoader.ImportMesh("Car", "babylonjs/", "car.babylon", scene, function (newMeshes) {
      this.car = newMeshes[0];
      this.car.position = BABYLON.Vector3.Zero();

      //runs every frame
      scene.registerBeforeRender(function () {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
          return mesh.name == "ground";
        });

        if (pickResult.hit) {
          this.car.position.x = pickResult.pickedPoint.x;
          this.car.position.z = pickResult.pickedPoint.z;
        }

        // Casting a ray to get height
        var ray = new BABYLON.Ray(new BABYLON.Vector3(this.car.position.x, this.ground.getBoundingInfo().boundingBox.maximumWorld.y + 1, this.car.position.z),
                                    new BABYLON.Vector3(0, -1, 0)); // Direction
        var worldInverse = new BABYLON.Matrix();
        this.ground.getWorldMatrix().invertToRef(worldInverse);
        ray = BABYLON.Ray.Transform(ray, worldInverse);
        var pickInfo = this.ground.intersects(ray);
        if (pickInfo.hit) {
          this.car.position.x = pickInfo.pickedPoint.x + 1.5;
          this.car.position.y = pickInfo.pickedPoint.y + 1;
          this.car.position.z = pickInfo.pickedPoint.z - 1;
        }
      }.bind(this));
      //this.setState({ cameraTargetPosition: newMeshes[0].position });
    }.bind(this));
    /*
    BABYLON.SceneLoader.Load("babylonjs/", "originalcar.babylon", this.engine, function(newScene) {
      this.engine.runRenderLoop(function () {
        newScene.render();
      });
    }.bind(this));
    */

    /*
    scene.onPointerDown = function (event, pickResult) {
      // if the click hits the ground object, we change the impact position
      if (pickResult.hit) {
        impact.position.x = pickResult.pickedPoint.x;
        impact.position.y = pickResult.pickedPoint.y;
      }
    };
    */

    this.setState({scene: scene});

    window.addEventListener("resize", function () {
      this.engine.resize();
    }.bind(this));
  }

  pointerLock(event) {
    this.canvas.requestPointerLock();
    //this.setState({position: new BABYLON.Vector3(10,0,0)});
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
    //scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());

    this.engine.runRenderLoop(function () {
      scene.render();
      if (this.hook.Sphere) {
        //this.cameraTargetPosition = (this.hook.Sphere as BABYLON.Mesh).getPositionInCameraSpace();
      }
    }.bind(this));

    return scene;
  }

  render() {
    if (this.state.scene) {
      if (BABYLON.Engine.isSupported()) {
        return (
          <canvas id="renderCanvas" style={{width: "100vw", height: "100vh"}}
            onMouseDown={this.pointerLock}
            onMouseUp={this.mouseUp}
            onWheel={(event) => console.log(event.deltaY)}>
            <Light scene={this.state.scene} />
            <ArcRotateCamera scene={this.state.scene} canvas={this.canvas} target={this.state.cameraTargetPosition} />
            <Ground scene={this.state.scene}
              material={(function() {
                let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
                material.diffuseColor = new BABYLON.Color3(.5, .5, 1);
                return material;
              }.bind(this))()}
              register={ground => this.ground = ground} />
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
              hook={object => this.hook.Sphere = object}
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
        return <h1 style={{textAlign: "center", width: "100%", position: "absolute"}}>WebGL is not supported</h1>
      }
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
