"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: string;
  credits: number;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users/all");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await axiosInstance.put(`/users/${id}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this user permanently?")) return;
    try {
      await axiosInstance.delete(`/users/${id}`);
      toast.success("User removed");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to remove user");
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800 mb-6">
        Manage Users
      </h1>
      <div className="overflow-x-auto bg-white rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  <img
                    src={
                      u.photoURL ||
                      "https://api.dicebear.com/7.x/initials/svg?seed=" + u.name
                    }
                    className="w-7 h-7 rounded-full object-cover"
                    alt={u.name}
                  />
                  {u.name}
                </td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3 text-slate-500">{u.credits}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="supporter">Supporter</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleRemove(u._id)}
                    className="text-red-600 hover:underline text-xs font-medium"
                  >
                    Remove
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
