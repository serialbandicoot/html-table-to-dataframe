import { toDataFrame, toTable } from '../index';
import { promises as fs } from 'fs';
import { join } from 'path';

const headers: string[] = ["Person", "Likes", "Age"];
const filePath = join(__dirname, 'data', 'table1.html');
const expectedData = [
  { Person: "Chris", Likes: "HTML tables", Age: "22" },
  { Person: "Dennis", Likes: "Web accessibility", Age: "45" },
  { Person: "Sarah", Likes: "JavaScript frameworks", Age: "29" },
  { Person: "Karen", Likes: "Web performance", Age: "36" },
];

let htmlString: string;

beforeEach(async () => {
  htmlString = await fs.readFile(filePath, 'utf-8');
});

test('should convert HTML table to data frame and match expected data', async () => {
  // Arrange
  const expectedDataFrame = expectedData;

  // Act
  const dataFrame = await toDataFrame(htmlString, headers);

  // Assert
  expect(dataFrame).toEqual(expectedDataFrame);
});

test('should convert data frame to pretty table and output correct format', async () => {
  // Arrange
  const dataFrame = await toDataFrame(htmlString, headers);
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  // Act
  await toTable(dataFrame);

  // Assert
  // Ensure that console.log is called with the expected content
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Person'));
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Likes'));
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Age'));

  // Restore the original console.log method
  logSpy.mockRestore();
});