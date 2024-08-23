import { toDataFrame } from '@src/table-data';
import {
  expectTableRowCountToBeGreaterThan,
  expectColumnToBeValue,
  expectColumnValuesToMatchRegex,
  expectColumnValuesToBeInRange,
  expectColumnValuesToBeNumbers,
  expectColumnToMatchWhenFilteredBy,
  expectColumnToMatchGroupWhenFilteredBy,
  GroupType,
  expectColumnToNotMatch,
  expectTableRowCountToBe,
  expectColumnGroupToBeValue,
  expectColumnGroupToBeValues,
  expectTableToNotMatch,
  expectTableToMatch,
} from '@src/table-expect';
import { defaultHeaders, getHTMLFile } from './support/utils';

test('should expectTableRowCountToBeGreaterThan', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectTableRowCountToBeGreaterThan(dataFrame, 3);
});

test('should expectColumnValuesToMatchRegex', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnValuesToMatchRegex(dataFrame, 'Age', '\\d{1,2}');
});

test('should expectColumnValuesToBeInRange', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnValuesToBeInRange(dataFrame, 'Age', 0, 45);
});

test('should expectColumnValuesToBeNumbers', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnValuesToBeNumbers(dataFrame, 'Age');
});

test('should expectColumnToMatchWhenFilteredBy', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnToMatchWhenFilteredBy(dataFrame, 'Age', '22', 'Person', 'Chris');
});

test('should expectColumnToMatchGroupWhenFilteredBy', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');
  const group: GroupType[] = [
    { filterColumn: 'Person', filterValue: 'Chris' },
    { filterColumn: 'Likes', filterValue: 'HTML tables' },
  ];

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnToMatchGroupWhenFilteredBy(dataFrame, 'Age', '22', group);
});

test('should expectColumnToNotMatch', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnToNotMatch(dataFrame, 'Age', '100');
});

test('should expectTableRowCountToBe', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectTableRowCountToBe(dataFrame, 4);
});

test('should expectTableRowCountToBe', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectTableRowCountToBe(dataFrame, 4);
});

test('should expectColumnToBeValue', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_1_row.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnToBeValue(dataFrame, 'Person', 'Chris');
});

test('should expectColumnGroupToBeValue', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_1_row.html');
  const group: GroupType[] = [
    { filterColumn: 'Person', filterValue: 'Chris' },
    { filterColumn: 'Likes', filterValue: 'HTML tables' },
  ];

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnGroupToBeValue(dataFrame, group);
});

test('should expectColumnGroupToBeValues', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_2_row.html');
  const groupA: GroupType[] = [
    { filterColumn: 'Person', filterValue: 'Chris' },
    { filterColumn: 'Likes', filterValue: 'HTML tables' },
    { filterColumn: 'Age', filterValue: '22' },
  ];
  const groupB: GroupType[] = [
    { filterColumn: 'Person', filterValue: 'Dennis' },
    { filterColumn: 'Likes', filterValue: 'Web accessibility' },
    { filterColumn: 'Age', filterValue: '45' },
  ];

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnGroupToBeValues(dataFrame, [groupA, groupB]);
});

test('should expectTableToNotMatch', async () => {
  // Arrange
  const htmlString1 = await getHTMLFile('table_1_row.html');
  const htmlString2 = await getHTMLFile('table_1b_row.html');

  // Act
  const dataFrame1 = toDataFrame(htmlString1, defaultHeaders);
  const dataFrame2 = toDataFrame(htmlString2, defaultHeaders);

  // Act
  expectTableToNotMatch(dataFrame1, dataFrame2);
});

test('should expectTableToMatch', async () => {
  // Arrange
  const htmlString1 = await getHTMLFile('table_1_row.html');
  const htmlString2 = await getHTMLFile('table_1_row.html');

  // Act
  const dataFrame1 = toDataFrame(htmlString1, defaultHeaders);
  const dataFrame2 = toDataFrame(htmlString2, defaultHeaders);

  // Act
  expectTableToMatch(dataFrame1, dataFrame2);
});
