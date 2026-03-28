import { useState, useEffect } from "react";
import { WordPressAPI } from "@/lib/wordpress";
import type {
  PortfolioItem,
  PortfolioResponse,
  CategoriesResponse,
} from "@/types";

export function usePortfolios(params?: {
  page?: number;
  per_page?: number;
  categories?: string;
  search?: string;
}) {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Serialize params to a stable string to avoid infinite re-renders
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: PortfolioResponse = await WordPressAPI.getPortfolios({
          per_page: 6,
          ...params,
        });

        if (!controller.signal.aborted) {
          setPortfolios(response.items);
          setTotal(response.total);
          setTotalPages(response.totalPages);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Error fetching portfolios:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch portfolios"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPortfolios();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return {
    portfolios,
    loading,
    error,
    total,
    totalPages,
  };
}

/**
 * Hook for fetching a single portfolio item by slug
 */
export function usePortfolioBySlug(slug: string, initialData?: PortfolioItem) {
  const [portfolio, setPortfolio] = useState<PortfolioItem | null>(
    initialData || null
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPortfolio = async () => {
      if (!slug || initialData) return;

      try {
        setLoading(true);
        setError(null);

        const response = await WordPressAPI.getPortfolioBySlug(slug);
        if (!controller.signal.aborted) {
          setPortfolio(response);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Error fetching portfolio:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch portfolio"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPortfolio();
    return () => controller.abort();
  }, [slug, initialData]);

  return {
    portfolio,
    loading,
    error,
  };
}

/**
 * Hook for fetching portfolio categories
 */
export function usePortfolioCategories() {
  const [categories, setCategories] = useState<
    CategoriesResponse["categories"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await WordPressAPI.getPortfolioCategories();
        if (!controller.signal.aborted) {
          setCategories(response.categories);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Error fetching categories:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, []);

  return {
    categories,
    loading,
    error,
  };
}
