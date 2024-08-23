import { join } from 'path';
import { promises as fs } from 'fs';

export const getHTMLFile = async (fileName: string): Promise<string> => {
  const filePath = join(__dirname, '..', 'data', fileName);
  return await fs.readFile(filePath, 'utf-8');
};

export const defaultHeaders: string[] = ['Person', 'Likes', 'Age'];
