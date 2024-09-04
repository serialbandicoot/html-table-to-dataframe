import { JSDOM } from 'jsdom';
import { buildData } from './table-shared';

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

export function toDataFrame(html: string, headers?: string[]): { [key: string]: string }[] | null {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  if (!headers || headers.length === 0) {
    headers = generateHeaders(document);
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