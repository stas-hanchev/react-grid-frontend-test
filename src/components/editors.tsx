import { useContext, type KeyboardEvent } from 'react';
import type { DataTypeProvider } from '@devexpress/dx-react-grid';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { PRODUCT_STATUSES } from '../libs/constants';
import { LeafCategoriesContext } from './LeafCategoriesContext';

type EditorProps = DataTypeProvider.ValueEditorProps;

const forwardKeys =
  (onKeyDown: EditorProps['onKeyDown']) => (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      onKeyDown({ key: event.key });
    }
  };

type NumberEditorProps = EditorProps & { step: number; max?: number };

const NumberEditor = ({
  value,
  onValueChange,
  disabled,
  autoFocus,
  onBlur,
  onFocus,
  onKeyDown,
  step,
  max,
}: NumberEditorProps) => (
  <TextField
    variant="standard"
    type="number"
    fullWidth
    disabled={disabled}
    autoFocus={autoFocus}
    value={value ?? ''}
    onChange={(event) =>
      onValueChange(
        event.target.value === '' ? undefined : Number(event.target.value),
      )
    }
    onBlur={onBlur}
    onFocus={onFocus}
    onKeyDown={forwardKeys(onKeyDown)}
    inputProps={{ min: 0, max, step, style: { textAlign: 'right' } }}
  />
);

export const PriceEditor = (props: EditorProps) => (
  <NumberEditor {...props} step={0.01} />
);

export const PercentEditor = (props: EditorProps) => (
  <NumberEditor {...props} step={1} max={100} />
);

export const QuantityEditor = (props: EditorProps) => (
  <NumberEditor {...props} step={1} />
);

export const StatusEditor = ({
  value,
  onValueChange,
  disabled,
}: EditorProps) => (
  <Select
    variant="standard"
    fullWidth
    disabled={disabled}
    value={value ?? 'draft'}
    onChange={(event) => onValueChange(event.target.value)}
  >
    {PRODUCT_STATUSES.map((status) => (
      <MenuItem key={status} value={status}>
        {status.replace('_', ' ')}
      </MenuItem>
    ))}
  </Select>
);

export const BooleanEditor = ({
  value,
  onValueChange,
  disabled,
}: EditorProps) => (
  <Checkbox
    size="small"
    disabled={disabled}
    checked={Boolean(value)}
    onChange={(event) => onValueChange(event.target.checked)}
  />
);

export const LeafCategoryEditor = ({
  value,
  onValueChange,
  disabled,
}: EditorProps) => {
  const leaves = useContext(LeafCategoriesContext);

  return (
    <Select
      variant="standard"
      fullWidth
      displayEmpty
      disabled={disabled}
      value={value ?? ''}
      onChange={(event) => onValueChange(event.target.value)}
    >
      <MenuItem value="" disabled>
        Select type
      </MenuItem>
      {leaves.map((leaf) => (
        <MenuItem key={leaf.id} value={leaf.id}>
          {leaf.path.replaceAll(' > ', ' › ')}
        </MenuItem>
      ))}
    </Select>
  );
};
