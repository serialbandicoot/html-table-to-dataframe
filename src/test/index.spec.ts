import { toDataFrame } from '../index'
import { promises as fs } from 'fs';
import { join } from 'path';

test('should validate simple table', async () => {
  const headers: string[] = ["Person", "Likes", "Age"]
  const filePath = join(__dirname, 'data', 'table1.html');
  const htmlString = await fs.readFile(filePath, 'utf-8');
  const dataFrame = await toDataFrame(htmlString, headers);

  const data = [
    { Person: "Chris", Likes: "HTML tables", Age: "22" },
    { Person: "Dennis", Likes: "Web accessibility", Age: "45" },
    { Person: "Sarah", Likes: "JavaScript frameworks", Age: "29" },
    { Person: "Karen", Likes: "Web performance", Age: "36" },
  ];

  expect(dataFrame).toEqual(data);
});
