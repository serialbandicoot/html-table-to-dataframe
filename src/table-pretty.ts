import Table from 'cli-table3';

/**
 * Converts an array of objects into a formatted table using cli-table3.
 * @param toPrettyPrint - An array of objects where each object has string keys
 * and string values, or null if no data is available.
 *
 * @example
 * toPrettyPrint(dataFrame)
 *
 *   ┌────────────────────┬────────────────────┬────────────────────┐
 *   │ Person             │ Likes              │ Age                │
 *   ├────────────────────┼────────────────────┼────────────────────┤
 *   │ Chris              │ HTML tables        │ 22                 │
 *   ├────────────────────┼────────────────────┼────────────────────┤
 *   │ Dennis             │ Web accessibility  │ 45                 │
 *   ├────────────────────┼────────────────────┼────────────────────┤
 *   │ Sarah              │ JavaScript         │ 29                 │
 *   ├────────────────────┼────────────────────┼────────────────────┤
 *   │ Karen              │ Web performance    │ 36                 │
 *   └────────────────────┴────────────────────┴────────────────────┘
 */

export function toPrettyPrint(table: { [key: string]: string }[] | null) {
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
  table.forEach((row) => {
    const rowValues = headers.map((header) => row[header] || ''); // Ensure the order of values matches the headers
    tableInstance.push(rowValues);
  });

  // Print the table
  console.log(tableInstance.toString());
}
