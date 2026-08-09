import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getWorkspacesForUser } from "@/lib/queries";
import { TopNav } from "@/components/TopNav";
import { WorkspaceSection } from "@/components/WorkspaceSection";
import { InlineCreateForm } from "@/components/InlineCreateForm";
import { createWorkspace } from "@/lib/actions";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const workspaces = await getWorkspacesForUser(session.user.id);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg-gradient)" }}>
      <TopNav userName={session.user.name ?? session.user.email ?? "Account"} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-[#e9d5ff] to-[#f5d0fe] bg-clip-text text-2xl font-bold text-transparent">
            Your workspaces
          </h1>
          <InlineCreateForm
            placeholder="Workspace name"
            buttonLabel="New workspace"
            onSubmit={async (name) => {
              "use server";
              await createWorkspace(name);
            }}
          />
        </div>

        {workspaces.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            No workspaces yet. Create one to get started.
          </p>
        )}

        <div className="space-y-8">
          {workspaces.map((workspace) => (
            <WorkspaceSection key={workspace.id} workspace={workspace} />
          ))}
        </div>
      </main>
    </div>
  );
}
