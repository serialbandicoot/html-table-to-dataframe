import { toPrettyPrint } from '../table-pretty';
import { toDataFrame } from '../table-data';
import { defaultHeaders, getHTMLFile } from './support/utils';

test('should convert data frame to pretty table and output correct format', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_1_row.html');
  const dataFrame = toDataFrame(htmlString, defaultHeaders);
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
