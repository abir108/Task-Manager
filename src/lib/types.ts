export const COLUMN_TYPES = ["TEXT", "STATUS", "PERSON", "DATE", "NUMBER"] as const;
export type ColumnType = (typeof COLUMN_TYPES)[number];

export const WORKSPACE_ROLES = ["OWNER", "MEMBER"] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export const STATUS_OPTIONS = [
  { label: "Not Started", color: "#c4c4c4" },
  { label: "Working on it", color: "#fdab3d" },
  { label: "Stuck", color: "#e2445c" },
  { label: "Done", color: "#00c875" },
] as const;

export type StatusOption = { label: string; color: string };

export function parseStatusOptions(options: string | null): StatusOption[] {
  if (!options) return [...STATUS_OPTIONS];
  try {
    const parsed = JSON.parse(options);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to default
  }
  return [...STATUS_OPTIONS];
}
