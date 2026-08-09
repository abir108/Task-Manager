"use client";

import { useEffect, useRef, useState } from "react";
import type { StatusOption } from "@/lib/types";

export function StatusCell({
  value,
  options,
  onChange,
}: {
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.label === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-full w-full items-center justify-center text-sm font-medium text-white shadow-inner shadow-black/10"
        style={{ backgroundColor: selected?.color ?? "#4c3980" }}
      >
        {selected?.label ?? "—"}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-40 rounded-md border border-[var(--border)] bg-[var(--surface)] py-1 shadow-xl shadow-black/40">
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                onChange(option.label);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
            >
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: option.color }}
              />
              {option.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="mt-1 w-full border-t border-[var(--border)] px-3 py-1.5 text-left text-xs text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
