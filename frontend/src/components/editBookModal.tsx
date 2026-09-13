"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
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
  const [availableCopies, setAvailableCopies] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setIsbn(book.isbn);
      setCategory(book.category);
      setTotalCopies(String(book.totalCopies));
      setErrors([]);
    }
  }, [book]);

  if (!isOpen || !book) {
    return null;
  }

  function handleSubmit(event: React.FormEvent) {
    
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
    }

    if (!category.trim()) {
      newErrors.push("Category is required.");
    }

    if (!totalCopies || Number(totalCopies) < 1) {
      newErrors.push("Total copies must be at least 1.");
    }

    if (Number(availableCopies) < 0) {
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

    onSave({
  id: book.id,
  title,
  author,
  isbn,
  category,
  totalCopies: Number(totalCopies),
});

    onClose();
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
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />

          <input
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Author"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />

          <input
            type="text"
            value={isbn}
            onChange={(event) => setIsbn(event.target.value)}
            placeholder="ISBN"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />

          <input
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Category"
            className="w-full rounded-xl border border-zinc-300 px-4 py-3"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              min="0"
              value={availableCopies}
              onChange={(event) =>
                setAvailableCopies(event.target.value)
              }
              placeholder="Available Copies"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3"
            />

            <input
              type="number"
              min="1"
              value={totalCopies}
              onChange={(event) => setTotalCopies(event.target.value)}
              placeholder="Total Copies"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3"
            />
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
              className="rounded-xl border border-zinc-300 px-5 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-zinc-900 px-5 py-3 text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}