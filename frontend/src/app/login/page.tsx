"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiLogin, saveToken } from "../actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [needsMfa, setNeedsMfa] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    try {
      const data = await apiLogin(username, password, needsMfa ? totp : undefined);
      if (data.mfaRequired) {
        setNeedsMfa(true);
        return;
      }
      if (data.accessToken) {
        saveToken(data.accessToken);
        router.push("/dashboard");
      }
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm border rounded p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Login</h1>
        <input className="border p-2 w-full" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="border p-2 w-full" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {needsMfa && (
          <input className="border p-2 w-full" placeholder="MFA 123456" value={totp} onChange={e => setTotp(e.target.value)} />
        )}
        <button className="w-full bg-blue-600 text-white py-2" onClick={submit}>{needsMfa ? "Verify & Login" : "Login"}</button>
        <button className="w-full bg-gray-200 py-2" onClick={() => router.push("/register")}>Create account</button>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </motion.div>
    </div>
  );
}


