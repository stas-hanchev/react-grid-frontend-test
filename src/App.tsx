import { getCategories, getProducts } from "./libs/api";
import { useQuery } from "@tanstack/react-query";

import CircularProgress from "@mui/material/CircularProgress";
import {
  Grid,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

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
    queryKey: ["products", selectedCategory],
    queryFn: () => getProducts(1, 10, selectedCategory || undefined),
  });

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedCategory(value);
  };

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

  const dynamicColumns = products[0]
  ? Object.keys(products[0]).map((key) => ({
      name: key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
    }))
  : [];

  return isCategoriesLoading || isProductsLoading ? (
    <CircularProgress aria-label="Loading…" />
  ) : isCategoriesError || isProductsError ? (
    <Alert severity="error">Error loading data.</Alert>
  ) : (
    <Paper>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId=  "demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCategory}
          label="Category"
          autoWidth
          onChange={handleChange}
        >
          {categoriesData?.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid
        rows={formattedRows}
        columns={dynamicColumns}
        getRowId={(row) => row._id}
      >
        <Table />
        <TableHeaderRow />
      </Grid>
    </Paper>
  );
}

export default App;
