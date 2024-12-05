import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as dat from "lil-gui";
import { Sky } from "three/examples/jsm/objects/Sky.js";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// // Create Sky object
// const sky = new Sky();
// sky.scale.setScalar(10000); // Scale it large enough for the scene
// scene.add(sky);

// // Configure sky shader parameters
// const skyUniforms = sky.material.uniforms;
// skyUniforms["turbidity"].value = 10; // Haze in the atmosphere
// skyUniforms["rayleigh"].value = 2; // Blue light scattering
// skyUniforms["mieCoefficient"].value = 0.005; // Sun scattering
// skyUniforms["mieDirectionalG"].value = 0.8;

// // Add Sun
// const sun = new THREE.Vector3();
// const phi = THREE.MathUtils.degToRad(90 - 30); // Elevation angle
// const theta = THREE.MathUtils.degToRad(180); // Azimuthal angle
// sun.setFromSphericalCoords(1, phi, theta);
// skyUniforms["sunPosition"].value.copy(sun);

// // Add lighting
// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(sun.x, sun.y, sun.z);
// scene.add(light);

/**
 * Floor and Wall
 */
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(35, 30),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
);
ground.rotation.x = -Math.PI * 0.5;
ground.position.y = 0;
ground.position.z = -4;
ground.receiveShadow = true;

const wallFront = new THREE.Mesh(
    new THREE.BoxGeometry(35, 15),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
wallFront.position.z = -19.5;
wallFront.position.y = 7.5;

// LEFT WALL
const wallLeft = new THREE.Mesh(
    new THREE.BoxGeometry(30, 15),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
wallLeft.position.y = 7.5;
wallLeft.position.x = -18;
wallLeft.position.z = -4;
wallLeft.rotation.y = Math.PI / 2;

// RIGHT WALL
const wallRight = new THREE.Mesh(
    new THREE.BoxGeometry(30, 15),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
wallRight.position.y = 7.5;
wallRight.position.x = 18;
wallRight.position.z = -4;

wallRight.rotation.y = Math.PI / 2;

// BACK WALL
const wallBack = new THREE.Mesh(
    new THREE.BoxGeometry(35, 15),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
wallBack.position.z = 11.5;
wallBack.position.y = 7.5;

// CEILING WALL
const wallCeiling = new THREE.Mesh(
    new THREE.BoxGeometry(35, 15, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x00ffff })
);
wallCeiling.rotation.x = -Math.PI * 0.5;
wallCeiling.position.z = -11.5;
wallCeiling.position.y = 14.25;

ground.receiveShadow = true;
wallFront.receiveShadow = true;
wallLeft.receiveShadow = true;
wallRight.castShadow = true;
wallBack.castShadow = true;
wallCeiling.castShadow = true;

scene.add(ground, wallFront, wallLeft, wallRight, wallBack, wallCeiling);

// OBJECTS
const box1 = new THREE.Mesh(
    new THREE.BoxGeometry(35, 5, 5),
    new THREE.MeshStandardMaterial({ color: 0x00ffff })
);

box1.position.y = 2.5;
box1.position.z = -16.5;

const box2 = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    new THREE.MeshStandardMaterial({ color: 0x00aaff })
);
box2.position.y = 6.25;
box2.position.z = -16.5;
box2.position.x = 11.25;

const box3 = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 2.5, 2),
    new THREE.MeshStandardMaterial({ color: 0x00aa00 })
);
box3.position.y = 6;
box3.position.z = -16.5;
box3.position.x = 15;

box1.receiveShadow = true;
box2.receiveShadow = true;
box3.receiveShadow = true;

scene.add(box1, box2, box3);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(0, 2.5, 5); //player camera

// camera.position.set(0, 25, 20); // camera sa babaw (free view)
scene.add(camera);

/**
 * Pointer Lock Controls
 */

// NOTE: CONTROLS (control sa player)
const controls = new PointerLockControls(camera, canvas);
scene.add(controls.getObject());

// Add an event listener to start pointer lock
canvas.addEventListener("click", () => {
    controls.lock();
});

// NOTE: CONTORLS (controls sa free view)
// const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
scene.add(ambientLight);

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.6); // Sky (blue), Ground (brown)
scene.add(hemisphereLight);

// Optional Helper for Hemisphere Light
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,
    5
);
scene.add(hemisphereLightHelper);

// Directional Light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(2, 15, 10); // positioned above
directionalLight.target.position.set(0, 0, 0); // target the center of the scene
scene.add(directionalLight);
scene.add(directionalLight.target);
directionalLight.intensity = 2; // increase the intensity (amplitude)

// CONFIGURE SHADOWS
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = -30;

// Helper for Directional Light Shadow Camera
const shadowCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
);
scene.add(shadowCameraHelper);

/**
 * Player Movement
 */
const movementSpeed = 0.1;
const jumpSpeed = 0.2;
let velocityY = 0;
let isJumping = false;

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
};

window.addEventListener("keydown", (event) => {
    if (keys[event.key.toLowerCase()] !== undefined) {
        keys[event.key.toLowerCase()] = true;
    }
});

window.addEventListener("keyup", (event) => {
    if (keys[event.key.toLowerCase()] !== undefined) {
        keys[event.key.toLowerCase()] = false;
    }
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const deltaTime = clock.getDelta();

    // Movement
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
    );
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

    // NOTE: Player controls
    if (keys.w) controls.moveForward(movementSpeed);
    if (keys.s) controls.moveForward(-movementSpeed);
    if (keys.a) controls.moveRight(-movementSpeed);
    if (keys.d) controls.moveRight(movementSpeed);

    // //FIXME: Jumping
    // if (keys.space && !isJumping) {
    //     velocityY = jumpSpeed;
    //     isJumping = true;
    // }

    // //FIXME: DOESNT WORK YET
    // // Apply gravity
    // velocityY -= deltaTime * 9.8; // Gravity
    // camera.position.y += velocityY;

    // // Stop falling below ground
    // if (camera.position.y <= 1.7) {
    //     camera.position.y = 1.7;
    //     velocityY = 0;
    //     isJumping = false;
    // }

    // NOTE: Free View COntrols
    // controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Renderer Shadow Map Type
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows

tick();
