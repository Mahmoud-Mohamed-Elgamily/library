"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import AddBookModal from "@/components/AddBookModal";
import EditBookModal from "@/components/editBookModal";

export default function AdminBooksPage() {
  const [search, setSearch] = useState("");
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<
  (typeof books)[number] | null
>(null);

const [isEditBookOpen, setIsEditBookOpen] = useState(false);
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      category: "Fiction",
      availableCopies: 4,
      totalCopies: 6,
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      isbn: "9780735211292",
      category: "Self Development",
      availableCopies: 2,
      totalCopies: 4,
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      category: "Programming",
      availableCopies: 3,
      totalCopies: 3,
    },
  ]);

  const filteredBooks = books.filter((book) => {
    const value = search.toLowerCase();

    return (
      book.title.toLowerCase().includes(value) ||
      book.author.toLowerCase().includes(value) ||
      book.isbn.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Books Management
          </h1>

          <p className="mt-2 text-zinc-500">
            View and manage the books in the library.
          </p>
        </div>

        <button
  onClick={() => setIsAddBookOpen(true)}
  className="
    flex
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-zinc-900
    px-5
    py-3
    text-sm
    font-medium
    text-white
    transition
    hover:bg-zinc-800
  "
>
  <Plus size={18} />
  Add Book
</button>
      </div>

      <div className="relative max-w-lg">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="
            w-full
            rounded-xl
            border
            border-zinc-300
            bg-white
            py-3
            pl-12
            pr-4
            text-zinc-900
            outline-none
            transition
            placeholder:text-zinc-400
            focus:border-zinc-900
            focus:ring-2
            focus:ring-zinc-200
          "
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                  Title
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                  Author
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                  ISBN
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                  Category
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                  Copies
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-zinc-100 last:border-none"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {book.title}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {book.author}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {book.isbn}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {book.category}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          book.availableCopies === 0
                            ? "font-medium text-red-600"
                            : "font-medium text-green-600"
                        }
                      >
                        {book.availableCopies}
                      </span>

                      <span className="text-zinc-400">
                        {" "}
                        / {book.totalCopies}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBook(book);
                            setIsEditBookOpen(true);
                          }}
                        className="
                          rounded-lg
                          border
                          border-zinc-200
                          p-2
                          text-zinc-600
                          transition
                          hover:bg-zinc-100
                          hover:text-zinc-900
                        "
                          >
                        <Pencil size={17} />
                        </button>

                        <button
                            onClick={() => {
                              const confirmed = window.confirm(
                                `Are you sure you want to delete "${book.title}"?`
                              );

                              if (confirmed) {
                                setBooks((previousBooks) =>
                                  previousBooks.filter(
                                    (currentBook) => currentBook.id !== book.id
                                  )
                                );
                              }
                            }}
                            className="
                              rounded-lg
                              border
                              border-red-200
                              p-2
                              text-red-600
                              transition
                              hover:bg-red-50
                            "
                          >
                            <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    No books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddBookModal
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAddBook={(newBook) => {
          setBooks((previousBooks) => [
            ...previousBooks,
            {
              id: previousBooks.length + 1,
              ...newBook,
      },
    ]);
  }}
/>
           <EditBookModal
              isOpen={isEditBookOpen}
              onClose={() => {
                setIsEditBookOpen(false);
                setSelectedBook(null);
              }}
              book={selectedBook}
              onSave={(updatedBook) => {
                setBooks((previousBooks) =>
                  previousBooks.map((book) =>
                    book.id === updatedBook.id ? updatedBook : book
                  )
                );
              }}
            />
    </div>
  );
}