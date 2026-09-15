"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "ADMIN" | "USER";

type StoredUser = {
  role: UserRole;
};

export default function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: UserRole;
}) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const user: StoredUser = JSON.parse(storedUser);

      if (user.role !== allowedRole) {
        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (user.role === "USER") {
          router.replace("/user/dashboard");
        } else {
          router.replace("/login");
        }

        return;
      }

      setIsChecking(false);
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      router.replace("/login");
    }
  }, [router, allowedRole]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f4ef]">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e7ddd4] border-t-[#8a624d]" />

          <p className="mt-4 text-sm text-stone-500">
            Checking access...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}