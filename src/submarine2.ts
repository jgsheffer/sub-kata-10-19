import { Command, Position } from "./submarine";



export const calculatePositionWithAim = (commands: Command[]): Position => {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;
  for (const command of commands) {
    const [action, valueStr] = command.split(' ');
    const value = parseInt(valueStr, 10);

    if (isNaN(value)) {
      throw new Error(`Invalid command: ${command}`);
    }

    switch (action) {
      case 'forward':
        horizontal += value;
      // Ensure depth never goes below 0
      depth =  Math.max(0, depth + value*aim)
        break;
      case 'down':
        aim += value;
        break;
      case 'up':
        aim -= value;
        break;
      default:
        throw new Error(`Invalid command: ${command}`);
    }
  }
  return { horizontal, depth, product: horizontal * depth };
}

