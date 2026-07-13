"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/lib/dashboardNav";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function MobileSidebar({
  role,
  open,
  onClose,
}: {
  role: "supporter" | "creator" | "admin";
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const navItems = dashboardNav[role] || [];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 p-4 md:hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-slate-800">Menu</span>
              <button onClick={onClose}>
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}