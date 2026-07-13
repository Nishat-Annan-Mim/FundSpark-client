"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";

interface Contribution {
  _id: string;
  contribution_amount: number;
  status: string;
}

export default function SupporterHome() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/contributions/mine", { params: { page: 1, limit: 1000 } })
      .then((res) => setContributions(res.data.contributions))
      .catch(() => setContributions([]))
      .finally(() => setLoading(false));
  }, []);

  const totalContributions = contributions.length;
  const pendingCount = contributions.filter((c) => c.status === "pending").length;
  const totalAmount = contributions
    .filter((c) => c.status === "approved")
    .reduce((sum, c) => sum + c.contribution_amount, 0);

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label: "Total Contributions", value: totalContributions },
        { label: "Pending Contributions", value: pendingCount },
        { label: "Total Amount Contributed", value: totalAmount },
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
  );
}