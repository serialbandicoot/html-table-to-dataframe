import { toInteractiveDataFrame } from '../table-data';

import { getHTMLFile } from './support/utils';
test('should get an interactive table', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_interactive.html');

  // Act
  const dataFrame = toInteractiveDataFrame(htmlString);

  // Assert
  expect(dataFrame).toEqual([
    {
      Person: {
        attributes: {
          id: 'person-1',
          name: 'person-1',
          'data-test-id': 'person-chris',
        },
        type: 'select',
      },
      Likes: {
        attributes: {
          id: 'likes-1',
          name: 'likes-1',
          'data-test-id': 'likes-chris',
        },
        type: 'textarea',
      },
      Age: {
        attributes: {
          type: 'number',
          id: 'age-1',
          name: 'age-1',
          value: '22',
          'data-testid': 'age-1',
        },
        type: 'input',
      },
    },
    {
      Person: {
        attributes: {
          id: 'person-2',
          name: 'person-2',
          'data-test-id': 'person-dennis',
        },
        type: 'select',
      },
      Likes: {
        attributes: {
          id: 'likes-2',
          name: 'likes-2',
          'data-test-id': 'likes-dennis',
        },
        type: 'textarea',
      },
      Age: {
        attributes: {
          type: 'number',
          id: 'age-2',
          name: 'age-2',
          value: '45',
          'data-testid': 'age-2',
        },
        type: 'input',
      },
    },
    {
      Person: {
        attributes: {
          id: 'person-3',
          name: 'person-3',
          'data-test-id': 'person-sarah',
        },
        type: 'select',
      },
      Likes: {
        attributes: {
          id: 'likes-3',
          name: 'likes-3',
          'data-test-id': 'likes-sarah',
        },
        type: 'textarea',
      },
      Age: {
        attributes: {
          type: 'number',
          id: 'age-3',
          name: 'age-3',
          value: '29',
          'data-testid': 'age-3',
        },
        type: 'input',
      },
    },
    {
      Person: {
        attributes: {
          id: 'person-4',
          name: 'person-4',
          'data-test-id': 'person-karen',
        },
        type: 'select',
      },
      Likes: {
        attributes: {
          id: 'likes-4',
          name: 'likes-4',
          'data-test-id': 'likes-karen',
        },
        type: 'textarea',
      },
      Age: {
        attributes: {
          type: 'number',
          id: 'age-4',
          name: 'age-4',
          value: '36',
          'data-testid': 'age-4',
        },
        type: 'input',
      },
    },
  ]);
});
