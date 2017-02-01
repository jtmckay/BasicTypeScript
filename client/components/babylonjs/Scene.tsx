//not used

import * as BABYLON from 'babylonjs';

class Scene extends BABYLON.Scene {
  objects: Array<{
    mesh: BABYLON.Mesh,
    id: string
  }>;
}

export default Scene;
