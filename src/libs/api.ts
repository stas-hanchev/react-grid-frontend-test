import axios from 'axios';
import type {
  Category,
  GetProductsParams,
  PaginatedProductResponse,
} from './types';

const baseURL = import.meta.env.VITE_PRODUCTS_API_URL;

if (!baseURL) {
  throw new Error(
    'VITE_PRODUCTS_API_URL is not defined. Copy .env.example to .env and restart Vite.',
  );
}

export const api = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
  },
});

export const getCategories = async (
  signal?: AbortSignal,
): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/categories', { signal });
  return data;
};

export const getProducts = async (
  params: GetProductsParams,
  signal?: AbortSignal,
): Promise<PaginatedProductResponse> => {
  const { data } = await api.get<PaginatedProductResponse>('/products', {
    params,
    signal,
  });
  return data;
};
