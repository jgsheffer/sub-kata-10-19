
import  {calculatePosition }  from '../src/submarine';

describe('Submarine Position Calculator', () => {
  it('returns {horizontal: 0, depth: 0} for an empty input', () => {
    expect(calculatePosition([])).toEqual({ horizontal: 0, depth: 0 });
  });

  it('correctly calculates position for a single forward command', () => {
    expect(calculatePosition(['forward 5'])).toEqual({ horizontal: 5, depth: 0 });
  });

  it('correctly calculates position for a single down command', () => {
    expect(calculatePosition(['down 3'])).toEqual({ horizontal: 0, depth: 3 });
  });

  it('correctly calculates position for a single up command', () => {
    expect(calculatePosition(['up 2'])).toEqual({ horizontal: 0, depth: 0 });
  });

  it('correctly calculates position for multiple commands', () => {
    const commands = [
      'forward 5',
      'down 5',
      'forward 8',
      'up 3',
      'down 8',
      'forward 2'
    ];
    expect(calculatePosition(commands)).toEqual({ horizontal: 15, depth: 10 });
  });

  it('handles negative depths (submarines cant fly)', () => {
    const commands = [
      'up 5',
      'forward 3',
      'down 2'
    ];
    expect(calculatePosition(commands)).toEqual({ horizontal: 3, depth: 0 });
  });

  it('handles large numbers', () => {
    const commands = [
      'forward 1000000',
      'down 2000000',
      'up 1000000'
    ];
    expect(calculatePosition(commands)).toEqual({ horizontal: 1000000, depth: 1000000 });
  });

  it('throws an error for invalid commands', () => {
    expect(() => calculatePosition(['sideways 5'])).toThrow('Invalid command: sideways 5');
  });

  it('throws an error for commands with invalid numbers', () => {
    expect(() => calculatePosition(['forward abc'])).toThrow('Invalid command: forward abc');
  });
});