"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Contribution {
  _id: string;
  supporter_name: string;
  campaign_title: string;
  contribution_amount: number;
  message: string;
}

interface Campaign {
  _id: string;
  status: string;
  deadline: string;
  amount_raised: number;
}

export default function CreatorHome() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Contribution | null>(null);

  const fetchData = async () => {
    try {
      const [contribRes, campaignRes] = await Promise.all([
        axiosInstance.get("/contributions/pending"),
        axiosInstance.get("/campaigns/my-campaigns"),
      ]);
      setContributions(contribRes.data);
      setCampaigns(campaignRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axiosInstance.put(`/contributions/${id}/approve`);
      toast.success("Contribution approved");
      fetchData();
    } catch (err) {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axiosInstance.put(`/contributions/${id}/reject`);
      toast.success("Contribution rejected, credits refunded");
      fetchData();
    } catch (err) {
      toast.error("Failed to reject");
    }
  };

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(
    (c) => new Date(c.deadline) > new Date(),
  ).length;
  const totalRaised = campaigns.reduce((sum, c) => sum + c.amount_raised, 0);

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Campaigns", value: totalCampaigns },
          { label: "Active Campaigns", value: activeCampaigns },
          { label: "Total Raised (credits)", value: totalRaised },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-slate-100 p-5"
          >
            <p className="text-slate-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold text-slate-800 mb-3">
          Contributions To Review
        </h2>
        {contributions.length === 0 ? (
          <p className="text-slate-400 text-sm">No pending contributions.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="px-4 py-3">Supporter</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-4 py-3 text-slate-700">
                      {c.supporter_name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {c.campaign_title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {c.contribution_amount}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewing(c)}
                        className="text-indigo-600 hover:underline text-xs"
                      >
                        View
                      </button>
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

      {viewing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="font-semibold text-slate-800 mb-3">
              Contribution Details
            </h3>
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-medium">Supporter:</span>{" "}
              {viewing.supporter_name}
            </p>
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-medium">Campaign:</span>{" "}
              {viewing.campaign_title}
            </p>
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-medium">Amount:</span>{" "}
              {viewing.contribution_amount} credits
            </p>
            <p className="text-sm text-slate-600 mb-4">
              <span className="font-medium">Message:</span>{" "}
              {viewing.message || "No message provided"}
            </p>
            <button
              onClick={() => setViewing(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
