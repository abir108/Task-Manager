"use client";

import { useState, useTransition } from "react";
import { createColumn } from "@/lib/actions";
import { COLUMN_TYPES, type ColumnType } from "@/lib/types";

export function AddColumnForm({ boardId }: { boardId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ColumnType>("TEXT");
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-dashed border-[var(--border-light)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
      >
        + Add column
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        startTransition(async () => {
          await createColumn(boardId, name.trim(), type);
          setName("");
          setOpen(false);
        });
      }}
      className="flex items-center gap-2"
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Column name"
        className="rounded-md border border-[var(--border)] bg-[var(--bg-deep)]/60 px-2 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as ColumnType)}
        className="rounded-md border border-[var(--border)] bg-[var(--bg-deep)]/60 px-2 py-1.5 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
      >
        {COLUMN_TYPES.map((t) => (
          <option key={t} value={t} className="bg-[var(--surface)] text-[var(--text-primary)]">
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        style={{ background: "var(--accent-gradient)" }}
      >
        {isPending ? "..." : "Add"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      >
        Cancel
      </button>
    </form>
  );
}
