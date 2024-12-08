import { NextResponse } from "next/server";
import db from "@/app/db";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id;

  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ success: false, error: "No image provided" });
    }

    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    await db.user.update({
      where: { id: Number(userId) },
      data: { profileImage: buffer },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to upload profile image.",
    });
  }
}
