import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getBoardForUser } from "@/lib/queries";
import { TopNav } from "@/components/TopNav";
import { BoardView } from "@/components/BoardView";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const board = await getBoardForUser(boardId, session.user.id);
  if (!board) notFound();

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg-gradient)" }}>
      <TopNav userName={session.user.name ?? session.user.email ?? "Account"} />
      <div className="border-b border-[var(--border)] bg-[var(--surface)]/60 px-6 py-2">
        <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          &larr; All workspaces
        </Link>
      </div>
      <main className="flex-1 overflow-x-auto px-6 py-6">
        <BoardView board={board} members={board.workspace.members.map((m) => m.user)} />
      </main>
    </div>
  );
}
