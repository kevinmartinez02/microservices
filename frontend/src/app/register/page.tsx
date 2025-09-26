"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiLogin, apiMfaSetup, apiMfaVerify, apiRegister, saveToken } from "../actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "qr">("form");

  async function submit() {
    setError("");
    try {
      await apiRegister(username, password);
      const loginData = await apiLogin(username, password);
      if (!loginData?.accessToken) throw new Error("Auto login failed");
      saveToken(loginData.accessToken);
      const setup = await apiMfaSetup();
      setQr(setup.qrDataUrl);
      setStep("qr");
    } catch (e: any) {
      setError(e.message || "Register failed");
    }
  }

  async function verify() {
    setError("");
    try {
      const result = await apiMfaVerify(code);
      if (result.success) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setError("Código inválido");
      }
    } catch (e: any) {
      setError(e.message || "Verification failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm border rounded p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Register</h1>
        {step === "form" ? (
          <>
            <input className="border p-2 w-full" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
            <input className="border p-2 w-full" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-blue-600 text-white py-2" onClick={submit}>Create account</button>
            <button className="w-full bg-gray-200 py-2" onClick={() => router.push("/login")}>Back to login</button>
          </>
        ) : (
          <>
            {qr && <img src={qr} alt="MFA QR" />}
            <p className="text-sm text-gray-600 text-center">Escanea con Microsoft Authenticator y escribe el código</p>
            <input className="border p-2 w-full" placeholder="123456" value={code} onChange={e => setCode(e.target.value)} />
            <button className="w-full bg-blue-600 text-white py-2" onClick={verify}>Verify & Continue</button>
          </>
        )}
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </motion.div>
    </div>
  );
}


