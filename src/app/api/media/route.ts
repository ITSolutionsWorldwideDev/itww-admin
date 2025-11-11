// src/app/api/media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, AuthTokenPayload } from "@/lib/auth";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";
import { mkdir } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public", "uploads");

async function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

// --------------------------
// GET - List or Single Media
// --------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const result = await pool.query(`SELECT * FROM media WHERE media_id = $1`, [id]);
      return NextResponse.json(result.rows[0] || null, {
        status: result.rows.length ? 200 : 404,
      });
    }

    const result = await pool.query(`SELECT * FROM media ORDER BY created_at DESC`);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

// --------------------------
// POST - Upload Media File
// --------------------------
export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");
    const user = verifyJWT(token || "") as AuthTokenPayload | null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const module_ref = (formData.get("module_ref") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const modulePath = path.join(uploadDir, module_ref);
    await ensureDirExists(modulePath);

    const filePath = path.join(modulePath, fileName);
    await fs.promises.writeFile(filePath, buffer);

    const dbPath = `/uploads/${module_ref}/${fileName}`;

    const result = await pool.query(
      `INSERT INTO media (file_name, file_path, file_type, module_ref, uploaded_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [fileName, dbPath, file.type, module_ref, user.id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

// --------------------------
// DELETE - Delete Media File
// --------------------------
export async function DELETE(req: NextRequest) {
  try {
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const user = verifyJWT(token || "") as AuthTokenPayload | null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing media ID" }, { status: 400 });

    const result = await pool.query(`SELECT * FROM media WHERE media_id = $1`, [id]);
    if (result.rows.length === 0)
      return NextResponse.json({ error: "Media not found" }, { status: 404 });

    const media = result.rows[0];
    const filePath = path.join(process.cwd(), "public", media.file_path);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    await pool.query(`DELETE FROM media WHERE media_id = $1`, [id]);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
