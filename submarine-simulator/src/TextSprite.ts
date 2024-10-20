import * as THREE from 'three';

export const createTextSprite = (text: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 1024;  // Increased canvas width
  canvas.height = 256;  // Increased canvas height
  if (context) {
    context.fillStyle = '#ffffff';
    context.font = 'bold 96px Arial';  // Increased font size and made it bold
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(20, 5, 2);  // Adjusted scale to make it larger
  return sprite;
};

export const updateTextSprite = (sprite: THREE.Sprite, newText: string) => {
  const canvas = sprite.material.map!.image as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = 'bold 96px Arial';  // Increased font size and made it bold
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(newText, canvas.width / 2, canvas.height / 2);
  }
  sprite.material.map!.needsUpdate = true;
};