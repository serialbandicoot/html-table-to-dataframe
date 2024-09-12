import { TableData } from './types';

/**
 * toHaveTableRowCountGreaterThan expects a tableData as processed by toDataFrame.
 * The assertion checks that the total row count of the table is greater than the expected value.
 *
 * @Example:
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 100 |
 *
 * toHaveTableRowCountGreaterThan(dt, 3) will fail because the row count is 2.
 */
export const toHaveTableRowCountGreaterThan = (tableData: TableData, expectedLength: number) => {
  if (tableData.length <= expectedLength) {
    throw new Error(`Expected row count to be greater than ${expectedLength}, but it was ${tableData.length}.`);
  }
};

/**
 * toHaveTableRowCountLessThan expects a tableData as processed by toDataFrame.
 * The assertion checks that the total row count of the table is less than than the expected value.
 *
 * Example:
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 100 |
 *
 * toHaveTableRowCountLessThan(dt, 1) will fail because the row count is 2.
 */
export const toHaveTableRowCountLessThan = (tableData: TableData, expectedLength: number) => {
  if (tableData.length >= expectedLength) {
    throw new Error(`Expected row count to be less than ${expectedLength}, but it was ${tableData.length}.`);
  }
};
/**
 * toHaveTableRowCountEqualTo expects a tableData as processed by convertHTMLTable.
 * The assertion checks that the total row count of the table equal to the the expected value.
 *
 * Example:
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 100 |
 *
 * toHaveTableRowCountEqualTo(dt, 3) will fail because the row count is 2.
 */
export const toHaveTableRowCountEqualTo = (tableData: TableData, expectedLength: number) => {
  if (tableData.length !== expectedLength) {
    throw new Error(`Expected row count should ${expectedLength}, but it was ${tableData.length}.`);
  }
};

/**
 * toHaveColumnValuesToMatchRegex expects tableData as processed by convertHTMLTable.
 * The assertion will check that the values in the specified column match the given regular expression pattern.
 *
 * Example:
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 100 |
 *
 * toHaveColumnValuesToMatchRegex(dt, "two", "\\d\\d") will fail because {"two":"100"} has 3 digits.
 *
 * "Write Once, Never Read" - Use sparingly, add expectations where RegExs can be replaced.
 */
export const toHaveColumnValuesToMatchRegex = (tableData: TableData, columnHeader: string, regexPattern: string) => {
  // Create a regular expression object from the regexPattern string
  const regex = new RegExp(regexPattern);

  for (const row of tableData) {
    const actualValue = row[columnHeader];
    if (!regex.test(actualValue)) {
      throw new Error(
        `Column header "${columnHeader}" with value "${actualValue}" does not match the pattern "${regexPattern}".`,
      );
    }
  }
};

/**
 * toHaveColumnValuesToBeInRange expects tableData as processed by convertHTMLTable.
 * The assertion checks that the values in the specified column fall within the given range.
 *
 * Example:
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 100 |
 *
 * toHaveColumnValuesToBeInRange(dt, "two", 0, 4) will fail because {"two":"100"} is greater than 4.
 */
export const toHaveColumnValuesToBeInRange = (
  tableData: TableData,
  columnHeader: string,
  minValue: number,
  maxValue: number,
) => {
  for (const row of tableData) {
    const actualValue = parseFloat(row[columnHeader]); // Convert the value to a number
    if (isNaN(actualValue) || actualValue < minValue || actualValue > maxValue) {
      throw new Error(
        `Column header "${columnHeader}" with value "${row[columnHeader]}" is not within the range [${minValue}, ${maxValue}].`,
      );
    }
  }
};

/**
 * toHaveColumnValuesToBeNumbers expects tableData as processed by convertHTMLTable.
 * The assertion will check that the values in the specified column are numbers.
 *
 * Example:
 *
 * | one | two |
 * | 1   | 3   |
 * | 2   | 1e  |
 *
 * toHaveColumnValuesToBeNumbers(dt, "two") will fail because {"two":"1e"} is not a number.
 */
export const toHaveColumnValuesToBeNumbers = (tableData: TableData, columnHeader: string) => {
  for (const row of tableData) {
    const parsedValue = parseFloat(row[columnHeader]);

    // Check conversion, check type and check against
    // original, for example 1e will be converted to 1.
    if (isNaN(parsedValue) || parsedValue.toString() !== row[columnHeader]) {
      throw new Error(`Column header "${columnHeader}" with value "${row[columnHeader]}" is not a number.`);
    }
  }
};

/**
 * toHaveColumnToMatchWhenFilteredBy expects tableData as processed by convertHTMLTable().
 * This assertion checks whether a target column/value pair exists when filtered by a specified column/value.
 * It also does not validate the correctness of column names.
 *
 * Example:
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 * | 2     | 1e    |
 *
 * toHaveColumnToMatchWhenFilteredBy(dt, "col_1", "2", "col_2", "xyz");
 *
 * This will fail as {"col_1":"2"} is located; however, {"col_2":"xyz"} is not found.
 */
export const toHaveColumnToMatchWhenFilteredBy = (
  tableData: TableData,
  targetColumn: string,
  targetValue: string,
  filterColumn: string,
  filterValue: string,
) => {
  if (targetValue === undefined || targetValue === null) {
    throw new Error('Target value cannot be null or undefined!');
  }

  if (filterValue === undefined || filterValue === null) {
    throw new Error('Filter value cannot be null or undefined!');
  }

  if (!tableData) {
    throw new Error('Table data cannot be null or undefined!');
  }

  const targetCheck = tableData.filter((item) => item[filterColumn] === filterValue);
  if (targetCheck.length === 0) {
    throw new Error(
      `Column header "${filterColumn}" with value "${filterValue}" was not found! For ${JSON.stringify(tableData)}.`,
    );
  }

  const filteredTarget = targetCheck.filter((item) => item[targetColumn] === targetValue);
  if (filteredTarget.length === 0) {
    const mappedItems = tableData.map((i) => i[targetColumn]).join(', ');
    throw new Error(
      `Column header "${targetColumn}" with value "${targetValue}" does not match any items (${mappedItems}).`,
    );
  }
};

/**
 * GroupType for usage with:
 *  - toHaveColumnToMatchGroupWhenFilteredBy
 */
export type GroupType = {
  filterColumn: string;
  filterValue: string;
};

/**
 * toHaveColumnToMatchGroupWhenFilteredBy uses an array of types GroupType
 * to cycle through and pass the items to toHaveColumnToMatchWhenFilteredBy.
 *
 * Example:
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
 * toHaveColumnToMatchGroupWhenFilteredBy(dt, "col_1", "1", group);
 *
 * This will fail as {"col_2": "a"} is OK; however, {"col_3": "a"} should be "b".
 */
export const toHaveColumnToMatchGroupWhenFilteredBy = (
  tableData: TableData,
  targetColumn: string,
  targetValue: string,
  filterGroup: GroupType[],
) => {
  filterGroup.forEach((item) => {
    if (item.filterValue === undefined || item.filterValue === null) {
      throw new Error('Filter value cannot be null or undefined!');
    }

    toHaveColumnToMatchWhenFilteredBy(tableData, targetColumn, targetValue, item.filterColumn, item.filterValue);
  });
};

/**
 * toHaveColumnToNotMatch expects a tableData generated by convertHTMLTable().
 * This expectation confirms that a column no longer contains a match. This
 * expectation is designed around checking a row is no longer available. Such
 * as when a record has been deleted or archived.
 *
 * Example:
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 * | 2     | 1e    |
 *
 * toHaveColumnToNotMatch(dt, "col_1", "2");
 *
 * This will fail as {"col_1":"2"} is found and should not be.
 */
export const toHaveColumnToNotMatch = (tableData: TableData, targetColumn: string, targetValue: string) => {
  if (!tableData) {
    throw new Error('DataTable cannot be undefined!');
  }

  if (!targetValue) {
    throw new Error('Target Value cannot be undefined!');
  }

  const targetCheck = tableData.find((item) => item[targetColumn] === targetValue);
  if (targetCheck !== undefined) {
    throw new Error(`Column header "${targetColumn}" with value "${targetValue}" should not be found!`);
  }
};

/**
 * toHaveTableRowCount expects a tableData as processed by convertHTMLTable().
 * The expectation will match the row count.
 *
 * @Example:
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 * | 2     | 1e    |
 *
 * toHaveTableRowCount(dt, 3);
 *
 * This will fail as row count should be 2.
 */
export const toHaveTableRowCount = (tableData: TableData, expectedLength: number) => {
  if (tableData === null || tableData.length !== expectedLength) {
    throw new Error(`Expected row count to be ${expectedLength}, but it was ${tableData?.length ?? 0}`);
  }
};

/**
 * toHaveColumnToBeValue expects only 1 table row and
 * the column value should match the provided value.
 *
 * Example:
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 *
 * toHaveColumnToBeValue(dt, "col_2", "3");
 *
 * This will fail as the column value should be 3.
 */
export const toHaveColumnToBeValue = (tableData: TableData, column: string, value: string) => {
  if (tableData === null || tableData.length !== 1) {
    throw new Error(`Expected row count to be 1`);
  }
  const firstRow = tableData[0];
  if (firstRow[column] !== value) {
    throw new Error(`Expected column "${column}" to have value "${value}", but it was "${firstRow[column]}"`);
  }
};

/**
 * toHaveColumnGroupToBeValue expects only 1 table row and
 * the column value in a group should match the provided.
 * Exceptions are made when the filterValue is null/undefined.
 *
 * Example:
 * | col_1 | col_2 |
 * | ------| ----- |
 * | 1     | 3     |
 *
 * toHaveColumnGroupToBeValue(dt, [{ filterColumn: "col_2", filterValue: "3" }]);
 *
 * This will fail as the column value should be 3.
 */
export const toHaveColumnGroupToBeValue = (tableData: TableData, filterGroup: GroupType[]) => {
  if (tableData === null || tableData.length !== 1) {
    throw new Error(`Expected row count to be 1`);
  }
  filterGroup.forEach((item) => {
    if (item.filterValue === undefined || item.filterValue === null) {
      throw new Error(`Value of ${item.filterValue ?? ''} for ${item.filterColumn} cannot be null or undefined`);
    }
    toHaveColumnToBeValue(tableData, item.filterColumn, item.filterValue);
  });
};

/**
 * toHaveColumnGroupToBeValues is the multiple grouped check,
 * using toHaveColumnGroupToBeValue for each row. Table Data
 * is the same and filterGroups is an array of groups. FilterGroups
 * and the TableData must be the same length.
 *
 * Example:
 * See toHaveColumnGroupToBeValue
 */
export const toHaveColumnGroupToBeValues = (tableData: TableData, filterGroups: GroupType[][]) => {
  if (tableData === null || tableData.length === 0 || tableData.length !== filterGroups.length) {
    throw new Error('Table data and filterGroups must be equal and not empty');
  }
  filterGroups.forEach((filterGroup, index) => {
    toHaveColumnGroupToBeValue([tableData[index]], filterGroup);
  });
};

/**
 * toHaveTableToNotMatch will convert the tables key/values
 * into a string and compares the two for equality.
 *
 * @param tableData1
 * @param tableData2
 *
 * Example:
 *
 * table1: | col_1 | col_2 | table2: | col_1 | col_2 |
 *         | ------| ----- |         | ------| ----- |
 *         | 1     | 3     |         | 1     | 3     |
 *
 * toHaveTableToNotMatch(table1, table2);
 *
 * This will fail as the two tables are the same
 */
export const toHaveTableToNotMatch = (tableData1: TableData, tableData2: TableData) => {
  if (!tableData1 || !tableData2) {
    throw new Error('Table data cannot be null');
  }

  if (tableData1.length !== tableData2.length) {
    throw new Error(`Tables are not valid Table1/Size: ${tableData1.length} Vs Table2/Size: ${tableData2.length}`);
  }

  if (tableData1.length === 0 || tableData2.length === 0) {
    throw new Error('Rows cannot be empty');
  }

  const tableAsString = (table: TableData) => {
    return table
      .map((obj) =>
        Object.entries(obj)
          .map(([key, value]) => `${key}: ${value}`)
          .join(''),
      )
      .join('');
  };

  const stringTable1 = tableAsString(tableData1);
  const stringTable2 = tableAsString(tableData2);

  if (stringTable1 === stringTable2) {
    throw new Error('Tables are identical');
  }
};

/**
 * toHaveTableToMatch will convert the tables key/values
 * into a string and compares the two for equality.
 *
 * @param tableData1
 * @param tableData2
 *
 * Example:
 *
 * table1: | col_1 | col_2 | table2: | col_1 | col_2 |
 *         | ------| ----- |         | ------| ----- |
 *         | 1     | 3     |         | 1     | 4     |
 *
 * toHaveTableToMatch(table1, table2);
 *
 * This will fail as the two tables are different
 */
export const toHaveTableToMatch = (tableData1: TableData, tableData2: TableData) => {
  if (!tableData1 || !tableData2) {
    throw new Error('Table data cannot be null');
  }

  if (tableData1.length !== tableData2.length) {
    throw new Error(`Tables are not valid Table1/Size: ${tableData1.length} Vs Table2/Size: ${tableData2.length}`);
  }

  if (tableData1.length === 0 || tableData2.length === 0) {
    throw new Error('Rows cannot be empty');
  }

  const tableAsString = (table: TableData) => {
    return table
      .map((obj) =>
        Object.entries(obj)
          .map(([key, value]) => `${key}: ${value}`)
          .join(''),
      )
      .join('');
  };

  const stringTable1 = tableAsString(tableData1);
  const stringTable2 = tableAsString(tableData2);

  if (stringTable1 !== stringTable2) {
    throw new Error('Tables are different');
  }
};
