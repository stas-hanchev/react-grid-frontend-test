import axios, { isAxiosError } from 'axios';
import type {
  Category,
  GetProductsParams,
  NewProduct,
  PaginatedProductResponse,
  Product,
  ProductChanges,
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

export const createProduct = async (payload: NewProduct): Promise<Product> => {
  const { data } = await api.post<Product>('/products', payload);
  return data;
};

export const updateProduct = async (
  id: string,
  changes: ProductChanges,
): Promise<Product> => {
  const { data } = await api.patch<Product>(`/products/${id}`, changes);
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

interface ApiErrorBody {
  message?: string;
  // celebrate: { body: { message: '"price" must be a number' } }
  validation?: Record<string, { message?: string }>;
}

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorBody>(error)) {
    const data = error.response?.data;
    const validation = data?.validation
      ? Object.values(data.validation)[0]?.message
      : undefined;

    return validation ?? data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : 'Unknown error';
};
