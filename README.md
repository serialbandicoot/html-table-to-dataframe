# html-table-to-dataframe

Convert an HTML Table to a DataFrame

![CI Status](https://github.com/serialbandicoot/html-table-to-dataframe/actions/workflows/ci.yml/badge.svg)

## Overview

This project provides utilities to convert HTML tables into structured data formats and pretty-print them as tables. It uses `jsdom` for parsing HTML and `cli-table3` for displaying data in a formatted table.

**Usage:**

| Person | Like                  | Age |
|--------|-----------------------|-----|
| Chris  | HTML tables           |  22 |
| Dennis | Web accessibility     |  45 |
| Sarah  | JavaScript frameworks |  29 |
| Karen  | Web performance       |  36 |

```typescript
import { toDataFrame } from 'html-table-to-dataframe';

const dataFrame = toDataFrame(htmlString, ['Person', 'Likes', 'Age']);

console.log(dataFrame)
// data => [
//  { Person: "Chris", Likes: "HTML tables", Age: "22" },
//];

await toPrettyPrint(data);

```
### In Print Form

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

## Accessible Expectations

- [toHaveTableRowCountGreaterThan](#tohavetablerowcountgreaterthan)
- [toHaveColumnToBeValue](#tohavecolumntobevalue)
- [toHaveColumnValuesToMatchRegex](#tohavecolumnvaluestomatchregex)
- [toHaveColumnValuesToBeInRange](#tohavecolumnvaluestobeeinrange)
- [toHaveColumnValuesToBeNumbers](#tohavecolumnvaluestobenumbers)
- [toHaveColumnToMatchWhenFilteredBy](#tohavecolumntomatchwhenfilteredby)
- [toHaveColumnToMatchGroupWhenFilteredBy](#tohavecolumntomatchgroupwhenfilteredby)
- [toHaveColumnToNotMatch](#tohavecolumntonotmatch)
- [toHaveTableRowCount](#tohavetablerowcount)
- [toHaveColumnGroupToBeValue](#tohavecolumngrouptobevalue)
- [toHaveColumnGroupToBeValues](#tohavecolumngrouptobeevalues)
- [toHaveTableToNotMatch](#tohavetabletonotmatch)
- [toHaveTableToMatch](#tohavetabletomatch)

### toDataFrame

The toDataFrame function converts an HTML string into a data frame structure, which is an array of objects where each object represents a row in the table. This function is essential for transforming raw HTML tables into a format that can be easily manipulated and tested.

### toHaveColumnToBeValue

Checks if a single row in the table has the specified value in a given column.

#### toHaveColumnToBeValue(tableData, 'col_2', '3');

```typescript
const tableData = [
  { col_1: '1', col_2: '3' }
];
```

toHaveColumnToBeValue(tableData, 'col_2', '3'); // Passes, as the value in 'col_2' is '3'

### toHaveTableRowCountGreaterThan

Checks if the table contains more rows than the specified count.

#### toHaveTableRowCountGreaterThan(tableData, 3);

```typescript
const tableData = [
  { one: '1', two: '3' },
  { one: '2', two: '100' }
];
```

toHaveTableRowCountGreaterThan(tableData, 3); // Fails, as row count is 2

### toHaveColumnValuesToMatchRegex

Checks if the values in the specified column match the given regular expression pattern.

#### toHaveColumnValuesToMatchRegex(tableData, "two", "\\d\\d");

```typescript
const tableData = [
  { one: '1', two: '3' },
  { one: '2', two: '100' }
];
```

toHaveColumnValuesToMatchRegex(tableData, "two", "\\d\\d"); // Fails, as {"two":"100"} has 3 digits

### toHaveColumnValuesToBeInRange

Checks if the values in the specified column fall within the given range.

#### toHaveColumnValuesToBeInRange(tableData, "two", 0, 4);

```typescript
const tableData = [
  { one: '1', two: '3' },
  { one: '2', two: '100' }
];
```

toHaveColumnValuesToBeInRange(tableData, "two", 0, 4); // Fails, as {"two":"100"} is greater than 4

### toHaveColumnValuesToBeNumbers

Checks if the values in the specified column are numbers.

#### toHaveColumnValuesToBeNumbers(tableData, "two");

```typescript
const tableData = [
  { one: '1', two: '3' },
  { one: '2', two: '1e' }
];
```

toHaveColumnValuesToBeNumbers(tableData, "two"); // Fails, as {"two":"1e"} is not a number

### toHaveColumnToMatchWhenFilteredBy

Checks if a target column/value pair exists when filtered by a specified column/value.

#### toHaveColumnToMatchWhenFilteredBy(tableData, "col_1", "2", "col_2", "xyz");

```typescript
const tableData = [
  { col_1: '1', col_2: '3' },
  { col_1: '2', col_2: '1e' }
];
```

toHaveColumnToMatchWhenFilteredBy(tableData, "col_1", "2", "col_2", "xyz"); 
// Fails, as {"col_1":"2"} is found, but {"col_2":"xyz"} is not

### toHaveColumnToMatchGroupWhenFilteredBy

Uses an array of `GroupType` to check if a target column/value pair exists when filtered by each specified column/value.

#### toHaveColumnToMatchGroupWhenFilteredBy(tableData, "col_1", "1", group);

```typescript
type GroupType = {
  filterColumn: string;
  filterValue: Nullable<string>;
};

const tableData = [
  { col_1: '1', col_2: 'a', col_3: 'b' }
];

const group: GroupType[] = [
  { filterColumn: "col_2", filterValue: "a" },
  { filterColumn: "col_3", filterValue: "a" }
];
```

toHaveColumnToMatchGroupWhenFilteredBy(tableData, "col_1", "1", group);
// Fails, as {"col_2": "a"} is OK; however, {"col_3": "a"} should be "b"

### toHaveColumnToNotMatch

Confirms that a specified column no longer contains a certain value. This is useful for checking if a row has been deleted or archived.

#### toHaveColumnToNotMatch(tableData, "col_1", "2");

```typescript
const tableData = [
  { col_1: '1', col_2: '3' },
  { col_1: '2', col_2: '1e' }
];
```

toHaveColumnToNotMatch(tableData, "col_1", "2");
// Fails, as {"col_1":"2"} is found and should not be.

### toHaveTableRowCount

Matches the row count of the table data against the expected value.

#### toHaveTableRowCount(tableData, 3);

```typescript
const tableData = [
  { col_1: '1', col_2: '3' },
  { col_1: '2', col_2: '1e' }
];
```

toHaveTableRowCount(tableData, 3);
// Fails, as row count should be 2.

### toHaveColumnToBeValue

Expects only 1 table row and checks if the column value matches the provided value.

#### toHaveColumnToBeValue(tableData, "col_2", "3");

```typescript
const tableData = [
  { col_1: '1', col_2: '3' }
];
```

toHaveColumnToBeValue(tableData, "col_2", "3");
// Passes, as the column value is "3".

### toHaveColumnGroupToBeValue

Expects only 1 table row and checks if the column values in a group match the provided values. Exceptions are made when the filter value is null or undefined.

#### toHaveColumnGroupToBeValue(tableData, [{ filterColumn: "col_2", filterValue: "3" }]);

```typescript
const tableData = [
  { col_1: '1', col_2: '3' }
];

const filterGroup = [
  { filterColumn: "col_2", filterValue: "3" }
];
```

toHaveColumnGroupToBeValue(tableData, filterGroup);
// Passes, as the column value for "col_2" is "3".

### toHaveColumnGroupToBeValues

Performs multiple grouped checks using `toHaveColumnGroupToBeValue` for each row. The `tableData` must be the same length as the `filterGroups`, and each entry in `filterGroups` is applied to the corresponding row in `tableData`.

#### toHaveColumnGroupToBeValues(tableData, filterGroups);

```typescript
const tableData = [
  { col_1: '1', col_2: '3' },
  { col_1: '2', col_2: '4' }
];

const filterGroups = [
  [{ filterColumn: "col_2", filterValue: "3" }],
  [{ filterColumn: "col_2", filterValue: "4" }]
];
```
toHaveColumnGroupToBeValues(tableData, filterGroups);
// Passes, as the column values match the expected values for each row.

### toHaveTableToNotMatch

Converts two tables into strings and compares them for equality. This assertion checks that the two tables do not match exactly.

#### toHaveTableToNotMatch(tableData1, tableData2);

```typescript
const tableData1 = [
  { col_1: '1', col_2: '3' }
];

const tableData2 = [
  { col_1: '1', col_2: '3' }
];
```

toHaveTableToNotMatch(tableData1, tableData2);
// Fails, as the two tables are identical

### toHaveTableToMatch

Converts two tables into strings and compares them for equality. This assertion checks that the two tables match exactly.

#### toHaveTableToMatch(tableData1, tableData2);

```typescript
const tableData1 = [
  { col_1: '1', col_2: '3' }
];

const tableData2 = [
  { col_1: '1', col_2: '4' }
];
```
toHaveTableToMatch(tableData1, tableData2);
// Fails, as the two tables are different