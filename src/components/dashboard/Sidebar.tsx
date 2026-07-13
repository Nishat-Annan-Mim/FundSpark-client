"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/lib/dashboardNav";
import { motion } from "framer-motion";

export default function Sidebar({
  role,
}: {
  role: "supporter" | "creator" | "admin";
}) {
  const pathname = usePathname();
  const navItems = dashboardNav[role] || [];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-100 bg-white h-[calc(100vh-64px)] sticky top-16 p-4">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition relative ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r"
                />
              )}
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}