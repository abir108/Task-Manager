"use client";

import { useState } from "react";

export function TextCell({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  const [draft, setDraft] = useState(value);

  return (
    <input
      type={type}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== value) onChange(draft);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      className="h-full w-full border-none bg-transparent px-2 py-2 text-sm text-[var(--text-primary)] caret-[var(--accent)] focus:bg-[var(--surface-hover)] focus:outline focus:outline-2 focus:outline-[var(--accent)]"
    />
  );
}
