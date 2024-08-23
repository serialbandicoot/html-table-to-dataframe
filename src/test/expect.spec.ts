import { toDataFrame } from '@src/table-data';
import { expectColumnToBeValue } from '@src/table-expect';
import { defaultHeaders, getHTMLFile } from './support/utils';

test('should expectColumnToBeValue', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_1_row.html');

  // Act
  const dataFrame = toDataFrame(htmlString, defaultHeaders);

  // Act
  expectColumnToBeValue(dataFrame, 'Person', 'Chris');
});
