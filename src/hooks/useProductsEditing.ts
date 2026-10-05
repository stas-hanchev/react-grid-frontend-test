import { useState } from 'react';
import type { ChangeSet } from '@devexpress/dx-react-grid';
import { getErrorMessage } from '../libs/api';
import {
  NEW_ROW_DEFAULTS,
  toNewProduct,
  toProductChanges,
} from '../libs/productForm';
import type { Product } from '../libs/types';
import { useProductMutations } from './useProductMutations';

type RawRow = Record<string, unknown>;
type RowChanges = Record<string, RawRow>;
type RowId = number | string;

export type Notice = { severity: 'success' | 'error'; message: string };

type Options = {
  rows: Product[];
  currentPage: number;
  onCurrentPageChange: (page: number) => void;
};

export const useProductsEditing = ({
  rows,
  currentPage,
  onCurrentPageChange,
}: Options) => {
  const { create, update, remove } = useProductMutations();

  const [editingRowIds, setEditingRowIds] = useState<RowId[]>([]);
  const [addedRows, setAddedRows] = useState<RawRow[]>([]);
  const [rowChanges, setRowChanges] = useState<RowChanges>({});
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);

  const fail = (message: string) => setNotice({ severity: 'error', message });

  const changeAddedRows = (next: RawRow[]) =>
    setAddedRows(
      next.map((row) => (Object.keys(row).length ? row : { ...NEW_ROW_DEFAULTS })),
    );

  const restoreAdded = (row: RawRow) => setAddedRows((prev) => [...prev, row]);

  const restoreChanges = (id: string, changes: RawRow) => {
    setEditingRowIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setRowChanges((prev) => ({ ...prev, [id]: changes }));
  };

  const commitAdded = async (added: ReadonlyArray<RawRow>) => {
    await Promise.resolve();

    for (const row of added) {
      const parsed = toNewProduct(row);

      if (!parsed.ok) {
        restoreAdded(row);
        fail(parsed.message);
        continue;
      }

      try {
        const product = await create.mutateAsync(parsed.value);
        setNotice({ severity: 'success', message: `Product ${product.sku} created` });
      } catch (error) {
        restoreAdded(row);
        fail(getErrorMessage(error));
      }
    }
  };

  const commitChanged = async (changed: Record<string, RawRow>) => {
    await Promise.resolve();

    for (const [id, raw] of Object.entries(changed)) {
      const parsed = toProductChanges(raw);

      if (!parsed.ok) {
        restoreChanges(id, raw);
        fail(parsed.message);
        continue;
      }

      if (Object.keys(parsed.value).length === 0) continue;

      try {
        await update.mutateAsync({ id, changes: parsed.value });
        setNotice({ severity: 'success', message: 'Changes saved' });
      } catch (error) {
        restoreChanges(id, raw);
        fail(getErrorMessage(error));
      }
    }
  };

  const commitChanges = ({ added, changed, deleted }: ChangeSet) => {
    if (added) void commitAdded(added);
    if (changed) void commitChanged(changed);
    if (deleted) setPendingDeleteIds(deleted.map(String));
  };

  const confirmDelete = async () => {
    const ids = pendingDeleteIds;
    setPendingDeleteIds([]);

    const results = await Promise.allSettled(
      ids.map((id) => remove.mutateAsync(id)),
    );
    const failed = results.filter((result) => result.status === 'rejected');
    const deletedCount = ids.length - failed.length;

    if (failed.length) {
      fail(getErrorMessage(failed[0].reason));
    } else {
      setNotice({
        severity: 'success',
        message: deletedCount === 1 ? 'Product deleted' : `${deletedCount} products deleted`,
      });
    }

    if (deletedCount >= rows.length && currentPage > 0) {
      onCurrentPageChange(currentPage - 1);
    }
  };

  const pendingDeleteNames = rows
    .filter((row) => pendingDeleteIds.includes(row._id))
    .map((row) => row.name);

  return {
    editingRowIds,
    setEditingRowIds,
    rowChanges,
    setRowChanges,
    addedRows,
    changeAddedRows,
    commitChanges,
    pendingDeleteCount: pendingDeleteIds.length,
    pendingDeleteNames,
    confirmDelete,
    cancelDelete: () => setPendingDeleteIds([]),
    notice,
    closeNotice: () => setNotice(null),
  };
};
