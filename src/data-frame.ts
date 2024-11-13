import { BaseDataFrame } from './base-frame';

export class DataFrame extends BaseDataFrame {
  buildBody() {
    let headers: string[];
    if (this.options?.header && this.options.header.length > 0) {
      headers = this.options.header;
      this.validateHeaders(headers);
    } else {
      headers = this.generateHeaders(); // Generate headers if not provided
    }

    // Extract rows, potentially handling footer based on options
    let rowElements = Array.from(this.document.querySelectorAll('table tbody tr'));
    if (this.options?.footer) {
      rowElements = rowElements.slice(0, -1); // Exclude the last row as footer
    }

    const rows = rowElements.map((row) =>
      Array.from(row.querySelectorAll('td,th')).map((cell) => {
        const queryOnElements = 'input, textarea, button, select';
        const inputElements = cell.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | HTMLSelectElement>(
          queryOnElements,
        );

        if (inputElements.length > 0) {
          const element = inputElements[0];
          if (
            element instanceof this.dom.window.HTMLInputElement ||
            element instanceof this.dom.window.HTMLTextAreaElement
          ) {
            return element.value;
          }

          if (element instanceof this.dom.window.HTMLButtonElement) {
            return inputElements[0].getAttribute('aria-checked') || '';
          }

          if (element instanceof this.dom.window.HTMLSelectElement) {
            const selectedOption = inputElements[0].querySelector("option:checked") as HTMLSelectElement
            if (selectedOption) {
              return selectedOption.value;
            }
            // Empty
            return ""
          }
        }

        return cell.textContent ? cell.textContent.trim() : '';
      }),
    );

    return this.buildData<string>(rows, headers);
  }

  buildFooter() {
    const tfoot = this.document.querySelector('table tfoot');
    if (!tfoot) {
      throw new Error('No <tfoot> element found in the table, but footer option is enabled.');
    }

    // Get footer headers
    let footerHeaders = Array.from(tfoot.querySelectorAll('th')).map((th) => th.textContent?.trim() || '');

    // If footerHeaders is empty, fall back to options.headers
    if (footerHeaders.length === 0 && this.options?.header) {
      footerHeaders = [...this.options.header]; // Use options.headers as fallback
    }

    // Get footer cells
    const footerCells = Array.from(tfoot.querySelectorAll('tr')).map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => {
        const queryOnElements = 'input, textarea, button';
        const inputElements = cell.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>(
          queryOnElements,
        );

        if (inputElements.length > 0) {
          const element = inputElements[0];
          if (
            element instanceof this.dom.window.HTMLInputElement ||
            element instanceof this.dom.window.HTMLTextAreaElement
          ) {
            return element.value; // Extract value from input/textarea
          }

          if (element instanceof this.dom.window.HTMLButtonElement) {
            const ariaChecked = element.getAttribute('aria-checked');
            return ariaChecked || element.textContent?.trim() || ''; // Return aria-checked or button text
          }
        }

        return cell.textContent ? cell.textContent.trim() : ''; // Return text content
      }),
    );

    return this.buildData<string>(footerCells, footerHeaders);
  }
}
