import { toDataFrame } from '@src/table-data';
import { defaultHeaders, getHTMLFile } from './support/utils';

const expectedData = [
  { Person: 'Chris', Likes: 'HTML tables', Age: '22' },
  { Person: 'Dennis', Likes: 'Web accessibility', Age: '45' },
  { Person: 'Sarah', Likes: 'JavaScript frameworks', Age: '29' },
  { Person: 'Karen', Likes: 'Web performance', Age: '36' },
];

test('should convert HTML table to data frame with simple table markup', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString);

  // Assert
  expect(dataFrame).toEqual(expectedData);
});

test('should return an empty object from no rows', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_empty.html');

  // Act
  const dataFrame = toDataFrame(htmlString);

  // Assert
  expect(dataFrame).toEqual([]);
});

test('should convert HTML table to data frame with input fields in table markup', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_input.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  expect(dataFrame).toEqual(expectedData);
});

test('should convert HTML table using my own headers', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_1_row.html');
  const expectedWithProvidedKeys = [{ a: 'Chris', '*b': 'HTML tables', c: '22' }];

  // Act
  const dataFrame = toDataFrame(htmlString, ['a', '*b', 'c']);

  // Assert
  expect(dataFrame).toEqual(expectedWithProvidedKeys);
});

test('should convert HTML table to data frame with input fields in table markup', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_textarea.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  expect(dataFrame).toEqual(expectedData);
});

test('should convert HTML table with Unknown for the missing headers', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_missing_headers.html');
  const expectedMissingData = [{ Person: 'Chris', Unknown0: 'Record', Likes: 'JavaScript', Age: '22', Unknown1: '' }];

  // Act
  const dataFrame = toDataFrame(htmlString);

  // Assert
  expect(dataFrame).toEqual(expectedMissingData);
});

test('should validate inaccurate provided header length', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_input.html');

  // Act
  try {
    toDataFrame(htmlString, ['a', 'b']);
  } catch (error) {
    // Assert
    expect((error as Error).message).toEqual(
      'The number of provided headers (2) does not match the number of columns in the table (3).',
    );
  }
});

test('should handle when td used instead of th in header row', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_bad_header.html');
  const expectedWithTDs = [{ Person: 'Chris', Likes: 'HTML tables', Age: '22' }];

  // Act
  const dataFrame = toDataFrame(htmlString);

  // Assert
  expect(dataFrame).toEqual(expectedWithTDs);
});

test('should handle when td used instead of th in header row using custom header', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_bad_header.html');
  const expectedWithTDs = [{ a: 'Chris', b: 'HTML tables', c: '22' }];

  // Act
  const dataFrame = toDataFrame(htmlString, ['a', 'b', 'c']);

  // Assert
  expect(dataFrame).toEqual(expectedWithTDs);
});
