import * as THREE from 'three';

export const createFishGroup = () => {
  const fishGroup = new THREE.Group();
  const bodyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const tailGeometry = new THREE.ConeGeometry(0.5, 1, 32);
  const fishMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
  
  const body = new THREE.Mesh(bodyGeometry, fishMaterial);
  const tail = new THREE.Mesh(tailGeometry, fishMaterial);
  
  tail.position.set(-0.75, 0, 0);
  tail.rotation.z = Math.PI / 2;
  
  fishGroup.add(body);
  fishGroup.add(tail);
  
  return fishGroup;
};
