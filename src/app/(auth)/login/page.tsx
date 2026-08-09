"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--bg-gradient)" }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <h1 className="mb-1 bg-gradient-to-r from-[#c084fc] to-[#f0abfc] bg-clip-text text-2xl font-bold text-transparent">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-[var(--text-muted)]">Log in to your TaskBoard</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-deep)]/60 px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-deep)]/60 px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-[#f87171]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--accent-gradient)" }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[var(--accent-2)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
