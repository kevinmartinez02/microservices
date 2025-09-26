"use client";

export async function apiRegister(username: string, password: string) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function apiLogin(username: string, password: string, totp?: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, totp }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}

export function clearToken() {
  localStorage.removeItem("token");
}

export async function apiProfile() {
  const token = getToken();
  const res = await fetch("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Profile failed");
  return res.json();
}

export async function apiListProducts() {
  const token = getToken();
  const res = await fetch("/api/products", { headers: { Authorization: `Bearer ${token}` } });
  console.log(res);
  if (!res.ok) throw new Error("Products failed");
  return res.json();
}

export async function apiListShopping() {
  const token = getToken();
  const res = await fetch("/api/shopping", { headers: { Authorization: `Bearer ${token}` } });
  console.log(res);
  if (!res.ok) throw new Error("Shopping failed");
  return res.json();
}

export async function apiPurchase(productId: number, quantity: number) {
  const token = getToken();
  const res = await fetch("/api/shopping/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error("Purchase failed");
  return res.json();
}

export async function apiMfaSetup() {
  const token = getToken();
  const res = await fetch("/api/auth/mfa/setup", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("MFA setup failed");
  return res.json();
}

export async function apiMfaVerify(code: string) {
  const token = getToken();
  const res = await fetch("/api/auth/mfa/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ token: code }),
  });
  if (!res.ok) throw new Error("MFA verify failed");
  return res.json();
}


