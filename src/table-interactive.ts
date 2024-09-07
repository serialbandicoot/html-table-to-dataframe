import { JSDOM } from 'jsdom';
import { DataFrame, LocatorID } from './types';
import { buildData, generateHeaders, validateHeaders } from './table-shared';

/**
 * toInteractiveDataFrame requires the page, dataTestId of the table
 * and the headers in the order they appear on the table.
 *
 * The result will be rows of tableCells for each column.
 * The table cell will contain a key:value, which can be used for the
 * PW Locator. Use `enterByKey` to enter values into a table cell.
 *
 * @example
 *
 * | one | two |   |
 * | a   | b   | X |
 * | c   | 1   | Y |
 *
 * headers = ["one", "two", "*three"]
 *
 * toInteractiveDataFrame(page, "table-id", headers)
 *
 * @param page
 * @param dataTestId
 * @param headers
 * @returns
 */

export function toInteractiveDataFrame(html: string, headers?: string[]): DataFrame[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Look for the tbody instead of the entire document
  const tbody = document.querySelector('tbody');

  if (!tbody) {
    throw new Error('No <tbody> element found in the HTML.');
  }

  // Generate headers based on the table's structure or validate existing ones
  if (!headers || headers.length === 0) {
    headers = generateHeaders(document);
  } else {
    validateHeaders(headers, document);
  }

  // Now focus only on the rows inside the tbody
  const rows = Array.from(tbody.querySelectorAll('tr')).map((row) => {
    return Array.from(row.querySelectorAll('td')).map((cell) => {
      const queryOnElements = 'textarea, input, button, mat-select, mat-icon, mat-slide-toggle, select';
      const control = cell.querySelectorAll(queryOnElements);

      if (control.length > 0) {
        const element = control[0];
        let type = '';

        if (element.tagName === 'SELECT') {
          // Handle <select> elements
          const selectElement = element as HTMLSelectElement;
          const selectedOption = selectElement.querySelector('option:checked') as HTMLOptionElement;
          const value = selectedOption ? selectedOption.value : '';
          type = 'select';
          return { id: 'value', value: value, type: type } as LocatorID;
        } else if (element.tagName === 'TEXTAREA') {
          type = 'textarea';
          return { id: 'value', value: (element as HTMLTextAreaElement).value, type: type } as LocatorID;
        } else if (element.tagName === 'INPUT') {
          type = 'input';
          return { id: 'value', value: (element as HTMLInputElement).value, type: type } as LocatorID;
        }

        // Extract each attribute and prefer data-test-id if available
        const attrId = element.getAttribute('id');
        const dataTestId = element.getAttribute('data-test-id');

        if (dataTestId) {
          return { id: 'data-test-id', value: dataTestId, type: type } as LocatorID;
        }
        return { id: 'id', value: attrId || '', type: 'unknown' } as LocatorID;
      }

      return { id: 'id', value: cell.getAttribute('id') || '', type: 'unknown' } as LocatorID;
    });
  });

  return buildData<LocatorID>(rows, headers);
}
