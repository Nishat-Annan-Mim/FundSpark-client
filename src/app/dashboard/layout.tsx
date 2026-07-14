"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import axiosInstance from "@/lib/axios";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { Menu } from "lucide-react";

interface DbUser {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: "supporter" | "creator" | "admin";
  credits: number;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    const syncAndFetch = async () => {
      if (!session?.user?.email) return;
      try {
        await axiosInstance.post("/users/sync", {
          name: session.user.name,
          email: session.user.email,
          photoURL: session.user.image || "",
          role: "supporter",
        });
        const res = await axiosInstance.get(`/users/${session.user.email}`);
        setDbUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoadingUser(false);
      }
    };

    if (!isPending && session) {
      syncAndFetch();
    }
  }, [session, isPending, router]);

  if (isPending || loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load user data.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dashboard top bar */}
      <div className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-slate-100 bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <span className="font-semibold text-slate-800">Dashboard</span>
        </div>

        <NotificationBell />
      </div>

      <div className="flex flex-1">
        <Sidebar role={dbUser.role} />
        <MobileSidebar
          role={dbUser.role}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 p-4 md:p-6 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
