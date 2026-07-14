"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";

interface Campaign {
  _id: string;
  campaign_title: string;
  creator_name: string;
  deadline: string;
  funding_goal: number;
  amount_raised: number;
  campaign_image_url: string;
  category: string;
}

const categories = [
  "all",
  "Technology",
  "Art",
  "Community",
  "Health",
  "Education",
  "Environment",
];

export default function PublicCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/campaigns/explore", {
        params: { category, search },
      });
      setCampaigns(res.data);
    } catch (err) {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchCampaigns(), 300);
    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">
        Explore Campaigns
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Discover projects and causes you can support today.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-slate-400">No campaigns match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition"
            >
              <img
                src={c.campaign_image_url}
                alt={c.campaign_title}
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {c.category}
                </span>
                <h3 className="font-semibold text-slate-800 mt-2 mb-1">
                  {c.campaign_title}
                </h3>
                <p className="text-slate-500 text-xs mb-1">
                  by {c.creator_name}
                </p>
                <p className="text-slate-500 text-xs mb-3">
                  Deadline: {new Date(c.deadline).toLocaleDateString()}
                </p>

                <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (c.amount_raised / c.funding_goal) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {c.amount_raised} / {c.funding_goal} credits raised
                </p>

                <Link
                  href={`/campaigns/${c._id}`}
                  className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
