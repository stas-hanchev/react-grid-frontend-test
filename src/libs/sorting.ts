import type { Sorting } from '@devexpress/dx-react-grid';

export const SORTABLE_COLUMNS = {
  sku: 'sku',
  name: 'name',
  brand: 'brand',
  category: 'category',
  price: 'price',
  discountPercent: 'discountPercent',
  stockQuantity: 'stock.quantity',
  rating: 'rating',
  createdAt: 'createdAt',
} as const;

export type SortableColumn = keyof typeof SORTABLE_COLUMNS;

export interface ProductSorting extends Sorting {
  columnName: SortableColumn;
}

export const isSortableColumn = (name: string): name is SortableColumn =>
  Object.hasOwn(SORTABLE_COLUMNS, name);

export const toProductSorting = (sorting: Sorting[]): ProductSorting[] =>
  sorting.filter((item): item is ProductSorting =>
    isSortableColumn(item.columnName),
  );

// 'price:desc,name:asc'
export const serializeSorting = (sorting: ProductSorting[]): string | undefined =>
  sorting.length
    ? sorting.map(({ columnName, direction }) => `${columnName}:${direction}`).join(',')
    : undefined;