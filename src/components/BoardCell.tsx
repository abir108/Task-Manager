"use client";

import { useTransition } from "react";
import { setColumnValue } from "@/lib/actions";
import { parseStatusOptions } from "@/lib/types";
import { TextCell } from "@/components/cells/TextCell";
import { DateCell } from "@/components/cells/DateCell";
import { PersonCell } from "@/components/cells/PersonCell";
import { StatusCell } from "@/components/cells/StatusCell";
import type { BoardColumn, BoardMember } from "@/lib/boardTypes";

export function BoardCell({
  boardId,
  itemId,
  column,
  value,
  members,
}: {
  boardId: string;
  itemId: string;
  column: BoardColumn;
  value: string;
  members: BoardMember[];
}) {
  const [, startTransition] = useTransition();

  function handleChange(next: string) {
    startTransition(() => {
      setColumnValue(boardId, itemId, column.id, next || null);
    });
  }

  switch (column.type) {
    case "STATUS":
      return (
        <StatusCell
          value={value}
          options={parseStatusOptions(column.options)}
          onChange={handleChange}
        />
      );
    case "PERSON":
      return <PersonCell value={value} members={members} onChange={handleChange} />;
    case "DATE":
      return <DateCell value={value} onChange={handleChange} />;
    case "NUMBER":
      return <TextCell type="number" value={value} onChange={handleChange} />;
    default:
      return <TextCell type="text" value={value} onChange={handleChange} />;
  }
}
