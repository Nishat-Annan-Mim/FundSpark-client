"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import axiosInstance from "@/lib/axios";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    if (session?.user) {
      // Sync user to Express users collection if not already synced
      // (safe to call repeatedly — server checks for existing user)
      axiosInstance.post("/users/sync", {
        name: session.user.name,
        email: session.user.email,
        photoURL: session.user.image || "",
        role: "supporter", // default role for Google sign-ups
      });
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return <div>{children}</div>;
}
