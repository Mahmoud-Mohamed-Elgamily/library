"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock3,
  History,
  LibraryBig,
} from "lucide-react";
import axios from "axios";
import api from "@/lib/axios";

type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
};

type Borrowing = {
  id: string;
  userId: string;
  bookId: string;
  borrowedAt: string;
  returnedAt: string | null;
  status: "ACTIVE" | "RETURNED";
  book: Book;
};

type DashboardData = {
  currentBooks: Borrowing[];
  activeCount: number;
  recentHistory: Borrowing[];
};

export default function UserDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/dashboard");

        setDashboard(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("You are not authorized. Please log in again.");
          } else if (!error.response) {
            setError("Cannot connect to the server.");
          } else {
            setError("Failed to load dashboard.");
          }
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-700" />

          <p className="text-stone-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10">

        <section className="rounded-2xl border border-amber-200 bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                Welcome Back
              </p>

              <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
                My Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-stone-600">
                View your current books and recent borrowing activity.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <LibraryBig size={28} />
            </div>

          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <BookOpen size={25} />
              </div>

              <div>
                <p className="text-sm font-medium text-stone-500">
                  Currently Borrowed
                </p>

                <p className="mt-1 text-3xl font-bold text-stone-900">
                  {dashboard.activeCount}
                </p>

                <p className="mt-1 text-xs text-stone-400">
                  Books you have not returned yet
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-800">
                <History size={25} />
              </div>

              <div>
                <p className="text-sm font-medium text-stone-500">
                  Recent Activity
                </p>

                <p className="mt-1 text-3xl font-bold text-stone-900">
                  {dashboard.recentHistory.length}
                </p>

                <p className="mt-1 text-xs text-stone-400">
                  Your latest borrowing and return records
                </p>
              </div>

            </div>
          </div>
        </section>

        <section className="space-y-4">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Clock3 size={19} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Current Books
              </h2>

              <p className="text-sm text-stone-500">
                Books that are still borrowed.
              </p>
            </div>
          </div>

          {dashboard.currentBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                <BookOpen
                  size={31}
                  className="text-amber-700"
                />
              </div>

              <p className="text-lg font-semibold text-stone-800">
                No books currently borrowed
              </p>

              <p className="mt-2 text-sm text-stone-500">
                Browse the library to find your next book.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {dashboard.currentBooks.map((borrowing) => (
                <article
                  key={borrowing.id}
                  className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h3 className="text-lg font-bold text-stone-900">
                        {borrowing.book.title}
                      </h3>

                      <p className="mt-1 text-sm text-stone-500">
                        {borrowing.book.author}
                      </p>
                    </div>

                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {borrowing.status}
                    </span>

                  </div>

                  <div className="mt-5 border-t border-stone-100 pt-4">
                    <p className="text-sm text-stone-600">
                      Borrowed on{" "}
                      <span className="font-medium text-stone-800">
                        {new Date(
                          borrowing.borrowedAt
                        ).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

        </section>

        <section className="space-y-4">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-800">
              <History size={19} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Recent History
              </h2>

              <p className="text-sm text-stone-500">
                Your latest borrow and return records.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead className="border-b border-amber-200 bg-amber-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                      Book
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                      Borrowed
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                      Returned
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-stone-700">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentHistory.length > 0 ? (
                    dashboard.recentHistory.map((borrowing) => (
                      <tr
                        key={borrowing.id}
                        className="border-b border-stone-100 transition last:border-none hover:bg-amber-50/40"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-stone-900">
                            {borrowing.book.title}
                          </p>

                          <p className="mt-1 text-sm text-stone-500">
                            {borrowing.book.author}
                          </p>

                          <p className="mt-1 text-xs text-stone-400">
                            {borrowing.book.category}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-stone-600">
                          {new Date(
                            borrowing.borrowedAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-sm text-stone-600">
                          {borrowing.returnedAt
                            ? new Date(
                                borrowing.returnedAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              borrowing.status === "ACTIVE"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {borrowing.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-stone-500"
                      >
                        No borrowing history yet.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}