import fs from 'fs';
import path from 'path';
import { calculatePositionWithAim } from './submarine2';
import { Command } from './subTypes';

const readCommandsFromFile = (filePath: string): Command[] => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n').filter(line => line.trim() !== '').map(line => line as Command);
  } catch (error) {
    console.error(`Error reading file: ${(error as Error).message}`);
    process.exit(1);
  }
}

const main = () => {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Usage: npm run runSubSim -- <input_file>');
    process.exit(1);
  }

  const inputFile = path.resolve(args[0]);
  const commands = readCommandsFromFile(inputFile);
  const result = calculatePositionWithAim(commands);

  console.log('Final position:', result);
  console.log('Product of horizontal position and depth:', result.product);
}

main();