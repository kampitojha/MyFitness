import { useQuery } from '@tanstack/react-query';
import { searchFoods } from '@/services/food-db';

export function useFoodSearch(query: string) {
  return useQuery({
    queryKey: ['food-search', query],
    queryFn: () => searchFoods(query),
    enabled: query.trim().length > 0,
    staleTime: Infinity,
    placeholderData: (prev) => prev,
  });
}