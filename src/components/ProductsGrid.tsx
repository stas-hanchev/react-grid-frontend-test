import { useMemo, useState } from "react";
import {
  CustomPaging,
  DataTypeProvider,
  EditingState,
  PagingState,
  SortingState,
  type Column,
} from "@devexpress/dx-react-grid";
import {
  ColumnChooser,
  DragDropProvider,
  Grid,
  PagingPanel,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  TableEditColumn,
  TableEditRow,
  TableHeaderRow,
  Toolbar,
} from "@devexpress/dx-react-grid-material-ui";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import { useProductsEditing } from "../hooks/useProductsEditing";
import {
  isSortableColumn,
  toProductSorting,
  type ProductSorting,
} from "../libs/sorting";
import type { Category, Product, ProductStatus } from "../libs/types";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import {
  BooleanEditor,
  LeafCategoryEditor,
  PercentEditor,
  PriceEditor,
  QuantityEditor,
  StatusEditor,
} from "./editors";
import { LeafCategoriesContext } from "./LeafCategoriesContext";

// ---- Data Accessors
const columns: Column[] = [
  { name: "sku", title: "SKU" },
  { name: "name", title: "Name" },
  { name: "brand", title: "Brand" },
  { name: "category", title: "Category" },
  { name: "subcategory", title: "Subcategory" },
  {
    name: "categoryId",
    title: "Type",
    getCellValue: (row: Product) => row.categoryId,
  },
  { name: "status", title: "Status" },
  { name: "price", title: "Price" },
  { name: "discountPercent", title: "Discount" },
  {
    name: "stockQuantity",
    title: "In stock",
    getCellValue: (row: Product & { stockQuantity?: number }) =>
      "stockQuantity" in row ? row.stockQuantity : row.stock?.quantity,
  },
  { name: "rating", title: "Rating" },
  { name: "isFeatured", title: "Featured" },
  { name: "createdAt", title: "Created" },
];

const columnExtensions: Table.ColumnExtension[] = [
  { columnName: "price", align: "right" },
  { columnName: "discountPercent", align: "right" },
  { columnName: "stockQuantity", align: "right" },
  { columnName: "rating", align: "right" },
];

const sortingColumnExtensions: SortingState.ColumnExtension[] = columns
  .filter((column) => !isSortableColumn(column.name))
  .map((column) => ({ columnName: column.name, sortingEnabled: false }));

const editingColumnExtensions: EditingState.ColumnExtension[] = [
  "sku",
  "category",
  "subcategory",
  "rating",
  "createdAt",
].map((columnName) => ({ columnName, editingEnabled: false }));

// ---- Data Formatting
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

const PriceFormatter = ({
  value,
  row,
}: DataTypeProvider.ValueFormatterProps) => (
  <>
    {value == null
      ? "-"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: (row as Product | undefined)?.currency ?? "USD",
        }).format(value)}
  </>
);

const PercentFormatter = ({ value }: DataTypeProvider.ValueFormatterProps) => (
  <>{value ? `${value}%` : "-"}</>
);

const NumberFormatter = ({ value }: DataTypeProvider.ValueFormatterProps) => (
  <>{value == null ? "-" : value}</>
);

const BooleanFormatter = ({ value }: DataTypeProvider.ValueFormatterProps) => (
  <>{value ? "Yes" : "No"}</>
);

// new Date('x') -> Invalid Date -> RangeError
const formatDate = (value: unknown): string => {
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? "-" : dateFormat.format(date);
};

const DateFormatter = ({ value }: DataTypeProvider.ValueFormatterProps) => (
  <>{value ? formatDate(value) : "-"}</>
);

const STATUS_COLORS: Record<
  ProductStatus,
  "success" | "default" | "warning" | "error"
> = {
  active: "success",
  draft: "default",
  out_of_stock: "warning",
  discontinued: "error",
};

const StatusFormatter = ({ value }: DataTypeProvider.ValueFormatterProps) => (
  <Chip
    size="small"
    variant="outlined"
    label={String(value).replace("_", " ")}
    color={STATUS_COLORS[value as ProductStatus] ?? "default"}
  />
);

const LeafFormatter = ({
  value,
  row,
}: DataTypeProvider.ValueFormatterProps) => (
  <>{(row as Product | undefined)?.categoryLeaf ?? value}</>
);

const getRowId = (row: Product) => row._id;

const PAGE_SIZES = [10, 20, 50];

const DEFAULT_ORDER = columns.map((column) => column.name);

const DEFAULT_COLUMN_WIDTHS = [
  { columnName: "sku", width: 120 },
  { columnName: "name", width: 350 },
  { columnName: "brand", width: 120 },
  { columnName: "category", width: 200 },
  { columnName: "subcategory", width: 200 },
  { columnName: "categoryId", width: 260 },
  { columnName: "status", width: 140 },
  { columnName: "price", width: 120 },
  { columnName: "discountPercent", width: 100 },
  { columnName: "stockQuantity", width: 100 },
  { columnName: "rating", width: 100 },
  { columnName: "isFeatured", width: 100 },
  { columnName: "createdAt", width: 120 },
];

type Props = {
  rows: Product[];
  categories: Category[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  sorting: ProductSorting[];
  onCurrentPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortingChange: (sorting: ProductSorting[]) => void;
};

const ProductsGrid = ({
  rows,
  categories,
  totalCount,
  currentPage,
  pageSize,
  sorting,
  onCurrentPageChange,
  onPageSizeChange,
  onSortingChange,
}: Props) => {
  const [defaultHiddenColumnNames] = useState<string[]>(["sku"]);

  const leafCategories = useMemo(
    () => categories.filter((category) => category.level === 2),
    [categories],
  );

  const editing = useProductsEditing({ rows, currentPage, onCurrentPageChange });

  return (
    <LeafCategoriesContext.Provider value={leafCategories}>
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <DataTypeProvider
          for={["price"]}
          formatterComponent={PriceFormatter}
          editorComponent={PriceEditor}
        />
        <DataTypeProvider
          for={["discountPercent"]}
          formatterComponent={PercentFormatter}
          editorComponent={PercentEditor}
        />
        <DataTypeProvider
          for={["stockQuantity"]}
          formatterComponent={NumberFormatter}
          editorComponent={QuantityEditor}
        />
        <DataTypeProvider for={["rating"]} formatterComponent={NumberFormatter} />
        <DataTypeProvider
          for={["isFeatured"]}
          formatterComponent={BooleanFormatter}
          editorComponent={BooleanEditor}
        />
        <DataTypeProvider
          for={["createdAt"]}
          formatterComponent={DateFormatter}
        />
        <DataTypeProvider
          for={["status"]}
          formatterComponent={StatusFormatter}
          editorComponent={StatusEditor}
        />
        <DataTypeProvider
          for={["categoryId"]}
          formatterComponent={LeafFormatter}
          editorComponent={LeafCategoryEditor}
        />

        <SortingState
          sorting={sorting}
          onSortingChange={(next) => onSortingChange(toProductSorting(next))}
          columnExtensions={sortingColumnExtensions}
        />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={onCurrentPageChange}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
        <CustomPaging totalCount={totalCount} />

        <EditingState
          editingRowIds={editing.editingRowIds}
          onEditingRowIdsChange={editing.setEditingRowIds}
          rowChanges={editing.rowChanges}
          onRowChangesChange={editing.setRowChanges}
          addedRows={editing.addedRows}
          onAddedRowsChange={editing.changeAddedRows}
          onCommitChanges={editing.commitChanges}
          columnExtensions={editingColumnExtensions}
        />

        <DragDropProvider />
        <Table columnExtensions={columnExtensions} />
        <TableColumnReordering defaultOrder={DEFAULT_ORDER} />
        <TableColumnResizing defaultColumnWidths={DEFAULT_COLUMN_WIDTHS} />

        <TableHeaderRow showSortingControls />

        <TableEditRow />
        <TableEditColumn
          showAddCommand={!editing.addedRows.length}
          showEditCommand
          showDeleteCommand
        />

        <TableColumnVisibility
          defaultHiddenColumnNames={defaultHiddenColumnNames}
        />

        <Toolbar />
        <ColumnChooser />

        <PagingPanel pageSizes={PAGE_SIZES} />
      </Grid>

      <DeleteConfirmDialog
        count={editing.pendingDeleteCount}
        names={editing.pendingDeleteNames}
        onCancel={editing.cancelDelete}
        onConfirm={() => void editing.confirmDelete()}
      />

      <Snackbar
        open={editing.notice !== null}
        autoHideDuration={5000}
        onClose={editing.closeNotice}
      >
        <Alert
          severity={editing.notice?.severity ?? "success"}
          onClose={editing.closeNotice}
          variant="filled"
        >
          {editing.notice?.message}
        </Alert>
      </Snackbar>
    </LeafCategoriesContext.Provider>
  );
};

export default ProductsGrid;
