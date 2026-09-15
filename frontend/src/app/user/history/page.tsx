"use client";

import { useEffect, useState } from "react";
import { BookOpen, History } from "lucide-react";
import axios from "axios";

import api from "@/lib/axios";

type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
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

export default function UserHistoryPage() {
  const [history, setHistory] = useState<Borrowing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchHistory() {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get("/borrowings/me", {
        params: {
          status: "RETURNED",
        },
      });

      setHistory(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError(
            "You are not authorized. Please log in again."
          );
        } else if (!error.response) {
          setError(
            "Cannot connect to the server."
          );
        } else {
          setError(
            "Failed to load borrowing history."
          );
        }
      } else {
        setError(
          "Something went wrong."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e7ddd4] border-t-[#8a624d]" />

          <p className="mt-4 text-sm text-stone-500">
            Loading history...
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

  return (
    <div className="space-y-6">


      <section>
        <p className="text-sm font-semibold text-[#8a624d]">
          Reading History
        </p>

        <h1 className="mt-1 text-3xl font-bold text-stone-900">
          Borrowing History
        </h1>

        <p className="mt-2 text-stone-500">
          View the books you have borrowed and returned.
        </p>
      </section>


      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ddcfc3] bg-white px-6 py-14 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1e8df]">
            <History
              size={28}
              className="text-[#8a6c59]"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-stone-800">
            No borrowing history yet
          </h2>

          <p className="mt-2 text-sm text-stone-400">
            Returned books will appear here.
          </p>

        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#eadfd5] bg-white shadow-[0_4px_15px_rgba(80,60,45,0.04)]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px] text-left">

              <thead className="bg-[#f7f1eb]">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-600">
                    Book
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-600">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-600">
                    Borrowed
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-600">
                    Returned
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((borrowing) => (
                  <tr
                    key={borrowing.id}
                    className="border-t border-[#eee7e1] transition hover:bg-[#fdfaf7]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2e9df]">
                          <BookOpen
                            size={19}
                            className="text-[#765448]"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-stone-800">
                            {borrowing.book.title}
                          </p>

                          <p className="mt-0.5 text-xs text-stone-400">
                            {borrowing.book.author}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-500">
                      {borrowing.book.category}
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-500">
                      {new Date(
                        borrowing.borrowedAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-sm text-stone-500">
                      {borrowing.returnedAt
                        ? new Date(
                            borrowing.returnedAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        RETURNED
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>
      )}

    </div>
  );
}