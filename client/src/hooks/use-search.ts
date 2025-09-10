import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchContent } from "./use-content";
import type { SearchFilters } from "@/types/content";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = useSearchContent(
    debouncedQuery,
    filters,
    itemsPerPage,
    (currentPage - 1) * itemsPerPage
  );

  const updateFilter = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const searchResults = useMemo(() => {
    return data?.content || [];
  }, [data?.content]);

  const totalResults = useMemo(() => {
    return data?.total || 0;
  }, [data?.total]);

  const hasNextPage = useMemo(() => {
    return data?.hasMore || false;
  }, [data?.hasMore]);

  return {
    query,
    setQuery,
    filters,
    updateFilter,
    clearFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    searchResults,
    totalResults,
    hasNextPage,
    isLoading,
    error
  };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
