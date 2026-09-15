"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LibraryBig,
  Library,
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
    <aside className="min-h-screen w-56 border-r border-[#e5d8cc] bg-[#f7f1eb] px-4 py-6">
      {/* Logo / Brand */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#efe3d8]">
          <Library
            size={23}
            className="text-[#765448]"
          />
        </div>

        <div>
          <h1 className="text-lg font-bold text-stone-900">
            Library
          </h1>

          <p className="text-xs text-stone-500">
            Admin Panel
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          const isActive =
            pathname === link.href ||
            pathname.startsWith(
              `${link.href}/`
            );

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#eadbcc] text-[#6f4d3d]"
                  : "text-stone-600 hover:bg-[#eee5dc] hover:text-stone-900"
              }`}
            >
              <Icon size={19} />

              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-10">
        <div className="rounded-2xl border border-[#e4d6ca] bg-[#f1e7dd] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
            <LibraryBig
              size={21}
              className="text-[#765448]"
            />
          </div>

          <p className="mt-3 text-sm font-semibold text-stone-800">
            Manage your library
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            Books, users and borrowing activity
            in one place.
          </p>
        </div>
      </div>
    </aside>
  );
}