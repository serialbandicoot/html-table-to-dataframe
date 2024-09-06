import { toInteractiveDataFrame } from '@src/table-interactive';

import { getHTMLFile } from './support/utils';

test('should get an interactive table', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_interactive.html');

  // Act
  const dataFrame = toInteractiveDataFrame(htmlString);

  // Assert
  expect(dataFrame).toEqual([
    {
      Person: { id: 'value', value: 'Chris', type: 'select' },
      Likes: { id: 'value', value: 'HTML tables', type: 'textarea' },
      Age: { id: 'value', value: '22', type: 'input' },
    },
    {
      Person: { id: 'value', value: 'Dennis', type: 'select' },
      Likes: { id: 'value', value: 'Web accessibility', type: 'textarea' },
      Age: { id: 'value', value: '45', type: 'input' },
    },
    {
      Person: { id: 'value', value: 'Sarah', type: 'select' },
      Likes: { id: 'value', value: 'JavaScript frameworks', type: 'textarea' },
      Age: { id: 'value', value: '29', type: 'input' },
    },
    {
      Person: { id: 'value', value: 'Karen', type: 'select' },
      Likes: { id: 'value', value: 'Web performance', type: 'textarea' },
      Age: { id: 'value', value: '36', type: 'input' },
    },
  ]);
});
