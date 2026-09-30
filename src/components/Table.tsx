import React from "react";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";

interface TableComponentProps {
  columns: { name: string; title: string }[];
  rows: { [key: string]: any }[];
}

const TableComponent = ({ columns, rows }: TableComponentProps) => (
  <Paper>
    <Grid rows={rows} columns={columns}>
      <Table />
      <TableHeaderRow />
    </Grid>
  </Paper>
);

export default TableComponent;
