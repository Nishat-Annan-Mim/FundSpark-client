"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface Contribution {
  _id: string;
  campaign_title: string;
  contribution_amount: number;
  creator_name: string;
  status: string;
  createdAt: string;
}

export default function MyContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchContributions = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/contributions/mine", {
        params: { page: pageNum, limit: 5 },
      });
      setContributions(res.data.contributions);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setContributions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions(page);
  }, [page]);

  const statusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-600";
      case "rejected":
        return "bg-red-50 text-red-600";
      default:
        return "bg-amber-50 text-amber-600";
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">
        My Contributions
      </h1>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : contributions.length === 0 ? (
        <p className="text-slate-400">You haven't made any contributions yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => (
                  <tr key={c._id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {c.campaign_title}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{c.creator_name}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {c.contribution_amount}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-sm rounded-lg ${
                  p === page
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}