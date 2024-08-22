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

export async function toDataFrame(html: string, headers: string[]): Promise<{ [key: string]: string }[] | null> {
  const dom = new JSDOM(html);

  const rowElements = Array.from(dom.window.document.querySelectorAll('table tbody tr'));

  const rows = rowElements.map((row) =>
    Array.from(row.querySelectorAll('td,th')).map((cell) => {
      const queryOnElements = 'input, textarea, button';
      const inputElements = cell.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>(
        queryOnElements,
      );

      if (inputElements.length > 0) {
        const element = inputElements[0];
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          return element.value;
        }

        if (element instanceof HTMLButtonElement) {
          return inputElements[0].getAttribute('aria-checked') || '';
        }
      }

      return cell.textContent ? cell.textContent.trim() : '';
    }),
  );

  return buildData<string>(rows, headers);
}
