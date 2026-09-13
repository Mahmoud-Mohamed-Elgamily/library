"use client";

import { useState } from "react";
import { X } from "lucide-react";

type AddBookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: {
    title: string;
    author: string;
    isbn: string;
    category: string;
    availableCopies: number;
    totalCopies: number;
  }) => void;
};
export default function AddBookModal({
  isOpen,
  onClose,
  onAddBook,
}: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [availableCopies, setAvailableCopies] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push("Title is required.");
    }

    if (!author.trim()) {
      newErrors.push("Author is required.");
    }

    if (!isbn.trim()) {
      newErrors.push("ISBN is required.");
    }

    if (!category.trim()) {
      newErrors.push("Category is required.");
    }

    if (!totalCopies || Number(totalCopies) < 1) {
      newErrors.push("Total copies must be at least 1.");
    }

    if (!availableCopies || Number(availableCopies) < 0) {
      newErrors.push("Available copies cannot be negative.");
    }

    if (Number(availableCopies) > Number(totalCopies)) {
      newErrors.push(
        "Available copies cannot be greater than total copies."
      );
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    const newBook = {
      title,
      author,
      isbn,
      category,
      availableCopies: Number(availableCopies),
      totalCopies: Number(totalCopies),
    };

    onAddBook(newBook);
    onClose();

    
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">       
         <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Add Book
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add a new book to the library.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter book title"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Author
            </label>

            <input
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Enter author name"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              ISBN
            </label>

            <input
              type="text"
              value={isbn}
              onChange={(event) => setIsbn(event.target.value)}
              placeholder="Enter ISBN"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Enter category"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Available Copies
              </label>

              <input
                type="number"
                min="0"
                value={availableCopies}
                onChange={(event) =>
                  setAvailableCopies(event.target.value)
                }
                placeholder="0"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Total Copies
              </label>

              <input
                type="number"
                min="1"
                value={totalCopies}
                onChange={(event) => setTotalCopies(event.target.value)}
                placeholder="1"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
              />
            </div>
          </div>

          {errors.length > 0 && (
            <div className="rounded-xl bg-red-50 px-4 py-3">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">
                  • {error}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}