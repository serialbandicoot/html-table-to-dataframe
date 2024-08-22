import { JSDOM } from 'jsdom';

/**
 * clickRowByIndex will select the row of the table based on the index, where
 * the index will start at 0. If an index is greater than available rows an
 * exception will be thrown.
 */

export const getLocatorByIndex = async (dom: JSDOM, rowIndex: number) => {
  const tbodyElements = dom.window.document.querySelectorAll('tbody');
  let rowCount = 0;
  tbodyElements.forEach((tbody) => {
    const rows = tbody.querySelectorAll('tr');
    rowCount += rows.length;
  });

  if (rowIndex + 1 > rowCount) {
    throw new Error(`Row Index is greater than table rows (${rowCount})`);
  }
  // return page.getByTestId(dataTestId).locator("tbody tr").nth(rowIndex).click();
  return 'TBA';
};

/**
 * findRowBy will return the index of the row in the DataTable if found.
 * Otherwise it will log out the attempted target and return -1.
 */

export const findRowBy = (
  tableData: { [key: string]: string }[] | null,
  targetColumn: string,
  targetValue: string | null | undefined,
) => {
  if (!tableData) {
    throw new Error('DataTable cannot be undefined!');
  }

  if (!targetValue) {
    throw new Error('Target value cannot be undefined!');
  }

  const index = tableData.findIndex((item) => item[targetColumn] === targetValue);
  if (index === -1) {
    console.log(`Proceeding; Column header "${targetColumn}" with "${targetValue}" was not found! Returning '-1'"`);
    return -1;
  }
  return index;
};

export type locatorId = {
  id: string;
  value: string;
};

export interface RowData<T> {
  [key: string]: T;
}

export function buildData<T>(rows: T[][], headers: string[]): RowData<T>[] {
  // Build the array of data
  const tableData: RowData<T>[] = rows.map((row) =>
    row.reduce((rowData: RowData<T>, cell, index) => {
      rowData[headers[index]] = cell;
      return rowData;
    }, {} as RowData<T>),
  );

  return tableData;
}