"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import axiosInstance from "@/lib/axios";
import CheckoutForm from "@/components/dashboard/CheckoutForm";
import toast from "react-hot-toast";

const packages = [
  { credits: 100, price: 10 },
  { credits: 300, price: 25 },
  { credits: 800, price: 60 },
  { credits: 1500, price: 110 },
];

export default function PurchaseCreditPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelect = async (credits: number) => {
    setLoading(true);
    setSelected(credits);
    try {
      const res = await axiosInstance.post("/payments/create-intent", { credits });
      setClientSecret(res.data.clientSecret);
    } catch (err) {
      toast.error("Failed to start payment");
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-slate-800 mb-6">
        Purchase Credit
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {packages.map((pkg) => (
          <motion.button
            key={pkg.credits}
            whileHover={{ scale: 1.03 }}
            onClick={() => handleSelect(pkg.credits)}
            className={`p-4 rounded-xl border text-center transition ${
              selected === pkg.credits
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-200 bg-white hover:border-indigo-200"
            }`}
          >
            <p className="text-lg font-bold text-slate-800">{pkg.credits}</p>
            <p className="text-xs text-slate-500">credits</p>
            <p className="text-indigo-600 font-medium mt-2">${pkg.price}</p>
          </motion.button>
        ))}
      </div>

      {loading && <p className="text-slate-400 text-sm">Preparing checkout...</p>}

      {clientSecret && selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-100 p-6"
        >
          <h2 className="font-semibold text-slate-800 mb-4">
            Complete Payment — {selected} credits
          </h2>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm credits={selected} />
          </Elements>
        </motion.div>
      )}
    </div>
  );
}