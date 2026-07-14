"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_story: string;
  category: string;
  funding_goal: number;
  minimum_contribution: number;
  deadline: string;
  reward_info: string;
  campaign_image_url: string;
  amount_raised: number;
  creator_name: string;
  status: string;
}

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReportBox, setShowReportBox] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch(() => toast.error("Campaign not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    setSubmitting(true);
    try {
      await axiosInstance.post("/contributions", {
        campaign_id: campaign._id,
        contribution_amount: Number(amount),
        message,
      });
      toast.success("Contribution submitted, pending creator approval");
      setAmount("");
      setMessage("");
      router.push("/dashboard/my-contributions");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Contribution failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;
    try {
      await axiosInstance.post("/reports", {
        campaign_id: campaign._id,
        reason: reportReason,
      });
      toast.success("Report submitted to admin");
      setReportReason("");
      setShowReportBox(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (!campaign) return <p className="text-red-500">Campaign not found.</p>;

  const isExpired = new Date(campaign.deadline) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <img
        src={campaign.campaign_image_url}
        alt={campaign.campaign_title}
        className="w-full h-64 object-cover rounded-xl mb-6"
      />

      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
        {campaign.category}
      </span>
      <h1 className="text-2xl font-bold text-slate-800 mt-3 mb-1">
        {campaign.campaign_title}
      </h1>
      <p className="text-slate-500 text-sm mb-5">by {campaign.creator_name}</p>

      <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
        <div
          className="bg-indigo-600 h-2.5 rounded-full"
          style={{
            width: `${Math.min(
              (campaign.amount_raised / campaign.funding_goal) * 100,
              100,
            )}%`,
          }}
        />
      </div>
      <div className="flex justify-between text-sm text-slate-500 mb-6">
        <span>{campaign.amount_raised} raised</span>
        <span>Goal: {campaign.funding_goal}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-2">Campaign Story</h2>
        <p className="text-slate-600 text-sm whitespace-pre-line">
          {campaign.campaign_story}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5 mb-6">
        <h2 className="font-semibold text-slate-800 mb-2">Reward</h2>
        <p className="text-slate-600 text-sm">{campaign.reward_info}</p>
        <p className="text-slate-400 text-xs mt-3">
          Deadline: {new Date(campaign.deadline).toLocaleDateString()}
        </p>
        <p className="text-slate-400 text-xs">
          Minimum contribution: {campaign.minimum_contribution} credits
        </p>
      </div>

      <div className="mb-6">
        {!showReportBox ? (
          <button
            onClick={() => setShowReportBox(true)}
            className="text-xs text-red-500 hover:underline"
          >
            Report this campaign as suspicious or fraudulent
          </button>
        ) : (
          <form
            onSubmit={handleReport}
            className="bg-red-50 rounded-lg p-4 space-y-2"
          >
            <textarea
              required
              rows={2}
              placeholder="Describe why this campaign seems suspicious..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
              >
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => setShowReportBox(false)}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {isExpired ? (
        <p className="text-center text-slate-400 py-4">
          This campaign's deadline has passed.
        </p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h2 className="font-semibold text-slate-800 mb-3">
            Support This Campaign
          </h2>
          <form onSubmit={handleContribute} className="space-y-3">
            <input
              type="number"
              required
              min={campaign.minimum_contribution}
              placeholder={`Minimum ${campaign.minimum_contribution} credits`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Add a message for the creator (optional)"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Contribute"}
            </button>
          </form>
        </div>
      )}
    </motion.div>
  );
}
