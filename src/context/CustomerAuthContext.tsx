import React, { createContext, useContext, useState, useEffect } from "react";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "blocked";
  cart?: any[];
  addresses?: any[];
}

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string, newPassword?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: "login" | "register" | "forgot") => void;
  closeAuthModal: () => void;
  authModalMode: "login" | "register" | "forgot";
  setAuthModalMode: (mode: "login" | "register" | "forgot") => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);
const CUSTOMER_TOKEN_KEY = "aurelie_customer_jwt";
const CUSTOMER_DATA_KEY = "aurelie_customer_data";

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  });

  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem(CUSTOMER_DATA_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | "forgot">("login");

  const openAuthModal = (mode: "login" | "register" | "forgot" = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.message || "Failed to sign in" };
      }

      localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
      localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(data.customer));

      setToken(data.token);
      setCustomer(data.customer);
      setIsAuthModalOpen(false);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error. Please try again." };
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pass, phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.message || "Failed to create account" };
      }

      localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
      localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(data.customer));

      setToken(data.token);
      setCustomer(data.customer);
      setIsAuthModalOpen(false);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error. Please try again." };
    }
  };

  const forgotPassword = async (email: string, newPassword?: string) => {
    try {
      const res = await fetch("/api/customer/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.message || "Failed to process password reset" };
      }

      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_DATA_KEY);
    setToken(null);
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: !!customer && !!token,
        login,
        register,
        forgotPassword,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
};
