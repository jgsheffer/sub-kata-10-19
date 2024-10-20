import * as THREE from 'three';

export const createSubmarine = () => {
  const submarineGroup = new THREE.Group();
  const bodyGeometry = new THREE.CapsuleGeometry(1, 3, 16, 16);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffff00,
    metalness: 0.3,
    roughness: 0.7,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  submarineGroup.add(body);

  const periscopeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
  const periscopeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x808080,
    metalness: 0.5,
    roughness: 0.5,
  });
  const periscope = new THREE.Mesh(periscopeGeometry, periscopeMaterial);
  periscope.position.set(0, 1.5, 0);
  submarineGroup.add(periscope);

  return submarineGroup;
};
