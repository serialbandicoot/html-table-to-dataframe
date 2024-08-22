import { toDataFrame } from '../support/table/table-data';
import { promises as fs } from 'fs';
import { join } from 'path';

const headers: string[] = ['Person', 'Likes', 'Age'];
const filePath = join(__dirname, 'data', 'table1.html');
const expectedData = [
  { Person: 'Chris', Likes: 'HTML tables', Age: '22' },
  { Person: 'Dennis', Likes: 'Web accessibility', Age: '45' },
  { Person: 'Sarah', Likes: 'JavaScript frameworks', Age: '29' },
  { Person: 'Karen', Likes: 'Web performance', Age: '36' },
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
