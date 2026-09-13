"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LibraryBig,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Books",
      href: "/admin/books",
      icon: BookOpen,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Borrowings",
      href: "/admin/borrowings",
      icon: LibraryBig,
    },
  ];

  return (
    <aside className="min-h-screen w-64 border-r border-zinc-200 bg-white p-6">
      <h1 className="mb-10 text-2xl font-bold text-zinc-900">
        Library Admin
      </h1>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Icon size={19} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}