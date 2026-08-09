"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export function TopNav({ userName }: { userName: string }) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 px-6 py-3 backdrop-blur-md">
      <Link
        href="/"
        className="bg-gradient-to-r from-[#c084fc] to-[#f0abfc] bg-clip-text text-lg font-bold text-transparent"
      >
        TaskBoard
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--text-secondary)]">{userName}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-md border border-[var(--border-light)] px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
