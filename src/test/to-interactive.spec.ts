import { toDataFrame, toInteractiveDataFrame } from '../table-data';
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
          id: "person-1",
          name: "person-1",
          "data-test-id": "person-chris",
        },
        type: "select",
      },
      Likes: {
        attributes: {
          id: "likes-1",
          name: "likes-1",
          "data-test-id": "likes-chris",
        },
        type: "textarea",
      },
      Age: {
        attributes: {
          type: "number",
          id: "age-1",
          name: "age-1",
          value: "22",
          "data-testid": "age-1",
        },
        type: "input",
      },
      Links: {
        attributes: {
          href: "#chris-1",
        },
        type: "link",
      },
    },
    {
      Person: {
        attributes: {
          id: "person-2",
          name: "person-2",
          "data-test-id": "person-dennis",
        },
        type: "select",
      },
      Likes: {
        attributes: {
          id: "likes-2",
          name: "likes-2",
          "data-test-id": "likes-dennis",
        },
        type: "textarea",
      },
      Age: {
        attributes: {
          type: "number",
          id: "age-2",
          name: "age-2",
          value: "45",
          "data-testid": "age-2",
        },
        type: "input",
      },
      Links: {
        attributes: {
          href: "#dennis-2",
        },
        type: "link",
      },
    },
    {
      Person: {
        attributes: {
          id: "person-3",
          name: "person-3",
          "data-test-id": "person-sarah",
        },
        type: "select",
      },
      Likes: {
        attributes: {
          id: "likes-3",
          name: "likes-3",
          "data-test-id": "likes-sarah",
        },
        type: "textarea",
      },
      Age: {
        attributes: {
          type: "number",
          id: "age-3",
          name: "age-3",
          value: "29",
          "data-testid": "age-3",
        },
        type: "input",
      },
      Links: {
        attributes: {
          href: "#sarah-3",
        },
        type: "link",
      },
    },
    {
      Person: {
        attributes: {
          id: "person-4",
          name: "person-4",
          "data-test-id": "person-karen",
        },
        type: "select",
      },
      Likes: {
        attributes: {
          id: "likes-4",
          name: "likes-4",
          "data-test-id": "likes-karen",
        },
        type: "textarea",
      },
      Age: {
        attributes: {
          type: "number",
          id: "age-4",
          name: "age-4",
          value: "36",
          "data-testid": "age-4",
        },
        type: "input",
      },
      Links: {
        attributes: {
          href: "#karen-4",
        },
        type: "link",
      },
    },
  ]
  );
});

test('should get an interactive table', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_interactive.html');

  // Act
  const dataFrame = toDataFrame(htmlString);
  const expected = [
    {
      Person: "Chris",
      Likes: "HTML tables",
      Age: "22",
      Links: "chris-1",
    },
    {
      Person: "Dennis",
      Likes: "Web accessibility",
      Age: "45",
      Links: "dennis-2",
    },
    {
      Person: "Sarah",
      Likes: "JavaScript frameworks",
      Age: "29",
      Links: "sarah-3",
    },
    {
      Person: "Karen",
      Likes: "Web performance",
      Age: "36",
      Links: "karen-4",
    },
  ];
  expect(dataFrame).toEqual(expected);
});

test('should get an interactive table with footer', async () => {
  // Arrange
  const htmlString = await getHTMLFile('table_interactive_footer_locator.html');

  // Act
  const rowLocatorID = '[data-test-id="footer-row"]';
  const dataFrame = toInteractiveDataFrame(htmlString, { footer: true, locatorId: rowLocatorID, header: ['One', 'Two'] });
  const expected = [
    {
      One: {
        attributes: {
          type: 'number',
          value: '22',
        },
        type: 'input',
      },
      Two: {
        attributes: {
          'data-test-id': 'likes-karen',
          id: 'likes-4',
          name: 'likes-4',
        },
        type: 'textarea',
      },
    },
  ];
  expect(dataFrame).toEqual(expected);
});
