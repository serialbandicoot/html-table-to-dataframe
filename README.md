# html-table-to-dataframe

Convert an HTML Table to a DataFrame

![CI Status](https://github.com/serialbandicoot/html-table-to-dataframe/actions/workflows/ci.yml/badge.svg)

## Overview

This project provides utilities to convert HTML tables into structured data formats and pretty-print them as tables. It uses `jsdom` for parsing HTML and `cli-table3` for displaying data in a formatted table.

## Functions

### `toTable`

Converts an array of objects into a formatted table using `cli-table3`.

**Parameters:**

- `table: { [key: string]: string }[] | null`: An array of objects where each object has string keys and string values, or `null` if no data is available.

**Usage:**

```typescript
import { toTable } from 'html-table-to-dataframe';

const data = [
  { Person: "Chris", Likes: "HTML tables", Age: "22" },
  { Person: "Dennis", Likes: "Web accessibility", Age: "45" },
  { Person: "Sarah", Likes: "JavaScript frameworks", Age: "29" },
  { Person: "Karen", Likes: "Web performance", Age: "36" },
];

await toTable(data);
```
### In Print

```typescript
┌─────────┬──────────────────────┬─────┐
│ Person  │ Likes                │ Age │
├─────────┼──────────────────────┼─────┤
│ Chris   │ HTML tables          │ 22  │
│ Dennis  │ Web accessibility    │ 45  │
│ Sarah   │ JavaScript frameworks│ 29  │
│ Karen   │ Web performance      │ 36  │
└─────────┴──────────────────────┴─────┘
```

### `toDataFrame`

Converts an HTML table into an array of objects where each object represents a row of the table.

**Parameters:**

- `html: string`: The HTML string representing the table.
- `headers: string[]`: An array of strings representing the column headers. The order of headers determines the keys in the resulting objects.

**Returns:**

- `Promise<{ [key: string]: string }[] | null>`: A promise that resolves to an array of objects. Each object contains key-value pairs where the keys are column headers and the values are the corresponding cell contents. If the HTML is invalid or no data is found, it resolves to `null`.

**Usage:**

```typescript
import { toDataFrame } from 'html-table-to-dataframe';
import { promises as fs } from 'fs';
import { join } from 'path';

const headers: string[] = ["Person", "Likes", "Age"];
const filePath = join(__dirname, 'data', 'table1.html');
const htmlString = await fs.readFile(filePath, 'utf-8');

const dataFrame = await toDataFrame(htmlString, headers);

console.log(dataFrame);

