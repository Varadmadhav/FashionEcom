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
const STORAGE_KEY = "aurelie_product_catalog_v3";

const sanitizeProduct = (p: Product): Product => {
  const fixUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("1595959183075-c1d09e7e364d")) {
      return "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80";
    }
    if (url.includes("1607990283143-e81e7a2c93ab")) {
      return "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=800&q=80";
    }
    return url;
  };

  const img0 = fixUrl(p.images?.[0]) || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80";
  const img1 = fixUrl(p.images?.[1]) || img0;

  return {
    ...p,
    images: [img0, img1] as [string, string],
    galleryImages: (p.galleryImages || []).map((u) => fixUrl(u)).filter(Boolean),
    addedAt: p.addedAt || new Date().toISOString(),
    badges: p.badges || [],
    occasions: p.occasions || [],
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
      const saved = localStorage.getItem(STORAGE_KEY);
      let localProducts: Product[] = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) localProducts = parsed.map(sanitizeProduct);
        } catch (e) {
          console.error(e);
        }
      }

      if (data && data.length > 0) {
        const sanitizedBackend = data.map(sanitizeProduct);
        // Merge backend items with local items so newly added products are never lost
        const merged = [...sanitizedBackend];
        for (const localP of localProducts) {
          if (!merged.some((m) => m.id === localP.id || m.slug === localP.slug)) {
            merged.unshift(localP);
          }
        }
        setAllProducts(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } else if (localProducts.length > 0) {
        setAllProducts(localProducts);
      }
    } catch (e) {
      console.warn("Backend API not reachable, using local product catalog");
    }
  };

  // Fetch live product catalog on mount
  useEffect(() => {
    loadFromBackend();
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (allProducts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProducts));
    }
  }, [allProducts]);

  const addProduct = async (product: Product) => {
    const sanitized = sanitizeProduct(product);
    
    // Immediate UI & LocalStorage state update
    setAllProducts((prev) => {
      const updated = [sanitized, ...prev.filter((p) => p.id !== sanitized.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      const created = await createProductApi(sanitized);
      setAllProducts((prev) => {
        const updated = prev.map((p) => (p.id === sanitized.id ? sanitizeProduct(created) : p));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.warn("Failed to persist new product to backend API, kept in local storage:", error);
    }
  };

  const removeProduct = async (id: string) => {
    setAllProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      await deleteProductApi(id);
    } catch (error) {
      console.warn(`Failed to delete product ${id} on backend API:`, error);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setAllProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? sanitizeProduct({ ...p, ...updates }) : p));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    try {
      const updated = await updateProductApi(id, updates);
      setAllProducts((prev) => {
        const list = prev.map((p) => (p.id === id ? sanitizeProduct(updated) : p));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        return list;
      });
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
