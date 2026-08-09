"use client";

export function PersonCell({
  value,
  members,
  onChange,
}: {
  value: string;
  members: { id: string; name: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-full w-full cursor-pointer border-none bg-transparent px-2 py-2 text-sm text-[var(--text-primary)] focus:bg-[var(--surface-hover)] focus:outline focus:outline-2 focus:outline-[var(--accent)]"
    >
      <option value="" className="bg-[var(--surface)] text-[var(--text-primary)]">
        Unassigned
      </option>
      {members.map((m) => (
        <option key={m.id} value={m.id} className="bg-[var(--surface)] text-[var(--text-primary)]">
          {m.name}
        </option>
      ))}
    </select>
  );
}
