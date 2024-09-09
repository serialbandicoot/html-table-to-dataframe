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

  // Focus on rows inside the tbody
  const rows = Array.from(tbody.querySelectorAll('tr')).map((row) => {
    return Array.from(row.querySelectorAll('td')).map((cell) => {
      const queryOnElements = 'textarea, input, button, mat-select, mat-icon, mat-slide-toggle, select';
      const control = cell.querySelector(queryOnElements);

      if (control) {
        let type = '';

        // Determine the type based on the tagName
        if (control.tagName === 'SELECT') {
          type = 'select';
        } else if (control.tagName === 'TEXTAREA') {
          type = 'textarea';
        } else if (control.tagName === 'INPUT') {
          type = 'input';
        }

        // Use extractLocatorID to get all attributes
        return extractLocatorID(control, type);
      }

      // Return a LocatorID for cells without controls
      return extractLocatorID(cell, 'unknown');
    });
  });

  return buildData<LocatorID>(rows, headers);
}

/**
 * Extracts all attributes from a DOM element.
 *
 * @param element - The DOM element from which to extract the attributes.
 * @param type - The type of the element (e.g., 'select', 'input', 'textarea').
 * @returns A LocatorID object containing all attributes as key-value pairs and the element type.
 */
function extractLocatorID(element: Element, type: string): LocatorID {
  const attributes: { [key: string]: string } = {};

  // Extract all attributes as key-value pairs
  Array.from(element.attributes).forEach((attr) => {
    attributes[attr.name] = attr.value;
  });

  return {
    attributes,
    type: type || 'unknown',
  };
}
