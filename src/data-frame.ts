import { JSDOM } from 'jsdom';

export type DataFrameOptions = {
  header?: string[];
  footer?: boolean;
};

export interface RowData<T> {
  [key: string]: T;
}

export class DataFrame {
  private readonly dom: JSDOM;
  private readonly document: Document;
  public data: RowData<string>[] | undefined;
  private readonly options: DataFrameOptions | undefined;

  constructor(
    public readonly html: string,
    options?: DataFrameOptions,
  ) {
    this.dom = new JSDOM(html);
    this.document = this.dom.window.document;
    this.options = options;
  }

  validateHtml() {
    if (!this.html || this.html === '') {
      throw new Error('HTML cannot be empty');
    }
  }

  /**
   * Validates the provided headers against the number of columns in the table.
   * Throws an error if the lengths do not match.
   *
   * @param headers - The headers provided by the user.
   * @param document - The HTML document containing the table.
   */

  validateHeaders(headers: string[]): void {
    const columnCount = this.document.querySelectorAll('table thead th, , table thead td').length;
    if (headers.length !== columnCount) {
      throw new Error(
        `The number of provided headers (${headers.length}) does not match the number of columns in the table (${columnCount}).`,
      );
    }
  }

  build() {
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
            return element.value;
          }

          if (element instanceof this.dom.window.HTMLButtonElement) {
            return inputElements[0].getAttribute('aria-checked') || '';
          }
        }

        return cell.textContent ? cell.textContent.trim() : '';
      }),
    );

    return this.buildData<string>(rows, headers);
  }

  /**
   * Generates an array of header names from the table's thead section.
   * If a header element's text content is empty, it will be replaced with a unique identifier
   * in the format 'unknownX', where X is the number of missing headers encountered so far.
   *
   * @returns {string[]} - An array of header names, with empty headers replaced by 'unknownX'.
   */

  generateHeaders(): string[] {
    // Select both <th> and <td> elements within <thead>
    const headerElements = Array.from(this.document.querySelectorAll('table thead th, table thead td'));
    let unknownCount = 0;

    return headerElements.map((element) => {
      // Clean the text content of the header element
      const text = this.cleanHeaderText(element.textContent || '');

      if (text && text !== '') {
        return text;
      } else {
        return `Unknown${unknownCount++}`;
      }
    });
  }

  /**
   * Cleans header text by replacing newlines and multiple spaces with a single space.
   * @param text - The raw text extracted from the header element (th or td).
   * @returns A cleaned string with normalized spaces and no line breaks.
   */
  // function

  cleanHeaderText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  buildData<T>(rows: T[][], headers: string[]): RowData<T>[] {
    // Build the array of data
    const tableData: RowData<T>[] = rows.map((row) =>
      row.reduce((rowData: RowData<T>, cell, index) => {
        rowData[headers[index]] = cell;
        return rowData;
      }, {} as RowData<T>),
    );

    return tableData;
  }

  buildWithFooter() {
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
