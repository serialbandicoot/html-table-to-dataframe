import { Nullable } from './types';

/**
 *  expectTableRowCountToBeGreaterThan expects a tableData as processed by convertHTMLTable.
 * the expectation will check the total row count of the table to be greater than.
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 100 |
 *
 * expectTableRowCountToBeGreaterThan(dt, 3) this will fail as row count is 2
 */

export const expectTableRowCountToBeGreaterThan = (
  tableData: { [key: string]: string }[] | null,
  expectedLength: number,
) => {
  if (tableData === null || tableData.length <= expectedLength) {
    throw new Error(`Expected row count to be greater than ${expectedLength}
      , but it was ${tableData?.length ?? 0}`);
  }
};

/**
 * expectColumnValuesToMatchRegex expects a tableData as processed by convertHTMLTable.
 * The expectation will match the column provided with a regular expression pattern.
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 100 |
 *
 * expectColumnValuesToMatchRegex(dt, "two", "\\d\\d") this will fail as {"two":"100"} has 3 digits
 *
 * "Write Once, Never Read" - Use sparingly, add expectations where RegExs can be replaced.
 */

export const expectColumnValuesToMatchRegex = (
  tableData: { [key: string]: string }[] | null,
  columnHeader: string,
  regexPattern: string,
) => {
  // Create a regular expression object from the regexPattern string
  const regex = new RegExp(regexPattern);

  for (const row of tableData ?? []) {
    const actualValue = row[columnHeader];
    if (!regex.test(actualValue)) {
      throw new Error(
        `Column header "${columnHeader}" with value "${actualValue}"
           does not match the pattern "${regexPattern}"`,
      );
    }
  }
};

/**
 * expectTableRowCountToBeGreaterThan expects a tableData as processes by convertHTMLTable.
 * The expectation will match the column provided with an range.
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 100 |
 *
 * expectColumnValuesToBeInRange(dt, "two", 0, 4) this will fail as {"two":"100"} is greater than 4
 */

export const expectColumnValuesToBeInRange = (
  tableData: { [key: string]: string }[] | null,
  columnHeader: string,
  minValue: number,
  maxValue: number,
) => {
  for (const row of tableData ?? []) {
    const actualValue = parseFloat(row[columnHeader]); // Convert the value to a number
    if (isNaN(actualValue) || actualValue < minValue || actualValue > maxValue) {
      throw new Error(
        `Column header "${columnHeader}" with value "${row[columnHeader]}"
           is not within the range [${minValue}, ${maxValue}]`,
      );
    }
  }
};

/**
 * expectColumnValuesToBeNumbers expects a tableData as processed by convertHTMLTable.
 * The expectation will check the column values are numbers
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 1e  |
 *
 * expectColumnValuesToBeNumbers(dt, "two") this will fail as {"two":"1e"} is not a number
 */

export const expectColumnValuesToBeNumbers = (tableData: { [key: string]: string }[] | null, columnHeader: string) => {
  for (const row of tableData ?? []) {
    const parsedValue = parseInt(row[columnHeader], 10);

    // Check conversion, check type and check against
    // original, for example 1e will be converted to 1.
    if (!isNaN(parsedValue) && typeof parsedValue === 'number' && parsedValue.toString() !== row[columnHeader]) {
      throw new Error(`Column header "${columnHeader}" with value "${row[columnHeader]}" is not a number`);
    }
  }
};

/**
 * expectColumnToMatchWhenFilteredBy: Expects a tableData generated by convertHTMLTable().
 * This expectation is attempting to match against a column/key pairing whilst a filter
 * has been applied. There is also no validation on checking the correct columns names.
 *
 * @example
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 * | 2     | 1e    |
 *
 * expectColumnToMatchIf(dt, "col_1", "2", "col_2", "xyz");
 *
 * This will Fail as {"col_1":"2"} is located however {"col_2":"xyz"} is not found.
 */

export const expectColumnToMatchWhenFilteredBy = (
  tableData: { [key: string]: string }[] | null,
  targetColumn: string,
  targetValue: Nullable<string>,
  filterColumn: string,
  filterValue: Nullable<string>,
) => {
  if (!targetValue) {
    throw new Error('Target value cannot be undefined!');
  }

  if (!filterValue) {
    throw new Error('Expect cannot be undefined!');
  }

  if (!tableData) {
    throw new Error('DataTable cannot be undefined!');
  }

  const targetCheck = tableData.filter((item) => item[filterColumn] === filterValue);
  if (targetCheck.length === 0) {
    throw new Error(
      `Column header "${filterColumn}" with value "${filterValue}" was not found! For ${JSON.stringify(
        tableData,
      ).toString()}`,
    );
  }

  const filteredTarget = targetCheck.filter((item) => item[targetColumn] === targetValue);
  if (filteredTarget.length === 0) {
    const mappedItems = tableData.map((i) => i[targetColumn]).join(', ');
    throw new Error(`Column header "${targetColumn}" with value "${targetValue}" does not match items (${mappedItems})!"`);
  }
};

/**
 * GroupType for usage with:
 *  - expectColumnToMatchGroupWhenFilteredBy
 */

export type GroupType = {
  filterColumn: string;
  filterValue: Nullable<string>;
};

/**
 * expectColumnToMatchGroupWhenFilteredBy uses an array of types GroupType
 * to cycle through and pass the items to expectColumnToMatchWhenFilteredBy.
 *
 * @example
 *
 * | col_1 | col_2 | col_3 |
 * | ------| ----- | ----- |
 * | 1     | a     | b     |
 *
 * const group: GroupType[] = [
 *     { filterColumn: "col_2", filterValue: "a" },
 *     { filterColumn: "col_3", filterValue: "a" },
 * ];
 *
 * expectColumnToMatchGroupWhenFilteredBy(dt, "col_1", "1", group)
 *
 * This will fail as {"col_2": "a"} is OK however {"col_3": "a"} should be "b"
 */

export const expectColumnToMatchGroupWhenFilteredBy = (
  tableData: { [key: string]: string }[] | null,
  targetColumn: string,
  targetValue: Nullable<string>,
  filterGroup: GroupType[],
) => {
  filterGroup.forEach((item) => {
    if (!item.filterValue) {
      throw new Error('Value cannot be undefined!');
    }

    expectColumnToMatchWhenFilteredBy(tableData, targetColumn, targetValue, item.filterColumn, item.filterValue);
  });
};

/**
 * expectColumnToNotMatch: Expects a tableData generated by convertHTMLTable().
 * This expectation confirms that a column no longer contains a match. This
 * expectation is designed around checking a row is no longer available. Such
 * as when a record has been deleted or archived.
 *
 * @example
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 * | 2     | 1e    |
 *
 * expectColumnToNotMatch(dt, "col_1", "2");
 *
 * This will Fail as {"col_1":"2"} is found and should not be.
 */

export const expectColumnToNotMatch = (
  tableData: { [key: string]: string }[] | null,
  targetColumn: string,
  targetValue: string | undefined,
) => {
  if (!tableData) {
    throw new Error('DataTable cannot be undefined!');
  }

  if (!targetValue) {
    throw new Error('Target value cannot be undefined!');
  }

  const targetCheck = tableData.find((item) => item[targetColumn] === targetValue);
  if (targetCheck !== undefined) {
    throw new Error(`Column header "${targetColumn}" with value "${targetValue}" should not be found!"`);
  }
};

/**
 * expectTableRowCountToBe: Expects a tableData as processed by convertHTMLTable().
 * The expectation will match the row count.
 *
 * @example
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 * | 2     | 1e    |
 *
 * expectTableRowCountToBe(dt, 3);
 *
 * This will fail as row count should be 2
 */

export const expectTableRowCountToBe = (tableData: { [key: string]: string }[] | null, expectedLength: number) => {
  if (tableData === null || tableData.length !== expectedLength) {
    throw new Error(`Expected row count to be ${expectedLength}
      , but it was ${tableData?.length ?? 0}`);
  }
};

/**
 * expectColumnToBeValue expects only 1 table row and
 * the column value should match the provided value.
 *
 * @example
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 *
 * expectColumnToBeValue(dt, col_2, 2);
 *
 * This will fail as the column value should be 3.
 */

export const expectColumnToBeValue = (tableData: { [key: string]: string }[] | null, column: string, value: string) => {
  if (tableData === null || tableData.length !== 1) {
    throw new Error(`Expected row count tbe 1`);
  }
  const firstRow = tableData[0];
  expect(firstRow[column]).toBe(value);
};

/**
 * expectColumnGroupToBeValue expects only 1 table row and
 * the column value in a group should match the provided.
 * Exceptions are made when the filterValue is null/undefined.
 *
 * @example
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 *
 * expectColumnToBeValue(dt, col_2, 2);
 *
 * This will fail as the column value should be 3.
 */

export const expectColumnGroupToBeValue = (tableData: { [key: string]: string }[] | null, filterGroup: GroupType[]) => {
  if (tableData === null || tableData.length !== 1) {
    throw new Error(`Expected row count to be 1`);
  }
  filterGroup.forEach((item) => {
    if (item.filterValue === undefined || item.filterValue === null) {
      throw new Error(`Value of ${item.filterValue ?? ''} for ${item.filterColumn} cannot be null or undefined`);
    }
    expectColumnToBeValue(tableData, item.filterColumn, item.filterValue);
  });
};

/**
 * expectColumnGroupToBeValues is the multiple grouped check,
 * using expectColumnGroupToBeValue for each row. Table Data
 * is the same and filterGroups is an array of groups. FilterGroups
 * and the TableData must be the same length.
 *
 * @example
 * See expectColumnGroupToBeValue
 */

export const expectColumnGroupToBeValues = (tableData: { [key: string]: string }[] | null, filterGroups: GroupType[][]) => {
  if (tableData === null || tableData.length === 0 || tableData.length !== filterGroups.length) {
    throw new Error('Table data and filterGroups must be equal and not empty');
  }
  filterGroups.forEach((filterGroup, index) => {
    expectColumnGroupToBeValue([tableData[index]], [filterGroup[index]]);
  });
};

/**
 * expectTableToNotMatch will convert the tables key/values
 * into a string and compares the two for equality.
 *
 * @param tableData1
 * @param tableData2
 *
 * @example
 *
 * table1: | col_1 | col_2 | table2: | col_1 | col_2 |
 *         | ------| ----- |         | ------| ----- |
 *         | 1     | 3     |         | 1     | 3     |
 *
 * expectTableToNotMatch(table1, table2);
 *
 * This will fail as the two tables are the same
 */
export const expectTableToNotMatch = (
  tableData1: { [key: string]: string }[] | null,
  tableData2: { [key: string]: string }[] | null,
) => {
  if (!tableData1 || !tableData2) {
    throw new Error('Table data cannot be null');
  }

  if (tableData1.length !== tableData2.length) {
    throw new Error(`Tables are not valid Table1/Size: ${tableData1.length} Vs Table2/Size: ${tableData2.length}`);
  }

  if (tableData1.length === 0 || tableData2.length === 0) {
    throw new Error(`Rows cannot be empty`);
  }

  const tableAsString = (table: { [key: string]: string }[]) => {
    return table
      .map((obj) =>
        Object.entries(obj)
          .map(([key, value]) => `${key}: ${value}`)
          .join(''),
      )
      .join('');
  };

  expect(tableAsString(tableData1)).not.toEqual(tableAsString(tableData2));
};

/**
 * expectTableToMatch will convert the tables key/values
 * into a string and compares the two for equality.
 *
 * @param tableData1
 * @param tableData2
 *
 * @example
 *
 * table1: | col_1 | col_2 | table2: | col_1 | col_2 |
 *         | ------| ----- |         | ------| ----- |
 *         | 1     | 3     |         | 1     | 4     |
 *
 * expectTableToMatch(table1, table2);
 *
 * This will fail as the two tables are different
 */
export const expectTableToMatch = (
  tableData1: { [key: string]: string }[] | null,
  tableData2: { [key: string]: string }[] | null,
) => {
  if (!tableData1 || !tableData2) {
    throw new Error('Table data cannot be null');
  }

  if (tableData1.length !== tableData2.length) {
    throw new Error(`Tables are not valid Table1/Size: ${tableData1.length} Vs Table2/Size: ${tableData2.length}`);
  }

  if (tableData1.length === 0 || tableData2.length === 0) {
    throw new Error(`Rows cannot be empty`);
  }

  const tableAsString = (table: { [key: string]: string }[]) => {
    return table
      .map((obj) =>
        Object.entries(obj)
          .map(([key, value]) => `${key}: ${value}`)
          .join(''),
      )
      .join('');
  };

  expect(tableAsString(tableData1)).toEqual(tableAsString(tableData2));
};
