"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
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
  createdAt: string;
  updatedAt: string;
};

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");
  const [borrowError, setBorrowError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isBorrowing, setIsBorrowing] = useState(false);


  async function fetchBook() {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get(
        `/books/${bookId}`
      );

      setBook(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError("Book not found.");
        } else if (
          error.response?.status === 401
        ) {
          setError(
            "You are not authorized. Please log in again."
          );
        } else if (!error.response) {
          setError(
            "Cannot connect to the server."
          );
        } else {
          setError(
            "Failed to load book details."
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
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  useEffect(() => {
  if (!successMessage) return;

  const timer = setTimeout(() => {
    setSuccessMessage("");
  }, 3000);

  return () => clearTimeout(timer);
}, [successMessage]);

useEffect(() => {
  if (!borrowError) return;

  const timer = setTimeout(() => {
    setBorrowError("");
  }, 4000);

  return () => clearTimeout(timer);
}, [borrowError]);

  
  async function handleBorrow() {
    if (!book) return;

    try {
      setIsBorrowing(true);

      setSuccessMessage("");
      setBorrowError("");

      await api.post("/borrowings", {
        bookId: book.id,
      });

      setSuccessMessage(
        "Book borrowed successfully."
      );

      const response = await api.get(
        `/books/${book.id}`
      );

      setBook(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        if (error.response?.status === 409) {
          setBorrowError(
            message ||
              "You already have an active borrowing for this book."
          );
        } else if (
          error.response?.status === 400
        ) {
          setBorrowError(
            message ||
              "This book cannot be borrowed."
          );
        } else if (
          error.response?.status === 404
        ) {
          setBorrowError(
            message || "Book not found."
          );
        } else if (
          error.response?.status === 401
        ) {
          setBorrowError(
            "You are not authorized. Please log in again."
          );
        } else if (!error.response) {
          setBorrowError(
            "Cannot connect to the server."
          );
        } else {
          setBorrowError(
            message ||
              "Failed to borrow book."
          );
        }
      } else {
        setBorrowError(
          "Something went wrong."
        );
      }
    } finally {
      setIsBorrowing(false);
    }
  }



  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e7ddd4] border-t-[#8a624d]" />

          <p className="mt-4 text-sm text-stone-500">
            Loading book details...
          </p>
        </div>
      </div>
    );
  }


  if (error || !book) {
    return (
      <div className="space-y-5">

        <button
          type="button"
          onClick={() =>
            router.push("/user/books")
          }
          className="flex items-center gap-2 text-sm font-medium text-[#765448]"
        >
          <ArrowLeft size={17} />

          Back to Books
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error || "Book not found."}
        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">


      <button
        type="button"
        onClick={() =>
          router.push("/user/books")
        }
        className="flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
      >
        <ArrowLeft size={17} />

        Back to Books
      </button>


{successMessage && (
  <div className="fixed right-6 top-24 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 text-sm text-emerald-700 shadow-lg">
    <CheckCircle2
      size={20}
      className="shrink-0"
    />

    <div>
      <p className="font-semibold">
        Success
      </p>

      <p className="text-emerald-600">
        {successMessage}
      </p>
    </div>
  </div>
)}

{borrowError && (
  <div className="fixed right-6 top-24 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-red-200 bg-white px-5 py-4 text-sm text-red-700 shadow-lg">
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
      !
    </div>

    <div>
      <p className="font-semibold">
        Unable to borrow
      </p>

      <p className="text-red-600">
        {borrowError}
      </p>
    </div>
  </div>
)}


      <section className="overflow-hidden rounded-3xl border border-[#eadfd5] bg-white shadow-[0_4px_20px_rgba(80,60,45,0.05)]">


        <div className="border-b border-[#eee7e1] bg-[#faf6f2] p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex gap-5">


              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#eee4da]">
                <BookOpen
                  size={36}
                  strokeWidth={1.7}
                  className="text-[#765448]"
                />
              </div>


              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a624d]">
                  Book Details
                </p>

                <h1 className="text-3xl font-bold text-stone-900">
                  {book.title}
                </h1>

                <p className="mt-2 text-lg text-stone-500">
                  {book.author}
                </p>
              </div>

            </div>


            <span
              className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${
                book.availableCopies > 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {book.availableCopies > 0
                ? "Available"
                : "Unavailable"}
            </span>

          </div>
        </div>


        <div className="p-8">

          <div className="grid gap-5 sm:grid-cols-2">


            <div className="rounded-2xl border border-[#eee5dd] bg-[#fdfbf9] p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Author
              </p>

              <p className="mt-2 font-semibold text-stone-800">
                {book.author}
              </p>
            </div>


            <div className="rounded-2xl border border-[#eee5dd] bg-[#fdfbf9] p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Category
              </p>

              <p className="mt-2 font-semibold text-stone-800">
                {book.category}
              </p>
            </div>


            <div className="rounded-2xl border border-[#eee5dd] bg-[#fdfbf9] p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                ISBN
              </p>

              <p className="mt-2 font-semibold text-stone-800">
                {book.isbn}
              </p>
            </div>


            <div className="rounded-2xl border border-[#eee5dd] bg-[#fdfbf9] p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Available Copies
              </p>

              <p className="mt-2 font-semibold text-stone-800">
                {book.availableCopies} /{" "}
                {book.totalCopies}
              </p>
            </div>

          </div>


          <div className="mt-6 rounded-2xl border border-[#eee5dd] bg-[#fdfbf9] p-5">

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-stone-700">
                Book availability
              </p>

              <p className="text-sm font-semibold text-stone-800">
                {book.availableCopies} /{" "}
                {book.totalCopies}
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">

              <div
                className="h-full rounded-full bg-[#9b7865] transition-all"
                style={{
                  width: `${
                    book.totalCopies > 0
                      ? Math.min(
                          (book.availableCopies /
                            book.totalCopies) *
                            100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>


          <button
            type="button"
            onClick={handleBorrow}
            disabled={
              book.availableCopies === 0 ||
              isBorrowing
            }
            className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition ${
              book.availableCopies > 0 &&
              !isBorrowing
                ? "cursor-pointer bg-[#765448] text-white hover:bg-[#604336]"
                : "cursor-not-allowed bg-stone-100 text-stone-400"
            }`}
          >
            {isBorrowing
              ? "Borrowing..."
              : book.availableCopies > 0
                ? "Borrow Book"
                : "Currently Unavailable"}
          </button>

        </div>

      </section>

    </div>
  );
}