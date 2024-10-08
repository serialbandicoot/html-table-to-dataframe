import { JSDOM } from 'jsdom';
import { TableData } from './types';

/**
 * toDataFrame is a method, which when passed the table element via
 * the data-test-id will serialize the data into a more usable object.
 * The table requires the absolute header values to be processed, otherwise
 * an error will be thrown.
 *
 * The structure should be rows of column titles and the corresponding value
 * as a key/pair. Therefore a table header can be separated words e.g. "col two".
 *
 * | one | col two |
 * | a   | b       |
 * | c   | 1       |
 *
 * This table will be converted and returned as a tableData:
 *
 * [ {"one":"a", "col two": "b"}, {"one":"c", "col two": "1"} ]
 *
 * NB; All values are considered strings.
 *
 * Call: convertHTMLTable(["one", "col two"])
 */

export function toDataFrame(html: string, headers?: string[]): TableData {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  if (!html || html === '') {
    throw new Error('HTML cannot be empty');
  }

  if (!headers || headers.length === 0) {
    headers = generateHeaders(document);
  } else {
    validateHeaders(headers, document);
  }

  const rowElements = Array.from(document.querySelectorAll('table tbody tr'));

  const rows = rowElements.map((row) =>
    Array.from(row.querySelectorAll('td,th')).map((cell) => {
      const queryOnElements = 'input, textarea, button';
      const inputElements = cell.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>(
        queryOnElements,
      );

      if (inputElements.length > 0) {
        const element = inputElements[0];
        if (element instanceof dom.window.HTMLInputElement || element instanceof dom.window.HTMLTextAreaElement) {
          return element.value;
        }

        if (element instanceof dom.window.HTMLButtonElement) {
          return inputElements[0].getAttribute('aria-checked') || '';
        }
      }

      return cell.textContent ? cell.textContent.trim() : '';
    }),
  );

  return buildData<string>(rows, headers);
}

/**
 * Generates an array of header names from the table's thead section.
 * If a header element's text content is empty, it will be replaced with a unique identifier
 * in the format 'unknownX', where X is the number of missing headers encountered so far.
 *
 * @param {Document} document - The document object where the table resides.
 * @returns {string[]} - An array of header names, with empty headers replaced by 'unknownX'.
 */
function generateHeaders(document: Document): string[] {
  // Select both <th> and <td> elements within <thead>
  const headerElements = Array.from(document.querySelectorAll('table thead th, table thead td'));
  let unknownCount = 0;

  return headerElements.map((element) => {
    // Clean the text content of the header element
    const text = cleanHeaderText(element.textContent || '');

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

function validateHeaders(headers: string[], document: Document): void {
  const columnCount = document.querySelectorAll('table thead th, , table thead td').length;
  if (headers.length !== columnCount) {
    throw new Error(
      `The number of provided headers (${headers.length}) does not match the number of columns in the table (${columnCount}).`,
    );
  }
}

/**
 * Cleans header text by replacing newlines and multiple spaces with a single space.
 * @param text - The raw text extracted from the header element (th or td).
 * @returns A cleaned string with normalized spaces and no line breaks.
 */
function cleanHeaderText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export interface RowData<T> {
  [key: string]: T;
}

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
