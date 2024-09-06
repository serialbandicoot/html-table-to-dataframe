export type TableData = { [key: string]: string }[];

export type LocatorID = {
  id: string;
  value: string;
  type: string;
};

export type RowData<T> = {
  [key: string]: T;
};
