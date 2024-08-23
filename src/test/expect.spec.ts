import { toDataFrame } from '@src/table-data';
import { expectColumnToBeValue } from '@src/table-expect';
import { promises as fs } from 'fs';
import { join } from 'path';

const headers: string[] = ['Person', 'Likes', 'Age'];
const filePath = join(__dirname, 'data', 'table3.html');

let htmlString: string;

beforeEach(async () => {
  htmlString = await fs.readFile(filePath, 'utf-8');
});

test('should expectColumnToBeValue', async () => {
  // Arrange
  const dataFrame = toDataFrame(htmlString, headers);

  // Act
  expectColumnToBeValue(dataFrame, 'Person', 'Chris');
});
