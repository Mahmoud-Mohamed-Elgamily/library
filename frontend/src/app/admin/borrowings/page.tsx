"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import axios from "axios";

type Borrowing = {
  id: string;
  userId: string;
  bookId: string;
  borrowedAt: string;
  returnedAt: string | null;
  status: "ACTIVE" | "RETURNED";

  user: {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
  };

  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    totalCopies: number;
    availableCopies: number;
  };
};

type StatusFilter = "ALL" | "ACTIVE" | "RETURNED";

export default function AdminBorrowingsPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBorrowings() {
      try {
        setIsLoading(true);
        setError("");

        const response =
          statusFilter === "ALL"
            ? await api.get("/borrowings")
            : await api.get("/borrowings", {
                params: {
                  status: statusFilter,
                },
              });

        setBorrowings(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError(
              "You are not authorized. Please log in again."
            );
          } else if (error.response?.status === 403) {
            setError(
              "You do not have permission to view borrowing activity."
            );
          } else if (!error.response) {
            setError("Cannot connect to the server.");
          } else {
            setError("Could not load borrowing activity.");
          }
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchBorrowings();
  }, [statusFilter]);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-zinc-900">
          Borrowing Activity
        </h1>

        <p className="mt-2 text-zinc-500">
          View all borrowing activity in the library.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label
          htmlFor="status"
          className="text-sm font-medium text-zinc-700"
        >
          Status
        </label>

        <select
          id="status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as StatusFilter
            )
          }
          className="
            rounded-xl
            border
            border-zinc-300
            bg-white
            px-4
            py-2.5
            text-sm
            text-zinc-700
            outline-none
            focus:border-zinc-900
            focus:ring-2
            focus:ring-zinc-200
          "
        >
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="RETURNED">Returned</option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-zinc-500">
            Loading borrowing activity...
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                    User
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                    Book
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                    Borrowed At
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                    Returned At
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {borrowings.length > 0 ? (
                  borrowings.map((borrowing) => (
                    <tr
                      key={borrowing.id}
                      className="border-b border-zinc-100 last:border-none"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-zinc-900">
                          {borrowing.user.name}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {borrowing.user.email}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-zinc-900">
                          {borrowing.book.title}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {borrowing.book.author}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-zinc-600">
                        {new Date(
                          borrowing.borrowedAt
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-zinc-600">
                        {borrowing.returnedAt
                          ? new Date(
                              borrowing.returnedAt
                            ).toLocaleString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            borrowing.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : "bg-zinc-100 text-zinc-700"
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
                      colSpan={5}
                      className="px-6 py-12 text-center text-zinc-500"
                    >
                      No borrowing activity found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
}