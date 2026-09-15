"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  History,
  Search,
  Library,
} from "lucide-react";

import ProtectedRoute from "@/components/protectedRoutes";
import LogoutButton from "@/components/LogoutButton";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");

  const links = [
    {
      name: "Dashboard",
      href: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Browse Books",
      href: "/user/books",
      icon: BookOpen,
    },
    {
      name: "My Books",
      href: "/user/borrowings",
      icon: Bookmark,
    },
    {
      name: "History",
      href: "/user/history",
      icon: History,
    },
  ];

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      router.push("/user/books");
      return;
    }

    router.push(
      `/user/books?search=${encodeURIComponent(value)}`
    );
  }

  return (
    <ProtectedRoute allowedRole="USER">
      <div className="flex min-h-screen bg-[#fbf9f6]">

        <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-[#eadfd4] bg-[#f7f2eb] px-4 py-7">

          <div className="mb-10 flex items-center gap-3 px-3">
            <Library
              size={32}
              strokeWidth={1.8}
              className="text-[#6f432d]"
            />

            <div>
              <h1 className="text-xl font-bold text-stone-900">
                Library
              </h1>

              <p className="text-xs text-stone-500">
                Discover. Learn. Grow.
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;

              const isActive =
                pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#eadccd] text-[#5f3927]"
                      : "text-stone-600 hover:bg-[#eee5dc] hover:text-stone-900"
                  }`}
                >
                  <Icon size={19} />

                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="rounded-2xl border border-[#e7d8ca] bg-[#f2e9df] p-5">
              <BookOpen
                size={27}
                className="mb-3 text-[#8a624d]"
              />

              <p className="text-sm font-semibold text-stone-700">
                Find your next read
              </p>

              <p className="mt-1 text-xs leading-5 text-stone-500">
                Explore the library and discover something new.
              </p>
            </div>
          </div>

        </aside>

        <div className="flex min-w-0 flex-1 flex-col">

          <header className="sticky top-0 z-20 flex h-[76px] items-center gap-6 border-b border-[#eee6de] bg-[#fffdfb]/95 px-8 backdrop-blur">

            <form
              onSubmit={handleSearch}
              className="relative w-full max-w-md"
            >
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search the library..."
                className="
                  w-full
                  rounded-full
                  border
                  border-[#dfd1c5]
                  bg-white
                  py-3
                  pl-5
                  pr-14
                  text-sm
                  text-stone-800
                  outline-none
                  transition
                  placeholder:text-stone-400
                  focus:border-[#bda18d]
                  focus:ring-2
                  focus:ring-[#eee3d9]
                "
              />

              <button
                type="submit"
                aria-label="Search books"
                className="
                  absolute
                  right-1.5
                  top-1/2
                  flex
                  h-9
                  w-9
                  -translate-y-1/2
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  bg-[#eee4d9]
                  text-stone-700
                  transition
                  hover:bg-[#dfd0c2]
                  hover:text-stone-900
                "
              >
                <Search size={18} />
              </button>
            </form>

            <div className="ml-auto">
              <LogoutButton />
            </div>

          </header>

          <main className="flex-1 p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>

        </div>
      </div>
    </ProtectedRoute>
  );
}