
export type Command = `${'forward' | 'up' | 'down'} ${number}`;

export interface Position {
  horizontal: number;
  depth: number;
  product: number;
}