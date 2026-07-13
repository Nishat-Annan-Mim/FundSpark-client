"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const categories = [
  "Technology",
  "Art",
  "Community",
  "Health",
  "Education",
  "Environment",
];

export default function AddCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaign_title: "",
    campaign_story: "",
    category: categories[0],
    funding_goal: "",
    minimum_contribution: "",
    deadline: "",
    reward_info: "",
    campaign_image_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/campaigns", {
        ...formData,
        funding_goal: Number(formData.funding_goal),
        minimum_contribution: Number(formData.minimum_contribution),
      });
      toast.success("Campaign submitted for approval!");
      router.push("/dashboard/my-campaigns");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-100 p-6"
    >
      <h1 className="text-xl font-semibold text-slate-800 mb-1">
        Add New Campaign
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Your campaign will be visible to supporters after admin approval.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">
            Campaign Title
          </label>
          <input
            type="text"
            name="campaign_title"
            required
            placeholder="Help us build a solar-powered water pump"
            value={formData.campaign_title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">
            Campaign Story
          </label>
          <textarea
            name="campaign_story"
            required
            rows={5}
            placeholder="Describe your project in detail..."
            value={formData.campaign_story}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">
              Funding Goal (credits)
            </label>
            <input
              type="number"
              name="funding_goal"
              required
              min={1}
              value={formData.funding_goal}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">
              Minimum Contribution (credits)
            </label>
            <input
              type="number"
              name="minimum_contribution"
              required
              min={1}
              value={formData.minimum_contribution}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">
            Reward Info
          </label>
          <input
            type="text"
            name="reward_info"
            required
            placeholder="What supporters receive for contributing"
            value={formData.reward_info}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">
            Campaign Image URL
          </label>
          <input
            type="text"
            name="campaign_image_url"
            required
            placeholder="https://..."
            value={formData.campaign_image_url}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Add Campaign"}
        </button>
      </form>
    </motion.div>
  );
}
