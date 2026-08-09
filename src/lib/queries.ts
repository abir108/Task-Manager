import { prisma } from "@/lib/prisma";

export async function getWorkspacesForUser(userId: string) {
  return prisma.workspace.findMany({
    where: { members: { some: { userId } } },
    include: {
      boards: { orderBy: { position: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getBoardForUser(boardId: string, userId: string) {
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      workspace: { members: { some: { userId } } },
    },
    include: {
      workspace: {
        include: { members: { include: { user: true } } },
      },
      columns: { orderBy: { position: "asc" } },
      groups: {
        orderBy: { position: "asc" },
        include: {
          items: {
            where: { parentItemId: null },
            orderBy: { position: "asc" },
            include: {
              columnValues: true,
              subItems: {
                orderBy: { position: "asc" },
                include: { columnValues: true },
              },
            },
          },
        },
      },
    },
  });

  return board;
}
