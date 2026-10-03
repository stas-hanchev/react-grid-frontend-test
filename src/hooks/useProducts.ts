import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getProducts } from '../libs/api';
import type { GetProductsParams } from '../libs/types';

export const useProducts = (params: GetProductsParams) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: ({ signal }) => getProducts(params, signal),
    placeholderData: keepPreviousData,
  });
