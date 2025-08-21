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

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: PortfolioResponse = await WordPressAPI.getPortfolios({
          per_page: 6, // Default to 6 for homepage
          ...params,
        });

        setPortfolios(response.items);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch portfolios"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [params]);

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
export function usePortfolioBySlug(slug: string) {
  const [portfolio, setPortfolio] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const response = await WordPressAPI.getPortfolioBySlug(slug);
        setPortfolio(response);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch portfolio"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

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
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await WordPressAPI.getPortfolioCategories();
        setCategories(response.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
  };
}
