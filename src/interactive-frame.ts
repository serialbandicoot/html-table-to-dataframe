import { LocatorID } from './types';
import { BaseDataFrame } from './base-frame';

export class InteractiveDataFrame extends BaseDataFrame {
  build() {
    // Look for the tbody instead of the entire document
    const tbody = this.document.querySelector('tbody');

    if (!tbody) {
      throw new Error('No <tbody> element found in the HTML.');
    }

    let headers: string[];
    if (this.options?.header && this.options.header.length > 0) {
      headers = this.options.header;
      this.validateHeaders(headers);
    } else {
      headers = this.generateHeaders(); // Generate headers if not provided
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
          return this.extractLocatorID(control, type);
        }

        // Return a LocatorID for cells without controls
        return this.extractLocatorID(cell, 'unknown');
      });
    });

    return this.buildData<LocatorID>(rows, headers);
  }

  /**
   * Extracts all attributes from a DOM element.
   *
   * @param element - The DOM element from which to extract the attributes.
   * @param type - The type of the element (e.g., 'select', 'input', 'textarea').
   * @returns A LocatorID object containing all attributes as key-value pairs and the element type.
   */
  extractLocatorID(element: Element, type: string): LocatorID {
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
}
