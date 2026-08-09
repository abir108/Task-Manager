"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(date: Date | null) {
  if (!date) return "Set date";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function DateCell({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseISODate(value);
  const [viewDate, setViewDate] = useState(() => selected ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) setViewDate(selected ?? new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const today = useMemo(() => new Date(), []);

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [viewDate]);

  function isSameDay(a: Date | null, b: Date | null) {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  return (
    <div ref={ref} className="relative h-full w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-full w-full items-center justify-start gap-1.5 px-2 py-2 text-left text-sm ${
          selected ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
        } hover:bg-[var(--surface-hover)]`}
      >
        <span aria-hidden>📅</span>
        {formatDisplay(selected)}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl shadow-black/40">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="rounded px-2 py-1 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="rounded px-2 py-1 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAY_LABELS.map((label, i) => (
              <div key={i} className="text-[10px] font-medium text-[var(--text-muted)]">
                {label}
              </div>
            ))}
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const isSelected = isSameDay(day, selected);
              const isToday = isSameDay(day, today);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(toISODate(day));
                    setOpen(false);
                  }}
                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs transition ${
                    isSelected
                      ? "text-white"
                      : isToday
                        ? "text-[var(--accent-2)] ring-1 ring-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                  }`}
                  style={isSelected ? { background: "var(--accent-gradient)" } : undefined}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-2">
            <button
              type="button"
              onClick={() => {
                onChange(toISODate(new Date()));
                setOpen(false);
              }}
              className="text-xs font-medium text-[var(--accent-2)] hover:underline"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
