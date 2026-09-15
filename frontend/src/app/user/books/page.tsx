"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
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

export default function UserBooksPage() {
  const searchParams = useSearchParams();

  const searchQuery =
    searchParams.get("search")?.trim().toLowerCase() || "";

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function fetchBooks() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/books");

        setBooks(response.data);
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
              "Failed to load books."
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

    fetchBooks();
  }, []);



  const filteredBooks = useMemo(() => {
    if (!searchQuery) {
      return books;
    }

    return books.filter((book) => {
      return (
        book.title
          .toLowerCase()
          .includes(searchQuery) ||
        book.author
          .toLowerCase()
          .includes(searchQuery) ||
        book.isbn
          .toLowerCase()
          .includes(searchQuery)
      );
    });
  }, [books, searchQuery]);



  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#e7ddd4] border-t-[#8a624d]" />

          <p className="mt-4 text-sm text-stone-500">
            Loading books...
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
          Library Collection
        </p>

        <h1 className="mt-1 text-3xl font-bold text-stone-900">
          Browse Books
        </h1>

        <p className="mt-2 text-stone-500">
          Browse the library and open a book to view its details.
        </p>
      </section>


      {searchQuery && (
        <div className="flex items-center gap-3 rounded-xl border border-[#eadfd5] bg-white px-4 py-3">
          <Search
            size={18}
            className="text-[#765448]"
          />

          <p className="text-sm text-stone-600">
            Showing results for{" "}
            <span className="font-semibold text-stone-900">
              "{searchParams.get("search")}"
            </span>
          </p>
        </div>
      )}


      {filteredBooks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ddcfc3] bg-white px-6 py-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1e8df]">
            <BookOpen
              size={28}
              className="text-[#8a6c59]"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-stone-800">
            No books found
          </h2>

          <p className="mt-2 text-sm text-stone-400">
            Try searching with a different title,
            author, or ISBN.
          </p>

        </div>
      ) : (

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {filteredBooks.map((book) => (
            <article
              key={book.id}
              className="
                rounded-2xl
                border
                border-[#eadfd5]
                bg-white
                p-5
                shadow-[0_4px_15px_rgba(80,60,45,0.04)]
                transition
                hover:-translate-y-1
                hover:shadow-md
              "
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2e9df]">
                <BookOpen
                  size={22}
                  className="text-[#765448]"
                />
              </div>

              <h2 className="mt-4 text-lg font-bold text-stone-900">
                {book.title}
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                {book.author}
              </p>

              <Link
                href={`/user/books/${book.id}`}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-[#765448]
                  transition
                  hover:text-[#4f3529]
                "
              >
                View Details

                <ArrowRight size={16} />
              </Link>

            </article>
          ))}

        </section>
      )}

    </div>
  );
}