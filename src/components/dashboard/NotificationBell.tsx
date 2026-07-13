"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

interface Notification {
  _id: string;
  message: string;
  actionRoute: string;
  time: string;
  read: boolean;
}

export default function NotificationBell({
  notifications = [],
}: {
  notifications?: Notification[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition"
      >
        <Bell size={20} className="text-slate-600" />
        {notifications.length > 0 && (
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
