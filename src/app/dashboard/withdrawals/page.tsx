"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

export default function WithdrawalsPage() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState(0);
  const [form, setForm] = useState({
    withdrawal_credit: "",
    payment_system: "Stripe",
    account_number: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchCredits = async () => {
    if (!session?.user?.email) return;
    const res = await axiosInstance.get(`/users/${session.user.email}`);
    setCredits(res.data.credits);
  };

  useEffect(() => {
    fetchCredits();
  }, [session]);

  const withdrawalAmountDollars = form.withdrawal_credit
    ? (Number(form.withdrawal_credit) / 20).toFixed(2)
    : "0.00";

  const canWithdraw = credits >= 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/withdrawals", {
        withdrawal_credit: Number(form.withdrawal_credit),
        payment_system: form.payment_system,
        account_number: form.account_number,
      });
      toast.success("Withdrawal request submitted");
      setForm({
        withdrawal_credit: "",
        payment_system: "Stripe",
        account_number: "",
      });
      fetchCredits();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-xl border border-slate-100 p-5 mb-6">
        <p className="text-slate-500 text-sm">Total Raised Credits</p>
        <p className="text-2xl font-bold text-slate-800">{credits}</p>
        <p className="text-slate-400 text-xs mt-1">
          Withdrawable amount: ${(credits / 20).toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h2 className="font-semibold text-slate-800 mb-4">
          Request Withdrawal
        </h2>

        {!canWithdraw ? (
          <p className="text-sm text-slate-400">
            Insufficient credit. You need at least 200 credits ($10) to
            withdraw.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Credits To Withdraw
              </label>
              <input
                type="number"
                required
                min={200}
                max={credits}
                value={form.withdrawal_credit}
                onChange={(e) =>
                  setForm({ ...form, withdrawal_credit: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Withdraw Amount ($)
              </label>
              <input
                type="text"
                readOnly
                value={withdrawalAmountDollars}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Payment System
              </label>
              <select
                value={form.payment_system}
                onChange={(e) =>
                  setForm({ ...form, payment_system: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Stripe">Stripe</option>
                <option value="Bkash">Bkash</option>
                <option value="Rocket">Rocket</option>
                <option value="Nagad">Nagad</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Account Number
              </label>
              <input
                type="text"
                required
                value={form.account_number}
                onChange={(e) =>
                  setForm({ ...form, account_number: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Withdraw"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
