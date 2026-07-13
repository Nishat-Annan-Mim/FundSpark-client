"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/auth-client";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { useRouter } from "next/navigation";
import { Menu, X, Coins } from "lucide-react";

export default function Navbar() {
  const { session, dbUser, loading } = useCurrentUser();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">FundSpark</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/campaigns"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              Explore Campaigns
            </Link>

            {!loading && !session && (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            )}

            {!loading && session && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Coins size={14} />
                  {dbUser?.credits ?? 0}
                </div>
                <div className="relative group">
                  <img
                    src={
                      dbUser?.photoURL ||
                      session.user.image ||
                      "https://api.dicebear.com/7.x/initials/svg?seed=" +
                        session.user.name
                    }
                    alt={session.user.name}
                    className="w-9 h-9 rounded-full object-cover cursor-pointer border border-slate-200"
                  />
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                    <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100">
                      {session.user.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            <a
              href="https://github.com/YOUR_USERNAME/YOUR_CLIENT_REPO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-500 hover:text-slate-800 transition"
            >
              Join as Developer
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-100 bg-white"
          >
            <div className="flex flex-col px-4 py-3 gap-3">
              <Link href="/campaigns" onClick={() => setMobileOpen(false)}>
                Explore Campaigns
              </Link>
              {!session ? (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-1.5 text-amber-700 text-sm">
                    <Coins size={14} /> {dbUser?.credits ?? 0} credits
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}

              <a
                href="https://github.com/YOUR_USERNAME/YOUR_CLIENT_REPO"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500"
              >
                Join as Developer
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
