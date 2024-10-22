export type Command = `${'forward' | 'up' | 'down' | 'left' | 'right'} ${number}`;

export interface Position {
  x: number;
  y: number;
  z: number;
  pitch: number;
  yaw: number;
}
