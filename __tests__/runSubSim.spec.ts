import fs from 'fs';
import path from 'path';
import { calculatePositionWithAim } from '../src/submarine2';

jest.mock('fs');
jest.mock('path');
jest.mock('../src/submarine2');

const mockReadFileSync = fs.readFileSync as jest.Mock;
const mockCalculatePositionWithAim = calculatePositionWithAim as jest.Mock;

describe('runSubSim', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should read commands from file and calculate position', () => {
    mockReadFileSync.mockReturnValue('forward 5\ndown 3\nup 1');
    mockCalculatePositionWithAim.mockReturnValue({ horizontal: 5, depth: 2, product: 10 });

    process.argv = ['node', 'runSubSim', 'input.txt'];
    require('../src/runSubSim');

    expect(mockReadFileSync).toHaveBeenCalledWith(path.resolve('input.txt'), 'utf-8');
    expect(mockCalculatePositionWithAim).toHaveBeenCalledWith(['forward 5', 'down 3', 'up 1']);
    expect(console.log).toHaveBeenCalledWith('Final position:', { horizontal: 5, depth: 2, product: 10 });
    expect(console.log).toHaveBeenCalledWith('Product of horizontal position and depth:', 10);
  });
});