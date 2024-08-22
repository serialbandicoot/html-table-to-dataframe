import { JSDOM } from 'jsdom';

export async function toDataFrame(
    html: string,
    headers: string[],
  ): Promise<{ [key: string]: string }[] | null> {
  
    const dom = new JSDOM(html);
    
      const rowElements = Array.from(dom.window.document.querySelectorAll("table tbody tr"));
  
      const rows = rowElements.map((row) =>
        Array.from(row.querySelectorAll("td,th")).map((cell) => {
          const queryOnElements = "input, textarea, button";
          const inputElements = cell.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>(
            queryOnElements,
          );
  
          if (inputElements.length > 0) {
            const element = inputElements[0];
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
              return element.value;
            }
  
            if (element instanceof HTMLButtonElement) {
              return inputElements[0].getAttribute("aria-checked") || "";
            }
          }
  
          return cell.textContent ? cell.textContent.trim() : "";
        }),
      );
  
    return buildData<string>(rows, headers);
  }

  // buildData returns a formatted data-structure for table cells
export function buildData<T>(rows: T[][], headers: string[]) {
    interface RowData {
      [key: string]: T;
    }
  
    // Build the array of data
    const tableData: RowData[] = rows.map((row) =>
      row.reduce((rowData: RowData, cell, index) => {
        rowData[headers[index]] = cell;
        return rowData;
      }, {}),
    );
  
    return tableData;
  }