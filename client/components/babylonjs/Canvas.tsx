import * as React from 'react';
import * as BABYLON from 'babylonjs';
import DegreesToRadians from './DegreesToRadians';
import Light from './Light';
import UniversalCamera from './UniversalCamera';
import ArcRotateCamera from './ArcRotateCamera';
import Ground from './Mesh/Ground';
import Sphere from './Mesh/Sphere';
import Model from './Mesh/Model';
import Plane from './Mesh/Plane';

interface Props {
  settings: {
    movementSpeed: number;
    mouseSensitivity: number;
    stickyRightMouseClick: boolean;
  };
}

interface State {
  scene?: BABYLON.Scene;
  position?: BABYLON.Vector3;
}

class Canvas extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      position: new BABYLON.Vector3(-30, 0, 0)
    };

    this.pointerLockCallback = this.pointerLockCallback.bind(this);
    this.lockPointer = this.lockPointer.bind(this);
    this.unlockPointer = this.unlockPointer.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseWheel = this.mouseWheel.bind(this);
  }
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  car: BABYLON.Mesh;
  ground: BABYLON.Mesh;
  plane: BABYLON.Mesh;
  camera: BABYLON.ArcRotateCamera;
  pointerLocked: boolean;
  emitter: BABYLON.Mesh;
  hook: {
    Sphere?: BABYLON.Mesh
  } = {};

  characterMesh: BABYLON.Mesh;
  characterShell: BABYLON.Mesh;

  componentDidMount() {
    this.canvas = (document.getElementById("renderCanvas") as HTMLCanvasElement);

    document.addEventListener('pointerlockchange', this.pointerLockCallback);
    document.addEventListener('mozpointerlockchange', this.pointerLockCallback);
    document.addEventListener('webkitpointerlockchange', this.pointerLockCallback);

    this.engine = new BABYLON.Engine(this.canvas, true);

    let scene = this.createScene();

    this.createParticleSystem(scene, new BABYLON.Color4(.1, .2, .8, 1), new BABYLON.Color4(.2, .3, 1, 1));
    this.createParticleSystem(scene, new BABYLON.Color4(.8, .2, .1, 1), new BABYLON.Color4(.1, .3, .2, 1))
    this.loadSkull(scene);

    BABYLON.SceneLoader.ImportMesh("test", "babylonjs/", "skull.babylon", scene, function (newMeshes) {
      this.car = newMeshes[0];
      this.car.position = BABYLON.Vector3.Zero();
      let car = this.car.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {mass: 5, friction: 1});
      car.linearVelocity.scaleEqual(.92);
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

  //Attaches control of the camera only when the pointer is locked to the screen
  //aka only rotates the camera when the mouse is anchored
  pointerLockCallback(event) {
    if (document.pointerLockElement == this.canvas) {
      this.pointerLocked = true;
      this.camera.attachControl(this.canvas, true);
    }
    else {
      this.pointerLocked = false;
      this.camera.detachControl(this.canvas);
    }
  }

  loadSkull (scene: BABYLON.Scene) {
    BABYLON.SceneLoader.ImportMesh("test", "babylonjs/", "skull.babylon", scene, function (newMeshes) {
      this.characterMesh = newMeshes[0];
      this.characterMesh.scaling = new BABYLON.Vector3(.2, .2, .2);

      this.characterShell = BABYLON.Mesh.CreateSphere("Character", 2, 11, scene, true);
      this.characterShell.isVisible = false;
      let shell = this.characterShell.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {mass: 10, friction: .0001, restitution: .001});
      this.characterShell.position = this.characterMesh.position;

      let w = false;
      let a = false;
      let s = false;
      let d = false;
      let space = false;
      let control = false;
      let shift = false;
      let canJump = true;

      scene.actionManager = new BABYLON.ActionManager(scene);

      scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (event) {
        if (event.sourceEvent.keyCode == 87) {
          w = true;
        }
        if (event.sourceEvent.keyCode == 65) {
          a = true;
        }
        if (event.sourceEvent.keyCode == 83) {
          s = true;
        }
        if (event.sourceEvent.keyCode == 68) {
          d = true;
        }
        if (event.sourceEvent.keyCode == 32) {
          space = true;
        }
        if (event.sourceEvent.keyCode == 17) {
          control = true;
        }
        if (event.sourceEvent.keyCode == 16) {
          shift = true;
        }
      }));

      scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (event) {
        if (event.sourceEvent.keyCode == 87) {
          w = false;
        }
        if (event.sourceEvent.keyCode == 65) {
          a = false;
        }
        if (event.sourceEvent.keyCode == 83) {
          s = false;
        }
        if (event.sourceEvent.keyCode == 68) {
          d = false;
        }
        if (event.sourceEvent.keyCode == 32) {
          space = false;
        }
        if (event.sourceEvent.keyCode == 17) {
          control = false;
        }
        if (event.sourceEvent.keyCode == 16) {
          shift = false;
        }
      }));

      scene.registerBeforeRender(function () {
        shell.angularVelocity.scaleEqual(0);
        shell.linearVelocity.scaleEqual(.5);
        let localSpeed = this.props.settings.movementSpeed * scene.getAnimationRatio();
        let vector1 = new BABYLON.Vector2(0, 1);
        //Camera position relative to the object
        let vector2 = new BABYLON.Vector2(this.characterMesh.position.x - this.camera.position.x, this.characterMesh.position.z - this.camera.position.z);
        let angle = BABYLON.Angle.BetweenTwoPoints(vector1, vector2);

        if ((w && !s || s && !w) &&
        (d && !a || a && !d)) {
          localSpeed = localSpeed * Math.cos(DegreesToRadians(45));
        }

        let target = new BABYLON.Vector3(0, 0, 0);
        let current = shell.linearVelocity;

        if (shift) {
          localSpeed = localSpeed*2;
        }
        if (w) {
          target.x += localSpeed * Math.sin(angle.radians() + DegreesToRadians(90));
          target.z -= localSpeed * Math.cos(angle.radians() + DegreesToRadians(90));
        }
        if (a) {
          target.x -= localSpeed * Math.sin(angle.radians());
          target.z += localSpeed * Math.cos(angle.radians());
        }
        if (s) {
          target.x += localSpeed * Math.sin(angle.radians() - DegreesToRadians(90));
          target.z -= localSpeed * Math.cos(angle.radians() - DegreesToRadians(90));
        }
        if (d) {
          target.x += localSpeed * Math.sin(angle.radians());
          target.z -= localSpeed * Math.cos(angle.radians());
        }

        this.characterShell.applyImpulse(target, this.characterMesh.position);

        if (space && canJump) {
          this.characterShell.applyImpulse(new BABYLON.Vector3(0, localSpeed, 0), this.characterMesh.position);
        }
        this.characterMesh.rotation = new BABYLON.Vector3(0, -this.camera.alpha + DegreesToRadians(90), 0);
        //skull.rotation.x -= 1;
        this.camera.target = this.characterMesh.position;
      }.bind(this));
    }.bind(this));
  }

  mouseDown(event) {
    if (!this.props.settings.stickyRightMouseClick && event.nativeEvent.which == 3) {
      this.lockPointer();
    }
    else if (this.props.settings.stickyRightMouseClick && event.nativeEvent.which == 3 && !this.pointerLocked) {
      this.lockPointer();
    }
    else if (this.props.settings.stickyRightMouseClick && event.nativeEvent.which == 3 && this.pointerLocked) {
      this.unlockPointer();
    }
  }

  mouseUp(event) {
    if (!this.props.settings.stickyRightMouseClick && event.nativeEvent.which == 3) {
      this.unlockPointer();
    }
  }

  keyDown(event) {
    event.preventDefault();
    if (event.key == 'Escape') {
      this.unlockPointer();
    }
  }

  lockPointer() {
    this.canvas.requestPointerLock();
  }

  unlockPointer() {
    document.exitPointerLock();
  }

  mouseMoved(event) {
    //event.target.innerHTML = "Position: " + event.clientX + ", " + event.clientY;
  }

  mouseWheel(event) {
    let newRadius = this.camera.radius + event.deltaY/10;
    if (this.camera.lowerRadiusLimit <= newRadius && this.camera.upperRadiusLimit >= newRadius) {
      this.camera.radius = newRadius;
    }
  }

  createParticleSystem(scene: BABYLON.Scene,
    color1: BABYLON.Color4,
    color2: BABYLON.Color4) : BABYLON.ParticleSystem {
    let emitter = BABYLON.Mesh.CreateBox("emitter", .1, scene);
    emitter.position.y = -10;
    emitter.position.z = 10;
    emitter.isVisible = false;
    this.emitter = emitter;

    let particleSystem = new BABYLON.ParticleSystem("particles", 50000, scene);
    particleSystem.emitter = emitter;
    //texture
    particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

    //color range
    particleSystem.color1 = color1;
    particleSystem.color2 = color2;

    //power
    particleSystem.minAngularSpeed = -.5;
    particleSystem.maxAngularSpeed = .5;

    particleSystem.minSize = .1;
    particleSystem.maxSize = .3;

    particleSystem.minLifeTime = .5;
    particleSystem.maxLifeTime = 1;

    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

    particleSystem.minEmitBox = new BABYLON.Vector3(-5, 0, -5);
    particleSystem.maxEmitBox = new BABYLON.Vector3(5, 0, 5);

    particleSystem.direction1 = new BABYLON.Vector3(-.3, 1, -.3);
    particleSystem.direction2 = new BABYLON.Vector3(.3, 1, .3);

    //power
    particleSystem.minEmitPower = 30;
    particleSystem.maxEmitPower = 50;

    //quantity
    particleSystem.emitRate = 10000;

    //gravity
    particleSystem.gravity = new BABYLON.Vector3(0, -98.1, 0);

    //start
    particleSystem.start();

    return particleSystem;
  }

  createScene() {
    let scene = new BABYLON.Scene(this.engine);
    scene.collisionsEnabled = true;
    scene.enablePhysics(new BABYLON.Vector3(0, -98.1, 0), new BABYLON.OimoJSPlugin() as any);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = .003;

    //runs every frame
    scene.registerBeforeRender(function () {
      var pickResult = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
        return mesh.name == "ground";
      });

      if (pickResult.hit) {
        this.emitter.position = pickResult.pickedPoint;
        //this.car.position.x = pickResult.pickedPoint.x;
        //this.car.position.z = pickResult.pickedPoint.z;
      }

    }.bind(this));
    /*
    // Casting a ray to get height
    var ray = new BABYLON.Ray(new BABYLON.Vector3(scene.pointerX, this.ground.getBoundingInfo().boundingBox.maximumWorld.y + 1, this.car.position.z),
                                new BABYLON.Vector3(0, -1, 0)); // Direction
    var worldInverse = new BABYLON.Matrix();
    this.ground.getWorldMatrix().invertToRef(worldInverse);
    ray = BABYLON.Ray.Transform(ray, worldInverse);
    var pickInfo = this.ground.intersects(ray);
    if (pickInfo.hit) {
      //this.car.position.x = pickInfo.pickedPoint.x + 1.5;
      //this.car.position.y = pickInfo.pickedPoint.y + 1;
      //this.car.position.z = pickInfo.pickedPoint.z - 1;
    }*/

    this.engine.runRenderLoop(function () {
      scene.render();
    }.bind(this));

    return scene;
  }

  render() {
    if (this.state.scene) {
      if (BABYLON.Engine.isSupported()) {
        return (
          <canvas id="renderCanvas" style={{width: "100vw", height: "100vh"}}
            onKeyDown={this.keyDown}
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onWheel={this.mouseWheel}>
            <Light scene={this.state.scene} />
            <ArcRotateCamera
            scene={this.state.scene}
            register={(camera: BABYLON.ArcRotateCamera) => this.camera = camera}
            canvas={this.canvas}
            target={BABYLON.Vector3.Zero()}
            mouseSensitivity={this.props.settings.mouseSensitivity} />
            <Ground scene={this.state.scene}
              material={(function() {
                let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
                material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
                return material;
              }.bind(this))()}
              register={ground => this.ground = ground} />
            <Plane scene={this.state.scene}
              register={plane => this.plane = plane}
              material={(function() {
                let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
                material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
                return material;
              }.bind(this))()}
              size={500}
              position={new BABYLON.Vector3(0, 0, -250)}
              rotation={new BABYLON.Vector3(Math.PI, 0, 0)} />
            <Plane scene={this.state.scene}
              register={plane => this.plane = plane}
              material={(function() {
                let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
                material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                return material;
              }.bind(this))()}
              size={500}
              position={new BABYLON.Vector3(0, 0, 250)}
              rotation={new BABYLON.Vector3(0, 0, 0)} />
            <Plane scene={this.state.scene}
              register={plane => this.plane = plane}
              material={(function() {
                let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
                material.diffuseColor = new BABYLON.Color3(.3, .7, .3);
                return material;
              }.bind(this))()}
              size={500}
              position={new BABYLON.Vector3(-250, 0, 0)}
              rotation={new BABYLON.Vector3(0, -Math.PI/2, 0)} />
            <Plane scene={this.state.scene}
              register={plane => this.plane = plane}
              material={(function() {
                let material = new BABYLON.StandardMaterial("texture1", this.state.scene);
                material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                return material;
              }.bind(this))()}
              size={500}
              position={new BABYLON.Vector3(250, 0, 0)}
              rotation={new BABYLON.Vector3(0, Math.PI/2, 0)} />
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
