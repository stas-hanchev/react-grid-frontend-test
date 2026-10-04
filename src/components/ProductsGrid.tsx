import {
  CustomPaging,
  DataTypeProvider,
  IntegratedSorting,
  PagingState,
  SortingState,
  type Column,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  PagingPanel,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import Chip from "@mui/material/Chip";
import type { Product, ProductStatus } from "../libs/types";
import { toProductSorting, type ProductSorting } from "../libs/sorting";

// ---- Data Accessors
const columns: Column[] = [
  { name: "sku", title: "SKU" },
  { name: "name", title: "Name" },
  { name: "brand", title: "Brand" },
  { name: "category", title: "Category" },
  { name: "subcategory", title: "Subcategory" },
  { name: "categoryLeaf", title: "Type" },
  { name: "status", title: "Status" },
  { name: "price", title: "Price" },
  { name: "discountPercent", title: "Discount" },
  {
    name: "stockQuantity",
    title: "In stock",
    getCellValue: (row: Product) => row.stock?.quantity,
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

// ---- Data Formatting
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

const PriceFormatter = ({
  value,
  row,
}: DataTypeProvider.ValueFormatterProps) => (
  <>
    {new Intl.NumberFormat("en-US", {
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
  <>{value ? formatDate(value) : "—"}</>
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

const getRowId = (row: Product) => row._id;

const PAGE_SIZES = [10, 20, 50];

type Props = {
  rows: Product[];
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
  totalCount,
  currentPage,
  pageSize,
  sorting,
  onCurrentPageChange,
  onPageSizeChange,
  onSortingChange,
}: Props) => (
  <Grid rows={rows} columns={columns} getRowId={getRowId}>
    <DataTypeProvider for={["price"]} formatterComponent={PriceFormatter} />
    <DataTypeProvider
      for={["discountPercent"]}
      formatterComponent={PercentFormatter}
    />
    <DataTypeProvider
      for={["stockQuantity", "rating"]}
      formatterComponent={NumberFormatter}
    />
    <DataTypeProvider
      for={["isFeatured"]}
      formatterComponent={BooleanFormatter}
    />
    <DataTypeProvider for={["createdAt"]} formatterComponent={DateFormatter} />
    <DataTypeProvider for={["status"]} formatterComponent={StatusFormatter} />

    <SortingState
      sorting={sorting}
      onSortingChange={(next) => onSortingChange(toProductSorting(next))}
    />
    <IntegratedSorting />

    <PagingState
      currentPage={currentPage}
      onCurrentPageChange={onCurrentPageChange}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
    />
    <CustomPaging totalCount={totalCount} />

    <Table columnExtensions={columnExtensions} />
    <TableHeaderRow showSortingControls />
    <PagingPanel pageSizes={PAGE_SIZES} />
  </Grid>
);

export default ProductsGrid;
