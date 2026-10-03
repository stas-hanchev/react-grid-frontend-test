import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../libs/api';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: 5 * 60_000
  });
