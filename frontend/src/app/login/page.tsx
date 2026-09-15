"use client";

import { useState } from "react";
import { BookOpen, Mail, Lock, LogIn } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    const newErrors: string[] = [];

    if (!email) {
      newErrors.push("Email is required.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        newErrors.push("Please enter a valid email address.");
      }
    }

    if (!password) {
      newErrors.push("Password is required.");
    } else {
      if (password.length < 6) {
        newErrors.push("Password must be at least 6 characters.");
      }

      const uppercaseRegex = /[A-Z]/;

      if (!uppercaseRegex.test(password)) {
        newErrors.push(
          "Password must contain at least one uppercase letter."
        );
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrors(["Invalid email or password."]);
        } else if (error.response?.status === 500) {
          setErrors(["Server error. Please try again later."]);
        } else if (!error.response) {
          setErrors(["Cannot connect to the server."]);
        } else {
          setErrors(["Something went wrong. Please try again."]);
        }
      } else {
        setErrors(["Something went wrong. Please try again."]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/back-1.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-screen items-center px-8 md:px-16">
        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">

          <div className="hidden text-white md:block">
            <div className="mb-8 h-1 w-20 bg-white/70" />

            <h2 className="max-w-xl text-5xl font-bold leading-tight lg:text-6xl">
              A Library for a
              <br />
              Brighter Tomorrow
            </h2>

            <p className="mt-10 text-xl text-white/90">
              Discover. Learn. Grow.
            </p>
          </div>

          <div className="flex justify-center md:justify-start">
            <div className="w-full max-w-md rounded-3xl bg-white/95 p-7 shadow-2xl backdrop-blur-sm">

              <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-white">
                  <BookOpen size={30} />
                </div>

                <h1 className="text-4xl font-bold text-zinc-900">
                  Library
                </h1>

                <p className="mt-2 text-base text-zinc-500">
                  Sign in to your account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    />

                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-zinc-300
                        bg-white
                        py-3.5
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
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    />

                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="
                        w-full
                        rounded-xl
                        border
                        border-zinc-300
                        bg-white
                        py-3.5
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
                </div>

                {errors.length > 0 && (
                  <div className="rounded-lg bg-red-50 px-4 py-3">
                    {errors.map((error, index) => (
                      <p
                        key={index}
                        className="text-sm text-red-600"
                      >
                        • {error}
                      </p>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-zinc-900
                    py-3.5
                    font-medium
                    text-white
                    transition
                    hover:bg-zinc-800
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <LogIn size={19} />

                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-200" />

                <p className="text-sm text-zinc-400">
                  Welcome back!
                </p>

                <div className="h-px flex-1 bg-zinc-200" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}