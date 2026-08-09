"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_OPTIONS, type ColumnType } from "@/lib/types";

async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

async function requireBoardAccess(boardId: string, userId: string) {
  const board = await prisma.board.findFirst({
    where: { id: boardId, workspace: { members: { some: { userId } } } },
    select: { id: true, workspaceId: true },
  });
  if (!board) throw new Error("Board not found or access denied");
  return board;
}

export async function createWorkspace(name: string) {
  const userId = await requireUserId();
  const workspace = await prisma.workspace.create({
    data: {
      name,
      members: { create: { userId, role: "OWNER" } },
    },
  });
  revalidatePath("/");
  return workspace;
}

export async function createBoard(workspaceId: string, name: string) {
  const userId = await requireUserId();
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
  if (!membership) throw new Error("Access denied");

  const boardCount = await prisma.board.count({ where: { workspaceId } });

  const board = await prisma.board.create({
    data: {
      name,
      workspaceId,
      position: boardCount,
      columns: {
        create: [
          { name: "Status", type: "STATUS", position: 0, options: JSON.stringify(STATUS_OPTIONS) },
          { name: "Person", type: "PERSON", position: 1 },
          { name: "Date", type: "DATE", position: 2 },
        ],
      },
      groups: {
        create: [{ name: "To Do", color: "#579bfc", position: 0 }],
      },
    },
  });

  revalidatePath("/");
  return board;
}

export async function createGroup(boardId: string, name: string) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  const groupCount = await prisma.group.count({ where: { boardId } });
  const group = await prisma.group.create({
    data: { boardId, name, position: groupCount },
  });

  revalidatePath(`/board/${boardId}`);
  return group;
}

export async function createItem(boardId: string, groupId: string, name: string) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  const itemCount = await prisma.item.count({ where: { groupId } });
  const item = await prisma.item.create({
    data: { groupId, name, position: itemCount, createdById: userId },
  });

  revalidatePath(`/board/${boardId}`);
  return item;
}

export async function createSubItem(boardId: string, parentItemId: string, name: string) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  const parent = await prisma.item.findUniqueOrThrow({
    where: { id: parentItemId },
    select: { groupId: true },
  });

  const subItemCount = await prisma.item.count({ where: { parentItemId } });
  const subItem = await prisma.item.create({
    data: {
      groupId: parent.groupId,
      parentItemId,
      name,
      position: subItemCount,
      createdById: userId,
    },
  });

  revalidatePath(`/board/${boardId}`);
  return subItem;
}

export async function renameItem(boardId: string, itemId: string, name: string) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  await prisma.item.update({ where: { id: itemId }, data: { name } });
  revalidatePath(`/board/${boardId}`);
}

export async function deleteItem(boardId: string, itemId: string) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  await prisma.item.delete({ where: { id: itemId } });
  revalidatePath(`/board/${boardId}`);
}

export async function deleteGroup(boardId: string, groupId: string) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  await prisma.group.delete({ where: { id: groupId } });
  revalidatePath(`/board/${boardId}`);
}

export async function createColumn(boardId: string, name: string, type: ColumnType) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  const columnCount = await prisma.column.count({ where: { boardId } });
  const options = type === "STATUS" ? JSON.stringify(STATUS_OPTIONS) : null;

  const column = await prisma.column.create({
    data: { boardId, name, type, position: columnCount, options },
  });

  revalidatePath(`/board/${boardId}`);
  return column;
}

export async function deleteColumn(boardId: string, columnId: string) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  await prisma.column.delete({ where: { id: columnId } });
  revalidatePath(`/board/${boardId}`);
}

export async function setColumnValue(
  boardId: string,
  itemId: string,
  columnId: string,
  value: string | null
) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  await prisma.columnValue.upsert({
    where: { itemId_columnId: { itemId, columnId } },
    create: { itemId, columnId, value },
    update: { value },
  });

  revalidatePath(`/board/${boardId}`);
}

export async function renameBoard(boardId: string, name: string) {
  const userId = await requireUserId();
  await requireBoardAccess(boardId, userId);

  await prisma.board.update({ where: { id: boardId }, data: { name } });
  revalidatePath(`/board/${boardId}`);
  revalidatePath("/");
}
