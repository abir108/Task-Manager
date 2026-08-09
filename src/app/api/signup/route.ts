import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { STATUS_OPTIONS } from "@/lib/types";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      memberships: {
        create: {
          role: "OWNER",
          workspace: {
            create: {
              name: "My Workspace",
              boards: {
                create: {
                  name: "My Board",
                  position: 0,
                  columns: {
                    create: [
                      { name: "Status", type: "STATUS", position: 0, options: JSON.stringify(STATUS_OPTIONS) },
                      { name: "Person", type: "PERSON", position: 1 },
                      { name: "Date", type: "DATE", position: 2 },
                    ],
                  },
                  groups: {
                    create: [
                      { name: "To Do", color: "#579bfc", position: 0 },
                      { name: "In Progress", color: "#fdab3d", position: 1 },
                      { name: "Done", color: "#00c875", position: 2 },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
