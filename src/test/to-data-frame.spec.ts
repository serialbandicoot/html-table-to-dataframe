import { toDataFrame } from '@src/table-data';
import { promises as fs } from 'fs';
import { join } from 'path';

const headers: string[] = ['Person', 'Likes', 'Age'];
const filePath1 = join(__dirname, 'data', 'table1.html');
const filePath2 = join(__dirname, 'data', 'table2.html');
const expectedData = [
  { Person: 'Chris', Likes: 'HTML tables', Age: '22' },
  { Person: 'Dennis', Likes: 'Web accessibility', Age: '45' },
  { Person: 'Sarah', Likes: 'JavaScript frameworks', Age: '29' },
  { Person: 'Karen', Likes: 'Web performance', Age: '36' },
];

let htmlString1: string;
let htmlString2: string;

beforeEach(async () => {
  htmlString1 = await fs.readFile(filePath1, 'utf-8');
  htmlString2 = await fs.readFile(filePath2, 'utf-8');
});

test('should convert HTML table to data frame with simple table markup', async () => {
  // Arrange
  const expectedDataFrame = expectedData;

  // Act
  const dataFrame = toDataFrame(htmlString1, headers);

  // Assert
  expect(dataFrame).toEqual(expectedDataFrame);
});

test('should convert HTML table to data frame with input fields in table markup', async () => {
  // Arrange
  const expectedDataFrame = expectedData;

  // Act
  const dataFrame = toDataFrame(htmlString2, headers);

  // Assert
  expect(dataFrame).toEqual(expectedDataFrame);
});