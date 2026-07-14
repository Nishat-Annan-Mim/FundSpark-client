"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface Report {
  _id: string;
  campaign_title: string;
  reporter_name: string;
  reason: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await axiosInstance.get("/reports/pending");
      setReports(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSuspend = async (id: string) => {
    try {
      await axiosInstance.put(`/reports/${id}/suspend`);
      toast.success("Campaign suspended");
      fetchReports();
    } catch (err) {
      toast.error("Failed to suspend campaign");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this reported campaign?")) return;
    try {
      await axiosInstance.delete(`/reports/${id}/delete-campaign`);
      toast.success("Campaign deleted");
      fetchReports();
    } catch (err) {
      toast.error("Failed to delete campaign");
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">Reports</h1>
      {reports.length === 0 ? (
        <p className="text-slate-400">No reports to review.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Reporter</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r._id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {r.campaign_title}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {r.reporter_name}
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                    {r.reason}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleSuspend(r._id)}
                      className="text-orange-600 hover:underline text-xs font-medium"
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
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
    </div>
  );
}
