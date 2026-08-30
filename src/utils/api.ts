import { Product } from "@/data/products";

export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : import.meta.env.DEV
  ? "/api"
  : "https://fashionecom-backend-8s4m.onrender.com/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  count?: number;
  data?: T;
  token?: string;
  user?: any;
  id?: string;
  url?: string;
}

/**
 * Helper to get stored Admin JWT Auth token
 */
export const getStoredAdminToken = (): string | null => {
  return localStorage.getItem("aurelie_admin_jwt");
};

/**
 * Fetch all products from Express Backend
 */
export const fetchProducts = async (params?: {
  category?: string;
  search?: string;
  badge?: string;
  sort?: string;
}): Promise<Product[]> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append("category", params.category);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.badge) searchParams.append("badge", params.badge);
    if (params?.sort) searchParams.append("sort", params.sort);

    const queryString = searchParams.toString();
    const url = `${API_BASE}/products${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: ApiResponse<Product[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn("API fetch error, falling back to local catalog:", error);
    throw error;
  }
};

/**
 * Fetch single product by slug from Express Backend
 */
export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    if (!res.ok) return null;
    const json: ApiResponse<Product> = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`API error fetching product ${slug}:`, error);
    return null;
  }
};

/**
 * Create new product via Express Backend REST API
 */
export const createProductApi = async (
  product: Partial<Product>
): Promise<Product> => {
  const token = getStoredAdminToken();
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || `Failed to create product (${res.status})`);
  }

  const json: ApiResponse<Product> = await res.json();
  return json.data!;
};

/**
 * Update product via Express Backend REST API
 */
export const updateProductApi = async (
  id: string,
  updates: Partial<Product>
): Promise<Product> => {
  const token = getStoredAdminToken();
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || `Failed to update product (${res.status})`);
  }

  const json: ApiResponse<Product> = await res.json();
  return json.data!;
};

/**
 * Delete product via Express Backend REST API
 */
export const deleteProductApi = async (id: string): Promise<boolean> => {
  const token = getStoredAdminToken();
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.message || `Failed to delete product (${res.status})`);
  }

  return true;
};

/**
 * Upload image file to Cloudinary via Express Backend
 */
export const uploadImageApi = async (file: File | string): Promise<string> => {
  const token = getStoredAdminToken();

  if (typeof file === "string") {
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ imageBase64: file }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to upload base64 image");
    }

    const data: ApiResponse = await res.json();
    return data.url!;
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to upload image file");
  }

  const data: ApiResponse = await res.json();
  return data.url!;
};

/**
 * Place a new order
 */
export const createOrderApi = async (orderData: {
  customer: string;
  email: string;
  items: string;
  total: number;
}) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    throw new Error("Failed to place order");
  }

  return await res.json();
};

/**
 * Admin Login via Express Backend
 */
export const loginAdminApi = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Invalid login credentials");
  }

  const data: ApiResponse = await res.json();
  if (data.token) {
    localStorage.setItem("aurelie_admin_jwt", data.token);
  }
  return data;
};
