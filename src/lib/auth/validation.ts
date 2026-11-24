/**
 * Authentication and input validation utilities
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email address is required." };
  }
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required." };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number." };
  }
  return { valid: true };
}

export function sanitizeRole(role: string): "brand" | "creator" {
  // Security: Admin role can never be self-assigned through public signup!
  if (role === "brand") return "brand";
  return "creator"; // Default to creator
}

export function sanitizeRedirect(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "/dashboard";
  const trimmed = url.trim();

  // Prevent open-redirect vulnerabilities:
  // Must start with '/' and NOT start with '//' (protocol-relative) or contain ':' (scheme injection)
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes(":")) {
    return trimmed;
  }
  return "/dashboard";
}
