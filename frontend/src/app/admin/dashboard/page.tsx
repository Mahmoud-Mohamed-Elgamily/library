"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Library,
  BookCheck,
  Users,
  RefreshCcw,
  BookMarked,
} from "lucide-react";

import api from "@/lib/axios";

type DashboardData = {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  totalUsers: number;
  activeBorrowings: number;
  borrowedCopies: number;
};

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/dashboard");

        setDashboardData(response.data);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e7ddd4] border-t-[#8a624d]" />

          <p className="mt-4 text-sm text-stone-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="rounded-2xl border border-dashed border-[#ddcfc3] bg-white p-8 text-center text-stone-500">
        No dashboard data available.
      </div>
    );
  }

  const stats = [
    {
      title: "Total Books",
      value: dashboardData.totalBooks,
      icon: BookOpen,
    },
    {
      title: "Total Copies",
      value: dashboardData.totalCopies,
      icon: Library,
    },
    {
      title: "Available Copies",
      value: dashboardData.availableCopies,
      icon: BookCheck,
    },
    {
      title: "Borrowed Copies",
      value: dashboardData.borrowedCopies,
      icon: BookMarked,
    },
    {
      title: "Registered Users",
      value: dashboardData.totalUsers,
      icon: Users,
    },
    {
      title: "Active Borrowings",
      value: dashboardData.activeBorrowings,
      icon: RefreshCcw,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#eadfd5] bg-white p-8 shadow-[0_4px_20px_rgba(80,60,45,0.04)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a624d]">
          Library Overview
        </p>

        <h1 className="mt-2 text-3xl font-bold text-stone-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-stone-500">
          Monitor books, users and borrowing activity.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="rounded-2xl border border-[#eadfd5] bg-white p-6 shadow-[0_4px_15px_rgba(80,60,45,0.04)] transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-stone-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-stone-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2e9df] text-[#765448]">
                  <Icon size={23} />
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}