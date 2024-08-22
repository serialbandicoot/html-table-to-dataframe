import { toPrettyPrint } from '@src/support/table/table-pretty';
import { toDataFrame } from '../support/table/table-data';
import { promises as fs } from 'fs';
import { join } from 'path';

const headers: string[] = ["Person", "Likes", "Age"];
const filePath = join(__dirname, 'data', 'table1.html');

let htmlString: string;

beforeEach(async () => {
  htmlString = await fs.readFile(filePath, 'utf-8');
});


test('should convert data frame to pretty table and output correct format', async () => {
  // Arrange
  const dataFrame = await toDataFrame(htmlString, headers);
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  // Act
  toPrettyPrint(dataFrame);

  // Assert
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Person'));
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Likes'));
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Age'));

  // Restore console.log
  logSpy.mockRestore();
});