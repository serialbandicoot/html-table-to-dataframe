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
  toHaveColumnsValuesToMatchRegex,
} from '../table-to-have';
import { defaultHeaders, getHTMLFile } from './support/utils';

test('should have table row count greater than', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

  // Assert
  toHaveTableRowCountGreaterThan(dataFrame, 3);
});

test('should have column values matching regex', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_regex.html');

  // Act
  const dataFrame = toDataFrame(htmlString);

  // Assert
  toHaveColumnValuesToMatchRegex(dataFrame, 'Age', '\\d{1,2}');
  toHaveColumnValuesToMatchRegex(dataFrame, 'Percent1', '^(100|[1-9]?[0-9])%$');
  toHaveColumnsValuesToMatchRegex(dataFrame, ['Percent1', 'Percent2'], '^(100|[1-9]?[0-9])%$');
});

test('should have column values in range', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

  // Assert
  toHaveColumnValuesToBeInRange(dataFrame, 'Age', 0, 45);
});

test('should have column values as numbers', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

  // Assert
  toHaveColumnValuesToBeNumbers(dataFrame, 'Age');
});

test('should have column matching when filtered by', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

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
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

  // Assert
  toHaveColumnToMatchGroupWhenFilteredBy(dataFrame, 'Age', '22', group);
});

test('should have column not matching', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

  // Assert
  toHaveColumnToNotMatch(dataFrame, 'Age', '100');
});

test('should have table row count', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

  // Assert
  toHaveTableRowCount(dataFrame, 4);
});

test('should have column value', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_1_row.html');

  // Act
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

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
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

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
  const dataFrame = toDataFrame(htmlString, { header: defaultHeaders });

  // Assert
  toHaveColumnGroupToBeValues(dataFrame, [groupA, groupB]);
});

test('should have table not matching', async () => {
  // Arrange
  const htmlString1 = await getHTMLFile('table_1_row.html');
  const htmlString2 = await getHTMLFile('table_1b_row.html');

  // Act
  const dataFrame1 = toDataFrame(htmlString1, { header: defaultHeaders });
  const dataFrame2 = toDataFrame(htmlString2, { header: defaultHeaders });

  // Assert
  toHaveTableToNotMatch(dataFrame1, dataFrame2);
});

test('should have table matching', async () => {
  // Arrange
  const htmlString1 = await getHTMLFile('table_1_row.html');
  const htmlString2 = await getHTMLFile('table_1_row.html');

  // Act
  const dataFrame1 = toDataFrame(htmlString1, { header: defaultHeaders });
  const dataFrame2 = toDataFrame(htmlString2, { header: defaultHeaders });

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

test('should throw error when asserting column values in set for non-existent column', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table.html');

  // Act
  const dataFrame = toDataFrame(htmlString);

  const allowedLikesSet = new Set(['HTML tables', 'Web accessibility', 'JavaScript frameworks', 'Web performance']);
  const expectedError = `Column header "Non-existent Column" was not found in row ${JSON.stringify(dataFrame[0])}`;

  // Assert
  expect(() => toHaveColumnValuesInSet(dataFrame, 'Non-existent Column', allowedLikesSet)).toThrow(expectedError);
});

test('should have checks from footer with locatorId', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_footer_locator_row.html');

  // Act
  const rowLocatorID = '[data-test-id="footer-row"]';
  const dataFrame = toDataFrame(htmlString, { footer: true, locatorId: rowLocatorID, header: ['One', 'Two', 'Three'] });

  // Assert
  toHaveColumnToBeValue(dataFrame, 'One', 'Bob');
  toHaveColumnToBeValue(dataFrame, 'Two', 'Enid');
  toHaveColumnToBeValue(dataFrame, 'Three', 'Sue');
});
