import { NextResponse } from "next/server";
import db from "@/app/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  try {
    const buffer = await req.arrayBuffer(); // 이미지 데이터를 가져옵니다.
    const blob = Buffer.from(buffer); // Blob으로 변환

    // 데이터베이스에 Blob 저장
    await db.user.update({
      where: { id: Number(userId) },
      data: { profileImage: blob },
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
