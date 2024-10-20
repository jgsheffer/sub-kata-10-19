import * as THREE from 'three';
import { createFishGroup } from './FishModel';
import { createSubmarine } from './SubmarineModel';
import { nx, ny, nz, px, py, pz } from './images';

export const setupScene = (container: HTMLDivElement) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // Load HDRI skybox
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([px, nx, py, ny, pz, nz]);
  scene.background = texture;
  scene.environment = texture;

  // Add grid
  const gridHelper = new THREE.GridHelper(100, 20, 0x888888, 0x444444);
  gridHelper.position.y = -10;
  scene.add(gridHelper);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  const submarine = createSubmarine();
  submarine.position.set(-40, 0, 0);
  scene.add(submarine);

  const fish = [];
  for (let i = 0; i < 10; i++) {
    const fishGroup = createFishGroup();
    // Position fish on the right side of the scene
    fishGroup.position.set(
      Math.random() * 50 + 50, // X position between 50 and 100
      Math.random() * 20 - 10, // Y position between -10 and 10
      Math.random() * 20 - 10  // Z position between -10 and 10
    );
    // Rotate fish to face left
    fishGroup.rotation.y = Math.PI;
    scene.add(fishGroup);
    fish.push(fishGroup);
  }

  camera.position.set(0, 10, 50);
  camera.lookAt(0, 0, 0);

  return { scene, camera, renderer, submarine, fish };
};