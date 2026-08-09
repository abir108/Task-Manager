"use client";

import { useState, useTransition } from "react";
import { createGroup, renameBoard } from "@/lib/actions";
import { GroupTable } from "@/components/GroupTable";
import { AddColumnForm } from "@/components/AddColumnForm";
import { InlineCreateForm } from "@/components/InlineCreateForm";
import type { BoardData, BoardMember } from "@/lib/boardTypes";

export function BoardView({ board, members }: { board: BoardData; members: BoardMember[] }) {
  const [name, setName] = useState(board.name);
  const [, startTransition] = useTransition();

  return (
    <div className="min-w-fit">
      <div className="mb-6 flex items-center justify-between">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (name.trim() && name !== board.name) {
              startTransition(() => renameBoard(board.id, name.trim()));
            } else {
              setName(board.name);
            }
          }}
          className="border-none bg-transparent text-2xl font-bold text-[var(--text-primary)] caret-[var(--accent)] focus:outline focus:outline-2 focus:outline-[var(--accent)]"
        />
        <AddColumnForm boardId={board.id} />
      </div>

      {board.groups.map((group) => (
        <GroupTable
          key={group.id}
          boardId={board.id}
          group={group}
          columns={board.columns}
          members={members}
        />
      ))}

      <InlineCreateForm
        placeholder="Group name"
        buttonLabel="Add group"
        onSubmit={(groupName) => createGroup(board.id, groupName)}
      />
    </div>
  );
}
