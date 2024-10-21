
import { calculatePositionWithAim } from '../src/submarine2';
import { Command } from '../src/subTypes';

describe('Submarine Position Calculator part2', () => {
  it('returns {horizontal: 0, depth: 0, product:0} for an empty input', () => {
    expect(calculatePositionWithAim([])).toEqual({ horizontal: 0, depth: 0, product: 0 });
  });

  it('correctly calculates position for a single forward command', () => {
    expect(calculatePositionWithAim(['forward 5'])).toEqual({ horizontal: 5, depth: 0, product: 0 });
  });

  it('correctly calculates position for a single down command', () => {
    expect(calculatePositionWithAim(['down 3'])).toEqual({ horizontal: 0, depth: 0,  product: 0 });
  });

  it('correctly calculates position for a single up command', () => {
    expect(calculatePositionWithAim(['up 2'])).toEqual({ horizontal: 0, depth: 0, product: 0 });
  });

  it('correctly calculates position for multiple commands', () => {
    const commands: Array<Command> = [
      'forward 5', 
      'down 5', 
      'forward 8', 
      'up 3', 
      'down 8', 
      'forward 2'
    ];
    expect(calculatePositionWithAim(commands)).toEqual({ horizontal: 15, depth: 60, product: 900 });
  });

  it('handles negative depths (submarines cant fly)', () => {
    const commands: Array<Command> = [
      'up 5', // { horizontal: 0, depth: 0 } aim -5
      'forward 3', // { horizontal: 3, depth: 0 } aim -5
      'down 6', // { horizontal: 3, depth: 0 } aim 1
      'forward 2' // { horizontal: 5, depth: 2 } aim 1
    ];
    expect(calculatePositionWithAim(commands)).toEqual({ horizontal: 5, depth: 2, product: 10 });
  });

  it('handles large numbers', () => {
    const commands: Array<Command> = [
      'forward 1000000',
      'down 2000000',
      'forward 1000000',
    ];
    expect(calculatePositionWithAim(commands)).toEqual({ horizontal: 2000000, depth: 2000000000000, product: 4000000000000000000 });
  });

  it('throws an error for invalid commands', () => {
    expect(() => calculatePositionWithAim(['sideways 5' as Command])).toThrow('Invalid command: sideways 5');
  });

  it('throws an error for commands with invalid numbers', () => {
    expect(() => calculatePositionWithAim(['forward abc' as Command])).toThrow('Invalid command: forward abc');
  });
});