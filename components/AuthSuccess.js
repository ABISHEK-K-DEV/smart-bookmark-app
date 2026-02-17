"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthSuccess() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user just logged in (coming from auth callback)
    const justLoggedIn = searchParams.get("login");
    if (justLoggedIn === "success") {
      toast.success("Successfully signed in!");
      // Clean up URL without page reload
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  return null;
}
