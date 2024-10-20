export type Command = string;

export interface Position {
  horizontal: number;
  depth: number;
  aim: number;
}

export const calculatePositionWithAim = (commands: Command[]): Position => {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  commands.forEach(command => {
    const [action, valueStr] = command.split(' ');
    const value = parseInt(valueStr, 10);

    switch (action) {
      case 'forward':
        horizontal += value;
        depth += aim * value;
        break;
      case 'down':
        aim += value;
        break;
      case 'up':
        aim -= value;
        break;
    }
  });

  return { horizontal, depth, aim };
};
