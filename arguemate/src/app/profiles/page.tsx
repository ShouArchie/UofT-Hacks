"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function ProfilesPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <NavBar />
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin text-[#FF8D58]">Loading...</div>
        </div>
      </>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 px-4 pt-20">
        <h1 className="text-3xl font-bold mb-8">Profiles</h1>
        {/* Add profile content here */}
      </div>
    </>
  );
}
