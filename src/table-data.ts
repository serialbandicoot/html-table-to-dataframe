import { DataFrame, DataFrameOptions } from './data-frame';
import { TableData } from './types';

/**
 * toDataFrame is a method, which when passed the table element via
 * the data-test-id will serialize the data into a more usable object.
 * The table requires the absolute header values to be processed, otherwise
 * an error will be thrown.
 *
 * The structure should be rows of column titles and the corresponding value
 * as a key/pair. Therefore a table header can be separated words e.g. "col two".
 *
 * | one | col two |
 * | a   | b       |
 * | c   | 1       |
 *
 * This table will be converted and returned as a tableData:
 *
 * [ {"one":"a", "col two": "b"}, {"one":"c", "col two": "1"} ]
 *
 * NB; All values are considered strings.
 *
 * Call: convertHTMLTable(["one", "col two"])
 */

export function toDataFrame(html: string, options?: DataFrameOptions): TableData {
  const dataFrame = new DataFrame(html, options);
  dataFrame.validateHtml();
  if (options?.footer) {
    return dataFrame.buildWithFooter();
  }

  return dataFrame.build();
}
