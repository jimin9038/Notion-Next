"use server";

import db from "@/app/db";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export async function createPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/signIn");
  }

  return await db.page.create({
    data: {
      title: "Untitled",
      content: "",
      userId: Number(session.user.id),
    },
  });
}

export async function getPage(id: number) {
  const session = await auth();
  console.log(session);
  if (!session || !session.user || !session.user.id) {
    console.log("Not authenticated in getPage");
    redirect("/signIn");
  }
  return await db.page.findUnique({
    where: { id },
  });
}

export async function getPages() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    console.log("Not authenticated in getPage");
    redirect("/signIn");
  }
  return await db.page.findMany();
}

export async function updatePage(
  id: number,
  title: string,
  content: string,
  pin: boolean
) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return await db.page.update({
    where: { id },
    data: {
      title,
      content,
      pin,
    },
  });
}

export async function deletePage(id: number) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return await db.page.delete({
    where: { id },
  });
}
