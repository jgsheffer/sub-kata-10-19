
export type Command = `${'forward' | 'up' | 'down'} ${number}`;

export interface Position {
  horizontal: number;
  depth: number;
  product: number;
}

export const calculatePosition = (commands: Command[]): Position => {
  let horizontal = 0;
  let depth = 0;
  for (const command of commands) {
    const [action, valueStr] = command.split(' ');
    const value = parseInt(valueStr, 10);

    if (isNaN(value)) {
      throw new Error(`Invalid command: ${command}`);
    }

    switch (action) {
      case 'forward':
        horizontal += value;
        break;
      case 'down':
        depth += value;
        break;
      case 'up':
        // Ensure depth never goes below 0
        depth =  Math.max(0, depth - value)
        break;
      default:
        throw new Error(`Invalid command: ${command}`);
    }
  }
  return { horizontal, depth, product: horizontal * depth };
}

