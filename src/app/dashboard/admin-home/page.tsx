"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Stats {
  totalSupporters: number;
  totalCreators: number;
  totalCredits: number;
  totalPayments: number;
}

interface Campaign {
  _id: string;
  campaign_title: string;
  creator_name: string;
  funding_goal: number;
  category: string;
}

export default function AdminHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        axiosInstance.get("/users/stats"),
        axiosInstance.get("/campaigns/pending"),
      ]);
      setStats(statsRes.data);
      setPending(pendingRes.data);
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axiosInstance.put(`/campaigns/${id}/approve`);
      toast.success("Campaign approved");
      fetchData();
    } catch (err) {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axiosInstance.put(`/campaigns/${id}/reject`);
      toast.success("Campaign rejected");
      fetchData();
    } catch (err) {
      toast.error("Failed to reject");
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (!stats) return <p className="text-red-500">Failed to load stats.</p>;

  const cards = [
    { label: "Total Supporters", value: stats.totalSupporters },
    { label: "Total Creators", value: stats.totalCreators },
    { label: "Total Available Credits", value: stats.totalCredits },
    { label: "Total Payments Processed", value: stats.totalPayments },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-slate-100 p-5"
          >
            <p className="text-slate-500 text-sm">{c.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{c.value}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3">
          Campaign Approvals
        </h2>
        {pending.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No campaigns pending approval.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Goal</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {c.campaign_title}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {c.creator_name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{c.category}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {c.funding_goal}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleApprove(c._id)}
                        className="text-emerald-600 hover:underline text-xs font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(c._id)}
                        className="text-red-600 hover:underline text-xs font-medium"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
