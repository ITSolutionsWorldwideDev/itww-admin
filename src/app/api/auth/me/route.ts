// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded: any = verifyJWT(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const user = await db.user.findUnique({ where: { id: decoded.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user });
}
