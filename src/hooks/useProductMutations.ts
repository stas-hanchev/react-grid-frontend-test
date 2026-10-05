import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, deleteProduct, updateProduct } from '../libs/api';
import type { PaginatedProductResponse, ProductChanges } from '../libs/types';

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['products'] }),
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
    ]);

  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: ProductChanges }) =>
      updateProduct(id, changes),
    onSuccess: (product) => {
      queryClient.setQueriesData<PaginatedProductResponse>(
        { queryKey: ['products'] },
        (old) =>
          old && {
            ...old,
            products: old.products.map((item) =>
              item._id === product._id ? product : item,
            ),
          },
      );
      return invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
