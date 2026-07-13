"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axiosInstance from "@/lib/axios";

interface Campaign {
  _id: string;
  campaign_title: string;
  campaign_image_url: string;
  amount_raised: number;
}

export default function TopCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/campaigns/top")
      .then((res) => setCampaigns(res.data))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">
          Top Funded Campaigns
        </h2>
        <p className="text-slate-500 mt-2">
          See what the community is rallying behind right now.
        </p>
      </div>

      {loading ? (
        <p className="text-center text-slate-400">Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-center text-slate-400">
          No campaigns yet — be the first to launch one!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition"
            >
              <img
                src={c.campaign_image_url}
                alt={c.campaign_title}
                className="w-full h-44 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-1">
                  {c.campaign_title}
                </h3>
                <p className="text-indigo-600 font-medium text-sm">
                  {c.amount_raised} credits raised
                </p>
                <Link
                  href={`/campaigns/${c._id}`}
                  className="text-sm text-slate-500 hover:text-indigo-600 mt-2 inline-block"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}