import type { NewProduct, ProductChanges } from './types';

type RawRow = Record<string, unknown>;
type Result<T> = { ok: true; value: T } | { ok: false; message: string };

export const NEW_ROW_DEFAULTS = {
  name: '',
  brand: '',
  status: 'draft',
  discountPercent: 0,
  stockQuantity: 0,
  isFeatured: false,
} satisfies RawRow;

const EDITABLE_FIELDS = [
  'name',
  'brand',
  'status',
  'price',
  'discountPercent',
  'stockQuantity',
  'isFeatured',
  'categoryId',
] as const;

const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (typeof value === 'number' && Number.isNaN(value));

export const toProductChanges = (raw: RawRow): Result<ProductChanges> => {
  const changes: RawRow = {};

  for (const field of EDITABLE_FIELDS) {
    if (!(field in raw)) continue;

    if (isEmpty(raw[field])) {
      return { ok: false, message: `Field "${field}" cannot be empty` };
    }

    changes[field] = raw[field];
  }

  return { ok: true, value: changes as ProductChanges };
};

export const toNewProduct = (raw: RawRow): Result<NewProduct> => {
  const missing = (['name', 'brand', 'price', 'categoryId'] as const).filter(
    (field) => isEmpty(raw[field]),
  );

  if (missing.length) {
    return {
      ok: false,
      message: `Fill in the required fields: ${missing.join(', ')}`,
    };
  }

  const changes = toProductChanges(raw);

  return changes.ok
    ? { ok: true, value: changes.value as NewProduct }
    : changes;
};
