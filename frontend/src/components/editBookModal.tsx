"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
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

type EditBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  onSave: (updatedBook: Book) => void;
};

export default function EditBookModal({
  isOpen,
  onClose,
  book,
  onSave,
}: EditBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [totalCopies, setTotalCopies] = useState("");

  const [errors, setErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setIsbn(book.isbn);
      setCategory(book.category);
      setTotalCopies(String(book.totalCopies));

      setErrors([]);
      setServerError("");
    }
  }, [book]);

  if (!isOpen || !book) {
    return null;
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!book) {
      return;
    }

    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push("Title is required.");
    }

    if (!author.trim()) {
      newErrors.push("Author is required.");
    }

    if (!isbn.trim()) {
  newErrors.push("ISBN is required.");
} else if (!/^\d{10}$|^\d{13}$/.test(isbn)) {
  newErrors.push("ISBN must contain exactly 10 or 13 digits.");
}

    if (!category.trim()) {
      newErrors.push("Category is required.");
    }

    if (
      !totalCopies ||
      Number(totalCopies) < 1
    ) {
      newErrors.push(
        "Total copies must be at least 1."
      );
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      setServerError("");
      setErrors([]);

      const response = await api.patch(
        `/books/${book.id}`,
        {
          title: title.trim(),
          author: author.trim(),
          isbn: isbn.trim(),
          category: category.trim(),
          totalCopies: Number(totalCopies),
        }
      );

      onSave(response.data);

      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        if (error.response?.status === 400) {
          setServerError(
            message ||
              "Please check the book information."
          );
        } else if (
          error.response?.status === 404
        ) {
          setServerError(
            "Book not found."
          );
        } else if (!error.response) {
          setServerError(
            "Cannot connect to the server."
          );
        } else {
          setServerError(
            message ||
              "Could not update the book."
          );
        }
      } else {
        setServerError(
          "Something went wrong."
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Edit Book
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update the book information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100"
          >
            <X size={20} />
          </button>
        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-[#8a624d] focus:ring-2 focus:ring-[#eadfd5]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Author
            </label>

            <input
              type="text"
              value={author}
              onChange={(event) =>
                setAuthor(event.target.value)
              }
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-[#8a624d] focus:ring-2 focus:ring-[#eadfd5]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              ISBN
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={13}
              value={isbn}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "");
                setIsbn(value);
              }}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-[#8a624d] focus:ring-2 focus:ring-[#eadfd5]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-[#8a624d] focus:ring-2 focus:ring-[#eadfd5]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Total Copies
            </label>

            <input
              type="number"
              min="1"
              value={totalCopies}
              onChange={(event) =>
                setTotalCopies(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-[#8a624d] focus:ring-2 focus:ring-[#eadfd5]"
            />
          </div>


          {errors.length > 0 && (
            <div className="rounded-xl bg-red-50 px-4 py-3">
              {errors.map(
                (error, index) => (
                  <p
                    key={index}
                    className="text-sm text-red-600"
                  >
                    • {error}
                  </p>
                )
              )}
            </div>
          )}


          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}


          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}