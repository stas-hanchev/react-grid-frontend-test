import { createContext } from 'react';
import type { Category } from '../libs/types';

export const LeafCategoriesContext = createContext<Category[]>([]);
