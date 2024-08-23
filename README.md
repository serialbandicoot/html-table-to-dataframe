# html-table-to-dataframe

Convert an HTML Table to a DataFrame

![CI Status](https://github.com/serialbandicoot/html-table-to-dataframe/actions/workflows/ci.yml/badge.svg)

## Overview

This project provides utilities to convert HTML tables into structured data formats and pretty-print them as tables. It uses `jsdom` for parsing HTML and `cli-table3` for displaying data in a formatted table.

**Usage:**

```html
<table><thead><tr><th scope="col">Person</th><th scope="col">Like</th><th scope="col">Age</th></tr></thead><tbody><tr><th scope="row">Chris</th><td>HTML tables</td><td>22</td></tr></tbody></table>
```

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

- [expectTableRowCountToBeGreaterThan](#expecttablerowcounttobegreaterthan)
- [expectColumnToBeValue](#expectcolumntobevalue)
- [expectColumnValuesToMatchRegex](#expectcolumnvaluestomatchregex)
- [expectColumnValuesToBeInRange](#expectcolumnvaluestobeinrange)
- [expectColumnValuesToBeNumbers](#expectcolumnvaluestobenumbers)
- [expectColumnToMatchWhenFilteredBy](#expectcolumntomatchwhenfilteredby)
- [expectColumnToMatchGroupWhenFilteredBy](#expectcolumntomatchgroupwhenfilteredby)
- [expectColumnToNotMatch](#expectcolumntonotmatch)
- [expectTableRowCountToBe](#expecttablerowcounttobe)
- [expectColumnGroupToBeValue](#expectcolumngrouptobevalue)
- [expectColumnGroupToBeValues](#expectcolumngrouptobevalues)
- [expectTableToNotMatch](#expecttabletodotmatch)
- [expectTableToMatch](#expecttabletomatch)

### toDataFrame

The toDataFrame function converts an HTML string into a data frame structure, which is an array of objects where each object represents a row in the table. This function is essential for transforming raw HTML tables into a format that can be easily manipulated and tested.

### expectTableRowCountToBeGreaterThan

This expectation checks that the number of rows in the data frame exceeds a specified number. It is useful for ensuring that a table has enough data before proceeding with more detailed checks.

### expectColumnToBeValue

The expectColumnToBeValue function verifies that a specific column contains a specific value across all rows. This can be used to confirm that a particular field in the table has been populated with the correct information.

### expectColumnValuesToMatchRegex

This function checks that all values in a specified column match a given regular expression pattern. It’s useful for validating formats, such as ensuring that a “Date” column contains values in a “YYYY-MM-DD” format.

### expectColumnValuesToBeInRange

expectColumnValuesToBeInRange ensures that the values in a specified column fall within a given numerical range. This is often used for validating that numeric data such as “Age” or “Score” lies within an expected range.

### expectColumnValuesToBeNumbers

The expectColumnValuesToBeNumbers function checks that all values in a specified column are numbers. This is important for ensuring that data types are consistent and correct.

### expectColumnToMatchWhenFilteredBy

This function verifies that a value in one column matches a specified value when filtered by another column. It is useful for validating data integrity across related fields.

### expectColumnToMatchGroupWhenFilteredBy

expectColumnToMatchGroupWhenFilteredBy is used to check that a column’s value matches a specific value when filtered by a group of conditions. This is helpful for complex validations involving multiple criteria.

### expectColumnToNotMatch

The expectColumnToNotMatch function ensures that a specified column does not contain a certain value. This can be used to confirm that certain invalid or unexpected values are not present in the data.

### expectTableRowCountToBe

This expectation checks that the number of rows in the data frame is exactly as expected. It is a straightforward check to validate that the table has the correct number of entries.

### expectColumnGroupToBeValue

expectColumnGroupToBeValue verifies that a group of columns matches a set of expected values. This is useful for ensuring that related data fields are populated with the correct data.

### expectColumnGroupToBeValues

This function checks that multiple groups of columns each match their respective expected values. It is used for 

