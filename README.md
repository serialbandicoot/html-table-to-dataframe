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