"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_story: string;
  reward_info: string;
  category: string;
  funding_goal: number;
  amount_raised: number;
  deadline: string;
  status: string;
}

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [editForm, setEditForm] = useState({
    campaign_title: "",
    campaign_story: "",
    reward_info: "",
  });

  const fetchCampaigns = async () => {
    try {
      const res = await axiosInstance.get("/campaigns/my-campaigns");
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

  const openEdit = (campaign: Campaign) => {
    setEditing(campaign);
    setEditForm({
      campaign_title: campaign.campaign_title,
      campaign_story: campaign.campaign_story,
      reward_info: campaign.reward_info,
    });
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      await axiosInstance.put(`/campaigns/${editing._id}`, editForm);
      toast.success("Campaign updated");
      setEditing(null);
      fetchCampaigns();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this campaign? Approved supporters will be refunded.")) return;
    try {
      await axiosInstance.delete(`/campaigns/${id}`);
      toast.success("Campaign deleted, refunds issued");
      fetchCampaigns();
    } catch (err) {
      toast.error("Delete failed");
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
      <h1 className="text-xl font-semibold text-slate-800 mb-6">My Campaigns</h1>

      {campaigns.length === 0 ? (
        <p className="text-slate-400">You haven't created any campaigns yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Raised / Goal</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {c.campaign_title}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.category}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {c.amount_raised} / {c.funding_goal}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(c.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-indigo-600 hover:underline text-xs font-medium"
                    >
                      Update
                    </button>
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
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-lg"
          >
            <h2 className="font-semibold text-slate-800 mb-4">Update Campaign</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={editForm.campaign_title}
                onChange={(e) =>
                  setEditForm({ ...editForm, campaign_title: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                placeholder="Campaign Title"
              />
              <textarea
                rows={4}
                value={editForm.campaign_story}
                onChange={(e) =>
                  setEditForm({ ...editForm, campaign_story: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                placeholder="Campaign Story"
              />
              <input
                type="text"
                value={editForm.reward_info}
                onChange={(e) =>
                  setEditForm({ ...editForm, reward_info: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                placeholder="Reward Info"
              />
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}