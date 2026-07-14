"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Withdrawal {
  _id: string;
  creator_name: string;
  creator_email: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: string;
  account_number: string;
  createdAt: string;
}

export default function WithdrawalRequestsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      const res = await axiosInstance.get("/withdrawals/pending");
      setWithdrawals(res.data);
    } catch (err) {
      toast.error("Failed to load withdrawal requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handlePaymentSuccess = async (id: string) => {
    try {
      await axiosInstance.put(`/withdrawals/${id}/approve`);
      toast.success("Payment marked as successful");
      fetchWithdrawals();
    } catch (err) {
      toast.error("Failed to process payment");
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">
        Withdrawal Requests
      </h1>
      {withdrawals.length === 0 ? (
        <p className="text-slate-400">No pending withdrawal requests.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Amount ($)</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Account No.</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr
                  key={w._id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="px-4 py-3 text-slate-700">
                    <p className="font-medium">{w.creator_name}</p>
                    <p className="text-xs text-slate-400">{w.creator_email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {w.withdrawal_credit}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    ${w.withdrawal_amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {w.payment_system}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {w.account_number}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handlePaymentSuccess(w._id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    >
                      Payment Success
                    </button>
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
