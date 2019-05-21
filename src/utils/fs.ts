import * as fs from 'fs';

export function safeReadFileSync(fileName: string, encoding: string) {
  try {
    return fs.readFileSync(fileName, encoding);
  } catch (error) {
    return null;
  }
}
