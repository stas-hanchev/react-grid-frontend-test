import type { Sorting, SortingDirection } from '@devexpress/dx-react-grid';

export const SORTABLE_COLUMNS = {
  sku: 'sku',
  name: 'name',
  brand: 'brand',
  category: 'category',
  price: 'price',
  discountPercent: 'discountPercent',
  stockQuantity: 'stockQuantity',
  rating: 'rating',
  createdAt: 'createdAt',
} as const;

export type SortableColumn =
  (typeof SORTABLE_COLUMNS)[keyof typeof SORTABLE_COLUMNS];

export const SortDirection = { ASC: 'asc', DESC: 'desc' } as const satisfies Record<
  string,
  SortingDirection
>;
export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export interface ProductSorting extends Sorting {
  columnName: SortableColumn;
  direction: SortDirection;
}

export const isSortableColumn = (name: string): name is SortableColumn =>
  (Object.values(SORTABLE_COLUMNS) as string[]).includes(name);

export const toProductSorting = (sorting: Sorting[]): ProductSorting[] =>
  sorting.filter((item): item is ProductSorting =>
    isSortableColumn(item.columnName),
  );

// 'price:desc,name:asc'
export const serializeSorting = (
  sorting: ProductSorting[],
): string | undefined =>
  sorting.length
    ? sorting
        .map(({ columnName, direction }) => `${columnName}:${direction}`)
        .join(',')
    : undefined;
