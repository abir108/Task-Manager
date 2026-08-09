"use client";

import { useState, useTransition } from "react";

export function InlineCreateForm({
  placeholder,
  buttonLabel,
  onSubmit,
}: {
  placeholder: string;
  buttonLabel: string;
  onSubmit: (value: string) => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-dashed border-[var(--border-light)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
      >
        + {buttonLabel}
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        startTransition(async () => {
          await onSubmit(value.trim());
          setValue("");
          setOpen(false);
        });
      }}
      className="flex items-center gap-2"
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="rounded-md border border-[var(--border)] bg-[var(--bg-deep)]/60 px-2 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
        onBlur={() => {
          if (!value.trim()) setOpen(false);
        }}
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        style={{ background: "var(--accent-gradient)" }}
      >
        {isPending ? "..." : buttonLabel}
      </button>
    </form>
  );
}
