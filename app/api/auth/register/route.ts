import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import db from "@/app/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const hashedPassword = await hash(password, 10);

    const res = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        pages: {
          create: [
            {
              title: "Untitled",
              content: "",
            },
          ],
        },
      },
    });
    return NextResponse.json({ user: res }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
