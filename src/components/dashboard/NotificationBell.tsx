"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface Notification {
  _id: string;
  message: string;
  actionRoute: string;
  time: string;
  read: boolean;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications/mine");
      setNotifications(res.data);
    } catch (err) {
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s so new notifications appear without a full page refresh
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && unreadCount > 0) {
      try {
        await axiosInstance.put("/notifications/mark-read");
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        // fail silently, not critical
      }
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-slate-100 transition"
      >
        <Bell size={20} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 max-h-96 overflow-y-auto z-50">
          <div className="px-4 py-3 border-b border-slate-100 font-medium text-slate-700">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-400 px-4 py-6 text-center">
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <a
                key={n._id}
                href={n.actionRoute}
                className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-b border-slate-50 last:border-0"
              >
                {n.message}
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(n.time).toLocaleString()}
                </div>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
