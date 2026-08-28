import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AdminUser,
  JwtPayload,
  INITIAL_ADMINS,
  createAdminJwt,
  verifyAdminJwt,
} from "@/utils/adminJwt";

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  adminList: AdminUser[];
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addAdmin: (newAdmin: Omit<AdminUser, "id" | "createdAt" | "lastActive"> & { password: string }) => boolean;
  removeAdmin: (id: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("aurelie_admin_jwt");
  });

  const [adminList, setAdminList] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem("aurelie_admin_list");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ADMINS.map(({ passwordHash, ...user }) => user);
  });

  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const savedToken = localStorage.getItem("aurelie_admin_jwt");
    if (savedToken) {
      const payload: JwtPayload | null = verifyAdminJwt(savedToken);
      if (payload) {
        return {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role as AdminUser["role"],
          avatar: payload.avatar,
          createdAt: "2024-01-15",
          lastActive: "Active Now",
        };
      }
    }
    return null;
  });

  useEffect(() => {
    if (token) {
      const payload = verifyAdminJwt(token);
      if (!payload) {
        // Expired or tampered token
        logout();
      }
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    // Check against INITIAL_ADMINS (or persistent storage)
    const storedAdminsWithPass = (() => {
      const savedPasses = localStorage.getItem("aurelie_admin_passes");
      let customMap: Record<string, string> = {};
      if (savedPasses) {
        try {
          customMap = JSON.parse(savedPasses);
        } catch (e) {
          console.error(e);
        }
      }
      return INITIAL_ADMINS.map((u) => ({
        ...u,
        passwordHash: customMap[u.email] || u.passwordHash,
      }));
    })();

    const foundUser = storedAdminsWithPass.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!foundUser) {
      return { success: false, error: "No admin account found with this email." };
    }

    if (foundUser.passwordHash !== pass) {
      return { success: false, error: "Invalid password credentials." };
    }

    const { passwordHash, ...cleanUser } = foundUser;
    const jwtToken = createAdminJwt(cleanUser);

    localStorage.setItem("aurelie_admin_jwt", jwtToken);
    setToken(jwtToken);
    setAdmin({
      ...cleanUser,
      lastActive: "Active Now",
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("aurelie_admin_jwt");
    setToken(null);
    setAdmin(null);
  };

  const addAdmin = (
    newAdminData: Omit<AdminUser, "id" | "createdAt" | "lastActive"> & { password: string }
  ) => {
    const newId = `adm-${String(adminList.length + 1).padStart(3, "0")}`;
    const initials = newAdminData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const newUser: AdminUser = {
      id: newId,
      name: newAdminData.name,
      email: newAdminData.email,
      role: newAdminData.role,
      avatar: initials || "AD",
      lastActive: "Just added",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedList = [...adminList, newUser];
    setAdminList(updatedList);
    localStorage.setItem("aurelie_admin_list", JSON.stringify(updatedList));

    // Save custom pass
    const savedPasses = localStorage.getItem("aurelie_admin_passes");
    let passMap: Record<string, string> = savedPasses ? JSON.parse(savedPasses) : {};
    passMap[newAdminData.email] = newAdminData.password;
    localStorage.setItem("aurelie_admin_passes", JSON.stringify(passMap));

    return true;
  };

  const removeAdmin = (id: string) => {
    const updated = adminList.filter((a) => a.id !== id);
    setAdminList(updated);
    localStorage.setItem("aurelie_admin_list", JSON.stringify(updated));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin && !!token,
        adminList,
        login,
        logout,
        addAdmin,
        removeAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
