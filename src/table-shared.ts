import { RowData } from './types';

/**
 * Generates an array of header names from the table's thead section.
 * If a header element's text content is empty, it will be replaced with a unique identifier
 * in the format 'unknownX', where X is the number of missing headers encountered so far.
 *
 * @param {Document} document - The document object where the table resides.
 * @returns {string[]} - An array of header names, with empty headers replaced by 'unknownX'.
 */
export function generateHeaders(document: Document): string[] {
  const headerElements = Array.from(document.querySelectorAll('table thead th'));
  let unknownCount = 0;

  return headerElements.map((th) => {
    const text = th.textContent?.trim();
    if (text && text !== '') {
      return text;
    } else {
      return `Unknown${unknownCount++}`;
    }
  });
}

/**
 * Validates the provided headers against the number of columns in the table.
 * Throws an error if the lengths do not match.
 *
 * @param headers - The headers provided by the user.
 * @param document - The HTML document containing the table.
 */

export function validateHeaders(headers: string[], document: Document): void {
  const columnCount = document.querySelectorAll('table thead th').length;
  if (headers.length !== columnCount) {
    throw new Error(
      `The number of provided headers (${headers.length}) does not match the number of columns in the table (${columnCount}).`,
    );
  }
}

/**
 * Transforms a 2D array of data rows into an array of objects, where each object
 * represents a row with keys corresponding to the provided headers.
 *
 * @param rows - A 2D array where each sub-array represents a row of data.
 * @param headers - An array of strings where each string represents a column header.
 * @returns An array of objects where each object represents a row, with keys derived from the headers
 *          and values from the rows.
 *
 * @example
 * const headers = ["Name", "Age", "Occupation"];
 * const rows = [
 *   ["Alice", 30, "Engineer"],
 *   ["Bob", 25, "Designer"]
 * ];
 *
 * const result = buildData(rows, headers);
 * // result will be:
 * // [
 * //   { Name: "Alice", Age: 30, Occupation: "Engineer" },
 * //   { Name: "Bob", Age: 25, Occupation: "Designer" }
 * // ]
 */
export function buildData<T>(rows: T[][], headers: string[]): RowData<T>[] {
  // Build the array of data
  const tableData: RowData<T>[] = rows.map((row) =>
    row.reduce((rowData: RowData<T>, cell, index) => {
      rowData[headers[index]] = cell;
      return rowData;
    }, {} as RowData<T>),
  );

  return tableData;
}
