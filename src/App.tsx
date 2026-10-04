import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CategoryFilter from "./components/CategoryFilter";
import ProductsGrid from "./components/ProductsGrid";
import { useCategories } from "./hooks/useCategories";
import { useProducts } from "./hooks/useProducts";
import {
  SORTABLE_COLUMNS,
  toProductSorting,
  type ProductSorting,
  serializeSorting,
} from "./libs/sorting";

function App() {
  const [categoryPath, setCategoryPath] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<ProductSorting[]>([
    { columnName: SORTABLE_COLUMNS.price, direction: "desc" },
  ]);

  const categoryId = categoryPath.at(-1);

  const categoriesQuery = useCategories();
  const productsQuery = useProducts({
    page: page + 1,
    perPage: pageSize,
    categoryId,
    sort: serializeSorting(sorting),
  });

  const handleCategoryChange = (path: number[]) => {
    setCategoryPath(path);
    setPage(0);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(0);
  };

  const handleSortingChange = (next: ProductSorting[]) => {
    setSorting(toProductSorting(next));
    setPage(0);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ position: "relative", overflow: "hidden" }}>
        {productsQuery.isFetching && (
          <LinearProgress
            sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }}
          />
        )}

        {categoriesQuery.isError && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => categoriesQuery.refetch()}
              >
                Retry
              </Button>
            }
          >
            Failed to load categories.
          </Alert>
        )}

        <CategoryFilter
          categories={categoriesQuery.data ?? []}
          value={categoryPath}
          onChange={handleCategoryChange}
          disabled={categoriesQuery.isPending}
        />

        {productsQuery.isError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => productsQuery.refetch()}
              >
                Retry
              </Button>
            }
          >
            Failed to load products.
          </Alert>
        ) : (
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ px: 2, pb: 1 }}
            >
              {productsQuery.data
                ? `Found: ${productsQuery.data.totalItems}`
                : "Loading…"}
            </Typography>
            <ProductsGrid
              rows={productsQuery.data?.products ?? []}
              totalCount={productsQuery.data?.totalItems ?? 0}
              currentPage={page}
              pageSize={pageSize}
              onCurrentPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
              sorting={sorting}
              onSortingChange={handleSortingChange}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}

export default App;
