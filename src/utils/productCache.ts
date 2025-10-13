import { Category, Product } from "../services";

// Global cache for products and categories
let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;
let lastLoadTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to invalidate cache (can be called from other components)
export const invalidateProductCache = () => {
  cachedProducts = null;
  cachedCategories = null;
  lastLoadTime = 0;
};

// Function to check if cache is valid
export const isProductCacheValid = () => {
  return (
    cachedProducts &&
    cachedCategories &&
    Date.now() - lastLoadTime < CACHE_DURATION
  );
};

// Function to get cached data
export const getCachedProducts = () => cachedProducts;
export const getCachedCategories = () => cachedCategories;

// Function to set cached data
export const setCachedProducts = (products: Product[]) => {
  cachedProducts = products;
  lastLoadTime = Date.now();
};

export const setCachedCategories = (categories: Category[]) => {
  cachedCategories = categories;
};
