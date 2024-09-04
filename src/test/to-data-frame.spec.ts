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

test('should convert HTML table to data frame with input fields in table markup', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_input.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  expect(dataFrame).toEqual(expectedData);
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
  const expectedMissingData = [
    { Person: 'Chris', Unknown0: "Record", Likes: 'JavaScript', Age: '22', Unknown1: ""},
  ];
  

  // Act
  const dataFrame = toDataFrame(htmlString);

  // Assert
  expect(dataFrame).toEqual(expectedMissingData);
});