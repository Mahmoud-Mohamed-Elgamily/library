"use client";

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import api from "@/lib/axios";
import axios from "axios";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/users");

        setUsers(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("You are not authorized. Please log in again.");
          } else if (error.response?.status === 403) {
            setError("You do not have permission to view users.");
          } else if (!error.response) {
            setError("Cannot connect to the server.");
          } else {
            setError("Failed to load users.");
          }
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-zinc-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">
          Registered Users
        </h1>

        <p className="mt-2 text-zinc-500">
          View all users registered in the library system.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
          <Users size={22} className="text-zinc-700" />
        </div>

        <div>
          <p className="text-sm text-zinc-500">Total Registered Users</p>

          <p className="text-2xl font-bold text-zinc-900">
            {users.length}
          </p>
        </div>
      </div>

      <div className="relative max-w-lg">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          type="text"
          placeholder="Search by name, email, or role..."
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
                  Name
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                  Email
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                  Role
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-zinc-700">
                  Registered At
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 last:border-none"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    {search
                      ? "No users match your search."
                      : "No registered users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}