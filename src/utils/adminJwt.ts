// JWT Token Utility for Aurelie Admin Panel

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Store Manager" | "Inventory Admin";
  avatar: string;
  lastActive?: string;
  createdAt: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp (24h)
  iss: string;
}

// Initial Admin Team Database
export const INITIAL_ADMINS: (AdminUser & { passwordHash: string })[] = [
  {
    id: "adm-001",
    name: "Aisha Kapoor",
    email: "aisha@aurelie.com",
    role: "Super Admin",
    avatar: "AK",
    lastActive: "Just now",
    createdAt: "2024-01-15",
    passwordHash: "aisha2026", // Simulated hash match
  },
  {
    id: "adm-002",
    name: "Aaditya Chauhan",
    email: "admin@aurelie.com",
    role: "Super Admin",
    avatar: "AC",
    lastActive: "10 mins ago",
    createdAt: "2024-02-01",
    passwordHash: "admin2026",
  },
  {
    id: "adm-003",
    name: "Varad Madhav",
    email: "varad@aurelie.com",
    role: "Store Manager",
    avatar: "VM",
    lastActive: "2 hours ago",
    createdAt: "2024-03-10",
    passwordHash: "varad2026",
  },
];

// Helper functions for Base64Url encoding/decoding
function base64UrlEncode(str: string): string {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(escape(atob(base64)));
}

// Simple deterministic HMAC-SHA256 signature simulation for client-side JWT
function generateSignature(header: string, payload: string, secret: string): string {
  const data = `${header}.${payload}.${secret}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return base64UrlEncode(Math.abs(hash).toString(16));
}

const JWT_SECRET = "aurelie_luxury_fashion_admin_secret_key_2026";

/**
 * Creates a signed JWT string for an authenticated AdminUser
 */
export function createAdminJwt(user: AdminUser): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payloadData: JwtPayload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    iat: now,
    exp: now + 24 * 60 * 60, // 24 Hours validity
    iss: "aurelie-auth-server",
  };
  const payload = base64UrlEncode(JSON.stringify(payloadData));
  const signature = generateSignature(header, payload, JWT_SECRET);

  return `${header}.${payload}.${signature}`;
}

/**
 * Verifies a JWT token, checks expiration, and returns the decoded payload or null
 */
export function verifyAdminJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = generateSignature(header, payload, JWT_SECRET);

    if (signature !== expectedSignature) {
      console.warn("Invalid JWT Signature");
      return null;
    }

    const decodedPayload: JwtPayload = JSON.parse(base64UrlDecode(payload));
    const now = Math.floor(Date.now() / 1000);

    if (decodedPayload.exp < now) {
      console.warn("JWT Token has expired");
      return null;
    }

    return decodedPayload;
  } catch (error) {
    console.error("JWT Verification error:", error);
    return null;
  }
}
