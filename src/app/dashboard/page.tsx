"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import axiosInstance from "@/lib/axios";

export default function DashboardIndex() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await axiosInstance.get(`/users/${session.user.email}`);
        const role = res.data.role;
        router.replace(`/dashboard/${role}-home`);
      } catch {
        router.replace("/login");
      }
    };
    redirect();
  }, [session, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-slate-500">Redirecting...</p>
    </div>
  );
}