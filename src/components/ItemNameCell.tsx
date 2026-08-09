"use client";

import { useState, useTransition } from "react";
import { renameItem, deleteItem } from "@/lib/actions";

export function ItemNameCell({
  boardId,
  itemId,
  name,
  indent = false,
  toggle,
}: {
  boardId: string;
  itemId: string;
  name: string;
  indent?: boolean;
  toggle?: React.ReactNode;
}) {
  const [draft, setDraft] = useState(name);
  const [, startTransition] = useTransition();

  return (
    <div className={`group flex items-center gap-1 px-2 py-2 ${indent ? "pl-8" : ""}`}>
      {toggle}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft.trim() && draft !== name) {
            startTransition(() => {
              renameItem(boardId, itemId, draft.trim());
            });
          } else {
            setDraft(name);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className={`w-full border-none bg-transparent text-[var(--text-primary)] caret-[var(--accent)] focus:outline focus:outline-2 focus:outline-[var(--accent)] ${
          indent ? "text-sm" : "text-sm font-medium"
        }`}
      />
      <button
        type="button"
        onClick={() => startTransition(() => deleteItem(boardId, itemId))}
        className="invisible shrink-0 text-xs text-[var(--text-muted)] hover:text-[#f87171] group-hover:visible"
        title="Delete item"
      >
        ✕
      </button>
    </div>
  );
}
