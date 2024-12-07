import { NextResponse } from "next/server";
import db from "@/app/db";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id;

  try {
    // 데이터베이스에서 사용자 이미지 가져오기
    const user = await db.user.findUnique({
      where: { id: Number(userId) },
      select: { profileImage: true },
    });

    if (!user || !user.profileImage) {
      return NextResponse.json({
        success: false,
        image: null,
        error: "No profile image found",
      });
    }

    // Blob 데이터를 Base64로 변환
    const base64Image = user.profileImage.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      image: dataUrl,
    });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch profile image",
    });
  }
}
