import { JSDOM } from 'jsdom';
import { DataFrameOptions, RowData } from './types';

export class BaseDataFrame {
  readonly dom: JSDOM;
  readonly document: Document;
  public data: RowData<string>[] | undefined;
  readonly options: DataFrameOptions | undefined;

  constructor(
    protected html: string,
    options?: DataFrameOptions,
  ) {
    this.dom = new JSDOM(html);
    this.document = this.dom.window.document;
    this.options = options;
  }

  normalizeHtml() {
    if (!this.html || typeof this.html !== 'string') {
      return;
    }

    const TABLE_RE = /<table\b[^>]*>[\s\S]*?<\/table>/gi;

    const normalizeSingleTable = (tableHtml: string): string => {
      // If already normalized, leave it alone
      if (/<thead\b/i.test(tableHtml) && /<tbody\b/i.test(tableHtml)) {
        return tableHtml;
      }

      // Grab opening <table ...> tag
      const openMatch = tableHtml.match(/<table\b[^>]*>/i);
      if (!openMatch) return tableHtml;
      const tableOpen = openMatch[0];

      // Extract everything between <table> and </table>
      const inner = tableHtml.replace(new RegExp(`^[\\s\\S]*?${tableOpen}`, 'i'), '').replace(/<\/table>[\s\S]*$/i, '');

      // Extract all <tr> rows
      const rows = inner.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi);
      if (!rows || rows.length === 0) {
        return tableHtml;
      }

      const headRow = rows[0]; // first row → header
      const bodyRows = rows.slice(1); // rest → body

      return tableOpen + '<thead>' + headRow + '</thead>' + '<tbody>' + bodyRows.join('') + '</tbody>' + '</table>';
    };

    // Normalize every table in the HTML
    const normalized = this.html.replace(TABLE_RE, (match) => {
      try {
        return normalizeSingleTable(match);
      } catch {
        return match;
      }
    });

    // Update html (readonly overridden intentionally)
    this.html = normalized;
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
    const columnCount = this.document.querySelectorAll('table thead th, table thead td').length;
    if (headers.length !== columnCount) {
      throw new Error(
        `The number of provided headers (${headers.length}) does not match the number of columns in the table (${columnCount}).`,
      );
    }
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

  private cleanHeaderText(text: string): string {
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
}
