// Table.types.ts
export type ColumnType = 'text' | 'date';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  type?: ColumnType;
  formatter?: (value: any, row: T) => string;
}

export interface TableAction<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: 'primary' | 'danger' | 'neutral';
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
}