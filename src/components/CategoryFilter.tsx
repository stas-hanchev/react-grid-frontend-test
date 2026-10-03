import { useMemo } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { Category } from '../libs/types';
import { buildChildrenMap } from '../libs/categoryTree';

const LEVEL_LABELS = ['Category', 'Subcategory', 'Type'] as const;

type Props = {
  categories: Category[];
  value: number[];
  onChange: (path: number[]) => void;
  disabled?: boolean;
};

const CategoryFilter = ({
  categories,
  value,
  onChange,
  disabled = false,
}: Props) => {
  const childrenByParent = useMemo(
    () => buildChildrenMap(categories),
    [categories],
  );

  const handleChange = (level: number, rawValue: string | number) => {
    const parentPath = value.slice(0, level);
    onChange(rawValue === '' ? parentPath : [...parentPath, Number(rawValue)]);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
      {LEVEL_LABELS.map((label, level) => {
        const parentId: number | null | undefined =
          level === 0 ? null : value[level - 1];
        const options =
          parentId === undefined ? [] : (childrenByParent.get(parentId) ?? []);
        const selectedId = options.length > 0 ? (value[level] ?? '') : '';
        const controlId = `category-level-${level}`;

        return (
          <FormControl
            key={label}
            size="small"
            sx={{ minWidth: 220 }}
            disabled={disabled || options.length === 0}
          >
            <InputLabel id={`${controlId}-label`}>{label}</InputLabel>
            <Select<number | ''>
              labelId={`${controlId}-label`}
              id={controlId}
              label={label}
              value={selectedId}
              onChange={(event) => handleChange(level, event.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name} ({option.productCount})
                  {option.isActive ? '' : ' - inactive'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      })}
    </Box>
  );
};

export default CategoryFilter;
