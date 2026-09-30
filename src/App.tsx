import TableComponent from './components/Table';

const columns = [
  { name: "id", title: "ID" },
  { name: "product", title: "Product" },
  { name: "owner", title: "Owner" },
];
const rows = [
  { id: 0, product: "DevExtreme", owner: "DevExpress" },
  { id: 1, product: "DevExtreme Reactive", owner: "DevExpress" },
];

function App() {
  return (<TableComponent columns={columns} rows={rows} />)
}

export default App
