"use client";

import { useTransition } from "react";
import { createItem, deleteGroup } from "@/lib/actions";
import { InlineCreateForm } from "@/components/InlineCreateForm";
import { ItemRow } from "@/components/ItemRow";
import type { BoardColumn, BoardGroup, BoardMember } from "@/lib/boardTypes";

export function GroupTable({
  boardId,
  group,
  columns,
  members,
}: {
  boardId: string;
  group: BoardGroup;
  columns: BoardColumn[];
  members: BoardMember[];
}) {
  const [, startTransition] = useTransition();

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: group.color }}
        />
        <h3 className="text-sm font-semibold" style={{ color: group.color }}>
          {group.name}
        </h3>
        <span className="text-xs text-[var(--text-muted)]">{group.items.length} items</span>
        <button
          type="button"
          onClick={() => startTransition(() => deleteGroup(boardId, group.id))}
          className="ml-auto text-xs text-[var(--text-muted)] hover:text-[#f87171]"
        >
          Delete group
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 shadow-lg shadow-black/20 backdrop-blur-md">
        <div
          className="grid rounded-t-xl border-b border-[var(--border)] bg-[var(--surface-alt)]/80 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
          style={{ gridTemplateColumns: `minmax(220px, 2fr) repeat(${columns.length}, minmax(140px, 1fr))` }}
        >
          <div className="px-2 py-2">Item</div>
          {columns.map((col) => (
            <div key={col.id} className="border-l border-[var(--border)] px-2 py-2">
              {col.name}
            </div>
          ))}
        </div>

        {group.items.map((item) => (
          <ItemRow key={item.id} boardId={boardId} item={item} columns={columns} members={members} />
        ))}

        <div className="rounded-b-xl px-2 py-2">
          <InlineCreateForm
            placeholder="Item name"
            buttonLabel="Add item"
            onSubmit={(name) => createItem(boardId, group.id, name)}
          />
        </div>
      </div>
    </div>
  );
}
