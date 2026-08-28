import React, { createContext, useContext, useState, useEffect } from "react";
import { products as defaultProducts, Product } from "@/data/products";
import {
  fetchProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "@/utils/api";

interface ProductStoreContextType {
  allProducts: Product[];
  addProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getNewArrivals: () => Product[];
  getRelatedProducts: (product: Product, limit?: number) => Product[];
  refreshProducts: () => Promise<void>;
}

const ProductStoreContext = createContext<ProductStoreContextType | undefined>(undefined);
const STORAGE_KEY = "aurelie_product_catalog_v2";

const sanitizeProduct = (p: Product): Product => {
  const fixUrl = (url: string) => {
    if (!url || url.includes("1595959183075-c1d09e7e364d")) {
      return "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80";
    }
    if (url.includes("1607990283143-e81e7a2c93ab")) {
      return "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=800&q=80";
    }
    return url;
  };

  return {
    ...p,
    images: [fixUrl(p.images[0]), fixUrl(p.images[1])] as [string, string],
    galleryImages: (p.galleryImages || []).map(fixUrl),
  };
};

export const ProductStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeProduct);
        }
      } catch (e) {
        console.error("Failed to parse saved product catalog:", e);
      }
    }
    return defaultProducts.map(sanitizeProduct);
  });

  const loadFromBackend = async () => {
    try {
      const data = await fetchProducts();
      if (data && data.length > 0) {
        const sanitized = data.map(sanitizeProduct);
        setAllProducts(sanitized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      }
    } catch (e) {
      console.warn("Backend not available yet, utilizing local product store");
    }
  };

  // Fetch initial live product catalog from Express API on mount
  useEffect(() => {
    loadFromBackend();
  }, []);

  // Sync to local storage for offline resiliency
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProducts));
  }, [allProducts]);

  const addProduct = async (product: Product) => {
    const sanitized = sanitizeProduct(product);
    // Optimistic UI update
    setAllProducts((prev) => [sanitized, ...prev]);

    try {
      const created = await createProductApi(sanitized);
      setAllProducts((prev) =>
        prev.map((p) => (p.id === sanitized.id ? sanitizeProduct(created) : p))
      );
    } catch (error) {
      console.warn("Failed to persist new product to backend API:", error);
    }
  };

  const removeProduct = async (id: string) => {
    // Optimistic UI update
    setAllProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteProductApi(id);
    } catch (error) {
      console.warn(`Failed to delete product ${id} on backend API:`, error);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistic UI update
    setAllProducts((prev) =>
      prev.map((p) => (p.id === id ? sanitizeProduct({ ...p, ...updates }) : p))
    );

    try {
      const updated = await updateProductApi(id, updates);
      setAllProducts((prev) =>
        prev.map((p) => (p.id === id ? sanitizeProduct(updated) : p))
      );
    } catch (error) {
      console.warn(`Failed to update product ${id} on backend API:`, error);
    }
  };

  const getProductBySlug = (slug: string) => {
    return allProducts.find((p) => p.slug === slug || p.id === slug);
  };

  const getNewArrivals = () => {
    return allProducts
      .filter((p) => p.badges?.includes("New Arrival") || p.newArrival)
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  };

  const getRelatedProducts = (product: Product, limit = 4) => {
    return allProducts
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  };

  return (
    <ProductStoreContext.Provider
      value={{
        allProducts,
        addProduct,
        removeProduct,
        updateProduct,
        getProductBySlug,
        getNewArrivals,
        getRelatedProducts,
        refreshProducts: loadFromBackend,
      }}
    >
      {children}
    </ProductStoreContext.Provider>
  );
};

export const useProductStore = () => {
  const context = useContext(ProductStoreContext);
  if (!context) {
    throw new Error("useProductStore must be used within a ProductStoreProvider");
  }
  return context;
};
