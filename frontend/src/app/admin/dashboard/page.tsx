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
        <p className="text-zinc-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-zinc-500">
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
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-zinc-500">
          Overview of the library system.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-zinc-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}