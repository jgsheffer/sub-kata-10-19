import { Command, Position } from "./types";
export const calculatePositionWithAim = (commands: Command[]): Position => {
  let x = 0;
  let y = 0;
  let z = 0;
  let pitch = 0;
  let yaw = 0;

  for (const command of commands) {
    const [action, valueStr] = command.split(' ');
    const value = parseInt(valueStr, 10);

    if (isNaN(value)) {
      throw new Error(`Invalid command: ${command}`);
    }

    switch (action) {
      case 'forward':
        // Move forward in the direction the submarine is facing
        x += value * Math.cos(yaw) * Math.cos(pitch);
        y += value * Math.sin(pitch);
        z += value * Math.sin(yaw) * Math.cos(pitch);
        break;
      case 'up':
        pitch = Math.min(pitch + value * (Math.PI / 180), Math.PI / 4); // Limit pitch to 45 degrees
        break;
      case 'down':
        pitch = Math.max(pitch - value * (Math.PI / 180), -Math.PI / 4); // Limit pitch to -45 degrees
        break;
      case 'left':
        yaw = (yaw - value * (Math.PI / 180)) % (2 * Math.PI);
        break;
      case 'right':
        yaw = (yaw + value * (Math.PI / 180)) % (2 * Math.PI);
        break;
      default:
        throw new Error(`Invalid command: ${command}`);
    }
  }

  return { x, y, z, pitch, yaw };
};