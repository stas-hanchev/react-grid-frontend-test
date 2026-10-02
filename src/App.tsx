import { getCategories, getProducts } from "./libs/api";
import { useQuery } from "@tanstack/react-query";

import CircularProgress from "@mui/material/CircularProgress";
import {
  Grid,
  Table,
  TableGroupRow,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import Paper from "@mui/material/Paper";
import { GroupingState, IntegratedGrouping } from "@devexpress/dx-react-grid";

// const columns = [
//   { name: "id", title: "ID" },
//   { name: "product", title: "Product" },
//   { name: "owner", title: "Owner" },
// ];
// const rows = [
//   { id: 0, product: "DevExtreme", owner: "DevExpress" },
//   { id: 1, product: "DevExtreme Reactive", owner: "DevExpress" },
// ];

function App() {
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = productsData?.products || [];

  const formattedRows = products.map((product, index) => {
    const formattedItem: Record<string, any> = {
      id: product._id || index,
    };

    Object.entries(product).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        formattedItem[key] = JSON.stringify(value);
      } else {
        formattedItem[key] = value;
      }
    });

    return formattedItem;
  });

  const dynamicColumns = Object.keys(products[0] || {}).map((key) => ({
    name: key,
    title: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  return isCategoriesLoading || isProductsLoading ? (
    <CircularProgress aria-label="Loading…" />
  ) : isCategoriesError || isProductsError ? (
    <div>Error loading data.</div>
  ) : (
    <Paper>
      <Grid
        rows={formattedRows}
        columns={dynamicColumns}
        getRowId={(row) => row._id}
      >
        <GroupingState grouping={[{ columnName: "category" }]} />
        <IntegratedGrouping />
        <Table />
        <TableHeaderRow />
        <TableGroupRow />
      </Grid>
    </Paper>
  );
}

export default App;
