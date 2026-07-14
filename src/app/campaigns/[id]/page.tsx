"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { useSession } from "@/lib/auth-client";
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
}

export default function PublicCampaignDetailsPage() {
  const { id } = useParams();
  const { data: session, isPending } = useSession();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch(() => toast.error("Campaign not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-slate-500 p-8">Loading...</p>;
  if (!campaign) return <p className="text-red-500 p-8">Campaign not found.</p>;

  const isExpired = new Date(campaign.deadline) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
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

      {isExpired ? (
        <p className="text-center text-slate-400 py-4">
          This campaign's deadline has passed.
        </p>
      ) : isPending ? null : !session ? (
        <div className="bg-indigo-50 rounded-xl p-6 text-center">
          <p className="text-slate-600 text-sm mb-3">
            Log in as a Supporter to contribute to this campaign.
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
          >
            Login to Contribute
          </Link>
        </div>
      ) : (
        <div className="bg-indigo-50 rounded-xl p-6 text-center">
          <p className="text-slate-600 text-sm mb-3">
            Go to your dashboard to contribute to this campaign.
          </p>
          <Link
            href={`/dashboard/explore/${campaign._id}`}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
          >
            Contribute Now
          </Link>
        </div>
      )}
    </motion.div>
  );
}
