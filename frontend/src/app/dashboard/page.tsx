"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { apiProfile, clearToken, apiListProducts, apiPurchase, apiListShopping } from "../actions/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        await apiProfile();
      } catch {
        router.push("/login");
        return;
      }

      try {
        const [p, h] = await Promise.all([apiListProducts(), apiListShopping()]);
        setProducts(p);
        setHistory(h);
      } catch {
        // If product/shopping fail, stay on dashboard (auth ok) and show empty lists
      } finally {
        setLoaded(true);
      }
    })();
  }, [router]);

  return (
    <div className="relative min-h-screen grid place-items-center p-6 bg-[radial-gradient(60%_40%_at_20%_20%,#e6f0ff_0%,transparent_70%),radial-gradient(60%_40%_at_80%_20%,#e9ffe6_0%,transparent_70%),radial-gradient(60%_40%_at_50%_80%,#ffe6e6_0%,transparent_70%)]">
      <button
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow"
        onClick={() => { clearToken(); router.push("/login"); }}
      >
        Logout
      </button>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: loaded ? 1 : 0.4, y: loaded ? 0 : 10 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl border rounded-2xl p-8 bg-white/80 backdrop-blur shadow-lg text-center"
      >
        <div className="flex justify-center mb-6">
          <img src="/image.png" alt="UMG Logo" className="h-24 w-auto" />
        </div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Products</h2>
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-600">${p.price} · stock {p.stock}</div>
                  </div>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={async () => {
                      await apiPurchase(p.id, 1);
                      const [p2, h2] = await Promise.all([apiListProducts(), apiListShopping()]);
                      setProducts(p2);
                      setHistory(h2);
                    }}
                    disabled={p.stock <= 0}
                  >
                    Buy 1
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Shopping History</h2>
            <div className="space-y-2 max-h-80 overflow-auto">
              {history.map((o) => (
                <div key={o.id} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium">{o.name}</div>
                    <div className="text-sm text-gray-600">{o.quantity} × ${o.price}</div>
                  </div>
                  <div className="text-sm">${(o.quantity * o.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


