export type TableData = { [key: string]: string }[];

export type Attributes = {
  [key: string]: string;
};

export type LocatorID = {
  attributes: Attributes;
  type: string;
};

export type RowData<T> = {
  [key: string]: T;
};

export type DataFrame = { [key: string]: LocatorID };
