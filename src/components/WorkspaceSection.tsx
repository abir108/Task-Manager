"use client";

import Link from "next/link";
import { InlineCreateForm } from "@/components/InlineCreateForm";
import { createBoard } from "@/lib/actions";

type Board = { id: string; name: string };
type Workspace = { id: string; name: string; boards: Board[] };

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #7c3aed, #c026d3)",
  "linear-gradient(135deg, #6d28d9, #db2777)",
  "linear-gradient(135deg, #4c1d95, #9333ea)",
  "linear-gradient(135deg, #5b21b6, #a21caf)",
];

export function WorkspaceSection({ workspace }: { workspace: Workspace }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-5 shadow-lg shadow-black/20 backdrop-blur-md">
      <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">{workspace.name}</h2>
      <div className="mb-4 flex flex-wrap gap-3">
        {workspace.boards.map((board, i) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="flex h-24 w-48 flex-col justify-between rounded-xl p-3 text-white shadow-md shadow-black/30 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-900/40"
            style={{ background: CARD_GRADIENTS[i % CARD_GRADIENTS.length] }}
          >
            <span className="text-sm font-semibold line-clamp-2 drop-shadow">{board.name}</span>
            <span className="text-xs text-white/70">Board</span>
          </Link>
        ))}
      </div>
      <InlineCreateForm
        placeholder="Board name"
        buttonLabel="New board"
        onSubmit={(name) => createBoard(workspace.id, name)}
      />
    </section>
  );
}
