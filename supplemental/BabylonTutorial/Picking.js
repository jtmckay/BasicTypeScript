// Impact impostor
var impact = BABYLON.Mesh.CreatePlane("impact", 1, scene);
impact.material = new BABYLON.StandardMaterial("impactMat", scene);
impact.material.diffuseColor = BABYLON.Color3.Red();
impact.position = new BABYLON.Vector3(0, 0, -0.1);
//Wall
var wall = BABYLON.Mesh.CreatePlane("wall", 20.0, scene);
wall.material = new BABYLON.StandardMaterial("wallMat", scene);
wall.material.emissiveColor = new BABYLON.Color3(0.5, 1, 0.5);



//When pointer down event is raised
scene.onPointerDown = function (evt, pickResult) {
    // if the click hits the ground object, we change the impact position
    if (pickResult.hit) {
        impact.position.x = pickResult.pickedPoint.x;
        impact.position.y = pickResult.pickedPoint.y;
    }
};


//Mouse position
scene.registerBeforeRender(function() {
    var pickResult = scene.pick(scene.pointerX, scene.pointerY, function(mesh) {
        return (mesh.name === "wall");
    });
    if (pickResult.hit) {
        impact.position.x = pickResult.pickedPoint.x;
        impact.position.y = pickResult.pickedPoint.y;
    }
});


//Custom ray to follow the terrain
var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 1, scene);
sphere.position.y = 10;

var angle = 0;
scene.registerBeforeRender(function() {
    sphere.position.x = 10 * Math.cos(angle);
    sphere.position.z = 10 * Math.sin(angle);
    angle += 0.01;
    // Casting a ray to get height
    var ray = new BABYLON.Ray(new BABYLON.Vector3(sphere.position.x, ground.getBoundingInfo().boundingBox.maximumWorld.y + 1, sphere.position.z),
                                new BABYLON.Vector3(0, -1, 0)); // Direction
    var worldInverse = new BABYLON.Matrix();
    ground.getWorldMatrix().invertToRef(worldInverse);
    ray = BABYLON.Ray.Transform(ray, worldInverse);
    var pickInfo = ground.intersects(ray);
    if (pickInfo.hit) {
        sphere.position.y = pickInfo.pickedPoint.y + 0.5;
    }
});


engine.runRenderLoop(function () {
    scene.render();
});
