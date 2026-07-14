"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Campaign {
  _id: string;
  campaign_title: string;
  creator_name: string;
  category: string;
  funding_goal: number;
  amount_raised: number;
  status: string;
}

export default function ManageCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const res = await axiosInstance.get("/campaigns/all");
      setCampaigns(res.data);
    } catch (err) {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign? Approved supporters will be refunded."))
      return;
    try {
      await axiosInstance.delete(`/campaigns/${id}/admin-delete`);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch (err) {
      toast.error("Failed to delete campaign");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-600";
      case "rejected":
        return "bg-red-50 text-red-600";
      case "suspended":
        return "bg-orange-50 text-orange-600";
      default:
        return "bg-amber-50 text-amber-600";
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">
        Manage Campaigns
      </h1>
      <div className="overflow-x-auto bg-white rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Creator</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Raised / Goal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr
                key={c._id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-slate-700">
                  {c.campaign_title}
                </td>
                <td className="px-4 py-3 text-slate-500">{c.creator_name}</td>
                <td className="px-4 py-3 text-slate-500">{c.category}</td>
                <td className="px-4 py-3 text-slate-500">
                  {c.amount_raised} / {c.funding_goal}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(
                      c.status,
                    )}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 hover:underline text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
