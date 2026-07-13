"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import axiosInstance from "@/lib/axios";

interface DbUser {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: "supporter" | "creator" | "admin";
  credits: number;
}

export function useCurrentUser() {
  const { data: session, isPending: sessionPending } = useSession();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDbUser = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await axiosInstance.get(`/users/${session.user.email}`);
        setDbUser(res.data);
      } catch (err) {
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (!sessionPending) {
      fetchDbUser();
    }
  }, [session, sessionPending]);

  return {
    session,
    dbUser,
    loading: sessionPending || loading,
  };
}
