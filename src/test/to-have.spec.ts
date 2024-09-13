import { toDataFrame } from '../table-data';
import {
  toHaveTableRowCountGreaterThan,
  toHaveColumnToBeValue,
  toHaveColumnValuesToMatchRegex,
  toHaveColumnValuesToBeInRange,
  toHaveColumnValuesToBeNumbers,
  toHaveColumnToMatchWhenFilteredBy,
  toHaveColumnToMatchGroupWhenFilteredBy,
  GroupType,
  toHaveColumnToNotMatch,
  toHaveTableRowCount,
  toHaveColumnGroupToBeValue,
  toHaveColumnGroupToBeValues,
  toHaveTableToNotMatch,
  toHaveTableToMatch,
  toHaveTableRowCountEqualTo,
  toHaveTableRowCountLessThan,
  toHaveColumnValuesInSet,
} from '../table-to-have';
import { defaultHeaders, getHTMLFile } from './support/utils';

test('should have table row count greater than', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveTableRowCountGreaterThan(dataFrame, 3);
});

test('should have column values matching regex', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveColumnValuesToMatchRegex(dataFrame, 'Age', '\\d{1,2}');
});

test('should have column values in range', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveColumnValuesToBeInRange(dataFrame, 'Age', 0, 45);
});

test('should have column values as numbers', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveColumnValuesToBeNumbers(dataFrame, 'Age');
});

test('should have column matching when filtered by', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveColumnToMatchWhenFilteredBy(dataFrame, 'Age', '22', 'Person', 'Chris');
});

test('should have column matching group when filtered by', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');
  const group: GroupType[] = [
    { filterColumn: 'Person', filterValue: 'Chris' },
    { filterColumn: 'Likes', filterValue: 'HTML tables' },
  ];

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveColumnToMatchGroupWhenFilteredBy(dataFrame, 'Age', '22', group);
});

test('should have column not matching', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveColumnToNotMatch(dataFrame, 'Age', '100');
});

test('should have table row count', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveTableRowCount(dataFrame, 4);
});

test('should have column value', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_1_row.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveColumnToBeValue(dataFrame, 'Person', 'Chris');
});

test('should have column group value', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_1_row.html');
  const group: GroupType[] = [
    { filterColumn: 'Person', filterValue: 'Chris' },
    { filterColumn: 'Likes', filterValue: 'HTML tables' },
  ];

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Assert
  toHaveColumnGroupToBeValue(dataFrame, group);
});

test('should have column group values', async () => {
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

  // Assert
  toHaveColumnGroupToBeValues(dataFrame, [groupA, groupB]);
});

test('should have table not matching', async () => {
  // Arrange
  const htmlString1 = await getHTMLFile('table_1_row.html');
  const htmlString2 = await getHTMLFile('table_1b_row.html');

  // Act
  const dataFrame1 = toDataFrame(htmlString1, defaultHeaders);
  const dataFrame2 = toDataFrame(htmlString2, defaultHeaders);

  // Assert
  toHaveTableToNotMatch(dataFrame1, dataFrame2);
});

test('should have table matching', async () => {
  // Arrange
  const htmlString1 = await getHTMLFile('table_1_row.html');
  const htmlString2 = await getHTMLFile('table_1_row.html');

  // Act
  const dataFrame1 = toDataFrame(htmlString1, defaultHeaders);
  const dataFrame2 = toDataFrame(htmlString2, defaultHeaders);

  // Assert
  toHaveTableToMatch(dataFrame1, dataFrame2);
});

test('should have table row count equal to', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString);

  // Assert
  toHaveTableRowCountEqualTo(dataFrame, 4);
});

test('should have table row less than', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString);

  // Assert
  toHaveTableRowCountLessThan(dataFrame, 5);
});

test('should have table row less than', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString);

  // Assert
  toHaveTableRowCountGreaterThan(dataFrame, 3);
});

test('should have all Likes in the provided set', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString);

  const allowedLikesSet = new Set(['HTML tables', 'Web accessibility', 'JavaScript frameworks', 'Web performance']);

  // Assert
  toHaveColumnValuesInSet(dataFrame, 'Likes', allowedLikesSet);
});
