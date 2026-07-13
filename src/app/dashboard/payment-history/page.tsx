"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface Withdrawal {
  _id: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: string;
  status: string;
  createdAt: string;
}

export default function PaymentHistoryPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/withdrawals/mine")
      .then((res) => setWithdrawals(res.data))
      .catch(() => setWithdrawals([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">
        Payment History
      </h1>
      {withdrawals.length === 0 ? (
        <p className="text-slate-400">No payment history yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Amount ($)</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(w.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{w.withdrawal_credit}</td>
                  <td className="px-4 py-3 text-slate-600">
                    ${w.withdrawal_amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{w.payment_system}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        w.status === "approved"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}