import { JSDOM } from 'jsdom';
import Table from 'cli-table3';

/**
 * Converts an array of objects into a formatted table using cli-table3.
 * @param table - An array of objects where each object has string keys 
 * and string values, or null if no data is available.
 */
export async function prettyPrint(
  table: { [key: string]: string }[] | null
) {
  // Handle the case where table is null
  if (table === null) {
    console.log('No data available');
    return;
  }

  // Check if the table is empty
  if (table.length === 0) {
    console.log('Table is empty');
    return;
  }

  // Create a new Table instance with headers
  const headers = Object.keys(table[0]);
  const tableInstance = new Table({
    head: headers, // Set headers from the keys of the first object
    colWidths: headers.map(() => 20), // Set a default column width; adjust as needed
  });

  // Add rows to the table
  table.forEach(row => {
    const rowValues = headers.map(header => row[header] || ''); // Ensure the order of values matches the headers
    tableInstance.push(rowValues);
  });

  // Print the table
  console.log(tableInstance.toString());
  
  return tableInstance;
}

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