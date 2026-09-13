"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="
        flex
        items-center
        gap-2
        rounded-lg
        bg-zinc-900
        px-4
        py-2
        text-sm
        font-medium
        text-white
        transition
        hover:bg-zinc-800
      "
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}