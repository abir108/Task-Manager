"use client";

import { useState } from "react";
import { createSubItem } from "@/lib/actions";
import { InlineCreateForm } from "@/components/InlineCreateForm";
import { ItemNameCell } from "@/components/ItemNameCell";
import { BoardCell } from "@/components/BoardCell";
import type { BoardColumn, BoardItem, BoardMember } from "@/lib/boardTypes";

function gridStyle(columns: BoardColumn[]) {
  return { gridTemplateColumns: `minmax(220px, 2fr) repeat(${columns.length}, minmax(140px, 1fr))` };
}

export function ItemRow({
  boardId,
  item,
  columns,
  members,
}: {
  boardId: string;
  item: BoardItem;
  columns: BoardColumn[];
  members: BoardMember[];
}) {
  const [expanded, setExpanded] = useState(item.subItems.length > 0);
  const hasSubItems = item.subItems.length > 0;

  return (
    <div>
      <div
        className="grid border-b border-[var(--border)]/60 hover:bg-[var(--surface-hover)]/60"
        style={gridStyle(columns)}
      >
        <ItemNameCell
          boardId={boardId}
          itemId={item.id}
          name={item.name}
          toggle={
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className={`shrink-0 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] ${
                hasSubItems || expanded ? "" : "invisible group-hover:visible"
              }`}
              title={expanded ? "Collapse subitems" : "Expand subitems"}
            >
              {expanded ? "▾" : "▸"}
            </button>
          }
        />
        {columns.map((col) => {
          const cv = item.columnValues.find((v) => v.columnId === col.id);
          return (
            <div key={col.id} className="border-l border-[var(--border)]/60">
              <BoardCell
                boardId={boardId}
                itemId={item.id}
                column={col}
                value={cv?.value ?? ""}
                members={members}
              />
            </div>
          );
        })}
      </div>

      {expanded && (
        <div className="bg-[var(--bg-deep)]/30">
          {item.subItems.map((sub) => (
            <div
              key={sub.id}
              className="grid border-b border-[var(--border)]/40 hover:bg-[var(--surface-hover)]/40"
              style={gridStyle(columns)}
            >
              <ItemNameCell boardId={boardId} itemId={sub.id} name={sub.name} indent />
              {columns.map((col) => {
                const cv = sub.columnValues.find((v) => v.columnId === col.id);
                return (
                  <div key={col.id} className="border-l border-[var(--border)]/40">
                    <BoardCell
                      boardId={boardId}
                      itemId={sub.id}
                      column={col}
                      value={cv?.value ?? ""}
                      members={members}
                    />
                  </div>
                );
              })}
            </div>
          ))}
          <div className="py-1.5 pl-8">
            <InlineCreateForm
              placeholder="Subitem name"
              buttonLabel="Add subitem"
              onSubmit={(name) => createSubItem(boardId, item.id, name)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
