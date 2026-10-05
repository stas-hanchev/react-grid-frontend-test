import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

type Props = {
  count: number;
  names: string[];
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteConfirmDialog = ({ count, names, onCancel, onConfirm }: Props) => (
  <Dialog open={count > 0} onClose={onCancel}>
    <DialogTitle>
      {count === 1 ? 'Delete this product?' : `Delete ${count} products?`}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>This action cannot be undone.</DialogContentText>
      <List dense>
        {names.map((name) => (
          <ListItem key={name} disableGutters>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>
      <Button color="error" onClick={onConfirm}>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmDialog;
