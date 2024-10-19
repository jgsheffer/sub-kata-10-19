
export type Command = `${'forward' | 'up' | 'down'} ${number}`;

export interface Position {
  horizontal: number;
  depth: number;
}

export const calculatePosition = (commands: Command[]): Position => {
  return { horizontal: 0, depth: 0 };
}

