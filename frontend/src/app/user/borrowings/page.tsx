"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
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
  createdAt: string;
  updatedAt: string;
  book: Book;
};

export default function UserBorrowingsPage() {
  const [borrowings, setBorrowings] =
    useState<Borrowing[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [returnError, setReturnError] =
    useState("");

  const [returningId, setReturningId] =
    useState<string | null>(null);



  async function fetchBorrowings() {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get(
        "/borrowings/me",
        {
          params: {
            status: "ACTIVE",
          },
        }
      );

      setBorrowings(response.data);
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
            "Failed to load your borrowed books."
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
    fetchBorrowings();
  }, []);


  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [successMessage]);

  useEffect(() => {
    if (!returnError) return;

    const timer = setTimeout(() => {
      setReturnError("");
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [returnError]);

  

  async function handleReturn(
    borrowingId: string
  ) {
    try {
      setReturningId(borrowingId);

      setSuccessMessage("");
      setReturnError("");

      await api.patch(
        `/borrowings/${borrowingId}/return`
      );

      setSuccessMessage(
        "Book returned successfully."
      );

      await fetchBorrowings();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        if (error.response?.status === 400) {
          setReturnError(
            message ||
              "This book cannot be returned."
          );
        } else if (
          error.response?.status === 401
        ) {
          setReturnError(
            "You are not authorized. Please log in again."
          );
        } else if (
          error.response?.status === 403
        ) {
          setReturnError(
            message ||
              "You cannot return this borrowing."
          );
        } else if (
          error.response?.status === 404
        ) {
          setReturnError(
            message ||
              "Borrowing record not found."
          );
        } else if (!error.response) {
          setReturnError(
            "Cannot connect to the server."
          );
        } else {
          setReturnError(
            message ||
              "Failed to return book."
          );
        }
      } else {
        setReturnError(
          "Something went wrong."
        );
      }
    } finally {
      setReturningId(null);
    }
  }

  

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }


  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e7ddd4] border-t-[#8a624d]" />

          <p className="mt-4 text-sm text-stone-500">
            Loading your books...
          </p>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6">


      {successMessage && (
        <div className="fixed right-6 top-24 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 text-sm text-emerald-700 shadow-lg">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <p className="font-semibold">
              Success
            </p>

            <p className="mt-0.5 text-emerald-600">
              {successMessage}
            </p>
          </div>

        </div>
      )}

   
      {returnError && (
        <div className="fixed right-6 top-24 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-red-200 bg-white px-5 py-4 text-sm text-red-700 shadow-lg">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
            !
          </div>

          <div>
            <p className="font-semibold">
              Unable to return
            </p>

            <p className="mt-0.5 text-red-600">
              {returnError}
            </p>
          </div>

        </div>
      )}

   

      <section>
        <p className="text-sm font-semibold text-[#8a624d]">
          Your Library
        </p>

        <h1 className="mt-1 text-3xl font-bold text-stone-900">
          My Books
        </h1>

        <p className="mt-2 text-stone-500">
          View the books you currently have
          borrowed and return them when you
          are finished.
        </p>
      </section>


      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      )}

      {!error &&
        borrowings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#ddcfc3] bg-white px-6 py-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1e8df]">
              <BookOpen
                size={28}
                className="text-[#8a6c59]"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-stone-800">
              No borrowed books
            </h2>

            <p className="mt-2 text-sm text-stone-400">
              Books you borrow will appear
              here.
            </p>

          </div>
        )}

    

      {!error &&
        borrowings.length > 0 && (
          <section className="grid gap-5 md:grid-cols-2">

            {borrowings.map(
              (borrowing) => (
                <article
                  key={borrowing.id}
                  className="rounded-2xl border border-[#eadfd5] bg-white p-5 shadow-[0_4px_15px_rgba(80,60,45,0.04)]"
                >


                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-start gap-4">


                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2e9df]">
                        <BookOpen
                          size={21}
                          className="text-[#765448]"
                        />
                      </div>


                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold text-stone-900">
                          {
                            borrowing.book
                              .title
                          }
                        </h2>

                        <p className="mt-1 text-sm text-stone-500">
                          {
                            borrowing.book
                              .author
                          }
                        </p>
                      </div>

                    </div>


                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Active
                    </span>

                  </div>


                  <div className="mt-5 space-y-2 rounded-xl bg-[#faf7f4] p-4">

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-stone-400">
                        Category
                      </span>

                      <span className="font-medium text-stone-700">
                        {
                          borrowing.book
                            .category
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-stone-400">
                        Borrowed
                      </span>

                      <span className="font-medium text-stone-700">
                        {formatDate(
                          borrowing.borrowedAt
                        )}
                      </span>
                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      handleReturn(
                        borrowing.id
                      )
                    }
                    disabled={
                      returningId ===
                      borrowing.id
                    }
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
                      returningId ===
                      borrowing.id
                        ? "cursor-not-allowed bg-stone-100 text-stone-400"
                        : "bg-[#765448] text-white hover:bg-[#604336]"
                    }`}
                  >
                    <RotateCcw size={17} />

                    {returningId ===
                    borrowing.id
                      ? "Returning..."
                      : "Return Book"}
                  </button>

                </article>
              )
            )}

          </section>
        )}

    </div>
  );
}